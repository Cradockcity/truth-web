import { CircleCheck, Hourglass, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CancelBookingForm } from '@/components/admin/cancel-booking-form'
import { StatusChip } from '@/components/admin/status-chip'
import { type AdminBooking, getAdminBooking, syncRefundStatus } from '@/lib/admin/bookings'
import { isUuid } from '@/lib/data/experiences'
import { formatRand } from '@/lib/format'
import { formatSessionDate } from '@/lib/sessions'

export const metadata = { title: 'Booking' }

const when = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Johannesburg',
})

export default async function AdminBookingPage({ params }: PageProps<'/admin/bookings/[id]'>) {
  const { id } = await params
  const found = isUuid(id) ? await getAdminBooking(id) : null
  if (!found) notFound()
  const booking = await syncRefundStatus(found)

  const open =
    booking.status === 'paid' || booking.status === 'pending' || booking.status === 'expired'

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/bookings"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All bookings
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-headline font-wide">
            Booking {booking.id.slice(0, 8).toUpperCase()}
          </h1>
          <StatusChip status={booking.status} />
        </div>
      </div>

      {booking.refundAmount ? <RefundBanner booking={booking} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Session">
          <Row label="Experience">{booking.title}</Row>
          <Row label="Date">{booking.date ? formatSessionDate(booking.date) : '—'}</Row>
          <Row label="Time">{booking.time ?? '—'}</Row>
          <Row label="Guests">{booking.guests}</Row>
        </Panel>

        <Panel title="Customer">
          <Row label="Name">{booking.customerName ?? '—'}</Row>
          <Row label="Email">
            {booking.customerEmail ? (
              <a href={`mailto:${booking.customerEmail}`} className="underline underline-offset-4">
                {booking.customerEmail}
              </a>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Phone">
            {booking.customerPhone ? (
              <a
                href={`tel:${booking.customerPhone.replace(/\s/g, '')}`}
                className="underline underline-offset-4"
              >
                {booking.customerPhone}
              </a>
            ) : (
              '—'
            )}
          </Row>
        </Panel>

        <Panel title="Payment">
          <Row label="Experience">{formatRand(booking.subtotal)}</Row>
          <Row label="Service fee">{formatRand(booking.fee)}</Row>
          <Row label="Total">
            <strong>{formatRand(booking.total)}</strong>
          </Row>
          <Row label="Paid">
            {booking.paidAt ? when.format(new Date(booking.paidAt)) : 'Not paid'}
          </Row>
          <Row label="Paystack reference">
            <span className="font-mono text-caption">{booking.paymentReference ?? '—'}</span>
          </Row>
        </Panel>

        <Panel title="History">
          <Row label="Booked">
            {booking.createdAt ? when.format(new Date(booking.createdAt)) : '—'}
          </Row>
          {booking.cancelledAt ? (
            <>
              <Row label="Cancelled">{when.format(new Date(booking.cancelledAt))}</Row>
              <Row label="Reason">{booking.cancellationReason ?? '—'}</Row>
              <Row label="Refund">
                {booking.refundAmount !== null
                  ? `${formatRand(booking.refundAmount)}${booking.refundStatus ? ` (${booking.refundStatus})` : ''}`
                  : 'None'}
              </Row>
            </>
          ) : null}
        </Panel>
      </div>

      {open ? (
        <section className="flex flex-col gap-4 rounded-sheet border border-danger/30 p-6">
          <h2 className="text-title font-semibold">Cancel this booking</h2>
          <CancelBookingForm
            bookingId={booking.id}
            paid={booking.status === 'paid'}
            total={booking.total}
            fee={booking.fee}
          />
        </section>
      ) : null}
    </div>
  )
}

function RefundBanner({ booking }: { booking: AdminBooking }) {
  const amount = formatRand(booking.refundAmount ?? 0)
  const content =
    booking.refundStatus === 'processed'
      ? {
          icon: CircleCheck,
          title: `Refunded ${amount}`,
          body: booking.refundedAt
            ? `Paystack completed the refund on ${when.format(new Date(booking.refundedAt))}.`
            : 'Paystack completed the refund.',
        }
      : booking.refundStatus === 'failed'
        ? {
            icon: TriangleAlert,
            title: `Refund of ${amount} failed`,
            body: 'Paystack couldn’t complete it. Open the payment in your Paystack dashboard to retry.',
          }
        : {
            icon: Hourglass,
            title: `Refund of ${amount} processing`,
            body: 'Paystack has accepted the refund and is sending it to the guest. This page updates when it completes.',
          }

  const Icon = content.icon
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-sheet border border-line bg-surface p-5"
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{content.title}</p>
        <p className="text-caption text-ink/70">{content.body}</p>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-sheet border border-line bg-control p-5">
      <h2 className="font-semibold">{title}</h2>
      <dl className="flex flex-col gap-2 text-caption">{children}</dl>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/60">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}
