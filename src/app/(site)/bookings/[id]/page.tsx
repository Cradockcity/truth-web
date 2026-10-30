import { CalendarDays, CircleCheck, Clock, Hourglass, TriangleAlert, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { HoldCountdown } from '@/components/booking/hold-countdown'
import { PayButton } from '@/components/booking/pay-button'
import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { type BookingView, getBooking } from '@/lib/data/bookings'
import { formatRand } from '@/lib/format'
import { formatSessionDate } from '@/lib/sessions'

export const metadata: Metadata = {
  title: 'Your booking',
  robots: { index: false },
  // The private token is in the URL: never send it to other sites as a Referer.
  referrer: 'no-referrer',
}

export default function BookingPage({ params, searchParams }: PageProps<'/bookings/[id]'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-24 sm:px-6">
        <Suspense
          fallback={<div aria-busy className="h-96 animate-pulse rounded-sheet bg-surface" />}
        >
          {Promise.all([params, searchParams]).then(([{ id }, query]) => (
            <BookingDetails
              id={id}
              token={typeof query.token === 'string' ? query.token : null}
              payment={typeof query.payment === 'string' ? query.payment : null}
            />
          ))}
        </Suspense>
      </main>
    </>
  )
}

const PAYMENT_MESSAGES: Record<string, string> = {
  unpaid: "Your payment wasn't completed. You can try again while your seats are held.",
  amount_mismatch:
    "The amount paid didn't match this booking. We've paused it; contact us and we'll sort it out.",
  sold_out:
    'Your payment came through after the hold expired and the seats had been taken. We will refund you in full.',
  not_payable:
    'This booking could not take a payment. If you were charged, contact us for a refund.',
}

async function BookingDetails({
  id,
  token,
  payment,
}: {
  id: string
  token: string | null
  payment: string | null
}) {
  const booking = await getBooking(id, token)
  if (!booking) notFound()
  const paymentMessage = payment ? PAYMENT_MESSAGES[payment] : undefined

  return (
    <div className="flex flex-col gap-8">
      {paymentMessage ? (
        <p
          role="alert"
          className="rounded-control border border-line bg-surface px-4 py-3 text-ink/80"
        >
          {paymentMessage}
        </p>
      ) : null}
      <StatusBanner booking={booking} token={token} />

      <section className="flex flex-col gap-6 rounded-sheet border border-line bg-control p-6 shadow-float sm:p-8">
        <div className="flex gap-4">
          {booking.imageUrl ? (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-control bg-surface sm:size-24">
              <Image src={booking.imageUrl} alt="" fill sizes="6rem" className="object-cover" />
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <h2 className="text-lead leading-snug font-semibold">{booking.title}</h2>
            {booking.location ? (
              <p className="text-caption text-ink/60">{booking.location}</p>
            ) : null}
            <p className="text-caption text-ink/60">
              Booking {booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <ul className="grid gap-3 text-ink/80 sm:grid-cols-3">
          {booking.date ? (
            <li className="flex items-center gap-3">
              <CalendarDays className="size-5 text-ink/60" aria-hidden />
              {formatSessionDate(booking.date, 'short')}
            </li>
          ) : null}
          {booking.time ? (
            <li className="flex items-center gap-3">
              <Clock className="size-5 text-ink/60" aria-hidden />
              {booking.time}
            </li>
          ) : null}
          <li className="flex items-center gap-3">
            <Users className="size-5 text-ink/60" aria-hidden />
            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
          </li>
        </ul>

        <dl className="flex flex-col gap-2 border-t border-line pt-4 text-caption">
          {booking.fee > 0 ? (
            <>
              <div className="flex justify-between gap-4 text-ink/75">
                <dt>Experience</dt>
                <dd>{formatRand(booking.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-ink/75">
                <dt>Service fee</dt>
                <dd>{formatRand(booking.fee)}</dd>
              </div>
            </>
          ) : null}
          <div
            className={cn(
              'flex justify-between gap-4 text-body font-semibold',
              booking.fee > 0 && 'border-t border-line pt-3',
            )}
          >
            <dt>{booking.status === 'paid' ? 'Paid (ZAR)' : 'Total (ZAR)'}</dt>
            <dd>{formatRand(booking.total)}</dd>
          </div>
        </dl>

        {booking.customerEmail ? (
          <p className="text-caption text-ink/60">
            Booked by {booking.customerName} ({booking.customerEmail})
          </p>
        ) : null}
      </section>

      <p className="text-caption text-ink/55">
        Keep this page&apos;s link private. Anyone with it can see this booking.
      </p>
    </div>
  )
}

function StatusBanner({ booking, token }: { booking: BookingView; token: string | null }) {
  const rebook = booking.experienceId ? `/experiences/${booking.experienceId}#book` : '/experiences'

  switch (booking.status) {
    case 'paid':
      return (
        <Banner icon={CircleCheck} title="You're booked">
          Your seats are confirmed. Show this page to your host on the day.
        </Banner>
      )
    case 'pending':
      return (
        <Banner icon={Hourglass} title="Your seats are held">
          <span>
            Pay within{' '}
            {booking.expiresAt ? <HoldCountdown expiresAt={booking.expiresAt} /> : '20 minutes'} to
            confirm your booking.
          </span>
          {token ? (
            <PayButton
              bookingId={booking.id}
              token={token}
              totalLabel={formatRand(booking.total)}
            />
          ) : (
            <span className="mt-4 block text-caption">
              Open this booking from the link on your confirmation page to pay.
            </span>
          )}
        </Banner>
      )
    case 'expired':
      return (
        <Banner icon={TriangleAlert} title="This hold has expired">
          <span>The seats were released because payment wasn&apos;t completed in time.</span>
          <Link href={rebook} className={buttonVariants({ className: 'mt-4 self-start' })}>
            Choose a new time
          </Link>
        </Banner>
      )
    case 'failed':
    case 'cancelled':
      return (
        <Banner
          icon={TriangleAlert}
          title={
            booking.status === 'failed' ? "Payment didn't go through" : 'This booking was cancelled'
          }
        >
          <Link href={rebook} className={buttonVariants({ className: 'mt-2 self-start' })}>
            Book again
          </Link>
        </Banner>
      )
  }
}

function Banner({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof CircleCheck
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <Icon className="size-8" aria-hidden />
      <h1 className="text-headline font-wide">{title}</h1>
      <div className="flex max-w-[60ch] flex-col text-lead text-ink/75">{children}</div>
    </div>
  )
}
