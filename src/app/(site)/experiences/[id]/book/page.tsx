import { CalendarDays, Clock, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod'

import { BookingForm } from '@/components/booking/booking-form'
import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'
import { getSessions } from '@/lib/data/bookings'
import { getExperience } from '@/lib/data/experiences'
import { formatRand } from '@/lib/format'
import { quote } from '@/lib/pricing'
import { formatSessionDate } from '@/lib/sessions'

export const metadata: Metadata = {
  title: 'Confirm your booking',
  robots: { index: false },
}

const selection = z.object({
  date: z.iso.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1).max(30),
  creator: z
    .string()
    .regex(/^[a-z0-9-]{1,80}$/)
    .optional()
    .catch(undefined),
})

export default function BookPage({ params, searchParams }: PageProps<'/experiences/[id]/book'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        <Suspense
          fallback={<div aria-busy className="h-96 animate-pulse rounded-sheet bg-surface" />}
        >
          {Promise.all([params, searchParams]).then(([{ id }, query]) => (
            <Checkout id={id} query={query} />
          ))}
        </Suspense>
      </main>
    </>
  )
}

async function Checkout({
  id,
  query,
}: {
  id: string
  query: Record<string, string | string[] | undefined>
}) {
  const experience = await getExperience(id)
  if (!experience) notFound()

  const parsed = selection.safeParse({
    date: query.date,
    time: query.time,
    guests: query.guests,
    creator: query.creator,
  })
  const back = `/experiences/${experience.id}#book`

  if (!parsed.success) {
    return <Unavailable back={back} message="Choose a date and time to book this experience." />
  }

  const { date, time, guests, creator } = parsed.data
  const sessions = await getSessions(experience.id)
  const session = sessions.find((s) => s.date === date && s.time === time)

  if (!session) {
    return (
      <Unavailable
        back={back}
        message="That session is no longer available. Choose another time."
      />
    )
  }
  if (session.remaining < guests) {
    return (
      <Unavailable
        back={back}
        message={`Only ${session.remaining} ${session.remaining === 1 ? 'spot is' : 'spots are'} left for that session. Choose fewer guests or another time.`}
      />
    )
  }

  const { total } = quote(experience.price, guests)

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <Link href={back} className="text-caption text-ink/60 hover:text-ink hover:underline">
            Back to experience
          </Link>
          <h1 className="text-headline font-wide">Confirm your booking</h1>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-title font-semibold">Your booking</h2>
            <Link href={back} className="text-caption font-semibold underline underline-offset-4">
              Change
            </Link>
          </div>
          <ul className="flex flex-col gap-3 text-ink/80">
            <li className="flex items-center gap-3">
              <CalendarDays className="size-5 text-ink/60" aria-hidden />
              {formatSessionDate(date)}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-5 text-ink/60" aria-hidden />
              {time}
              {experience.duration ? `, ${experience.duration}` : ''}
            </li>
            <li className="flex items-center gap-3">
              <Users className="size-5 text-ink/60" aria-hidden />
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-5 border-t border-line pt-8">
          <h2 className="text-title font-semibold">Your details</h2>
          <BookingForm
            experienceId={experience.id}
            date={date}
            time={time}
            guests={guests}
            creator={creator}
            totalLabel={formatRand(total)}
          />
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-5 rounded-sheet border border-line bg-control p-6 shadow-float">
          <div className="flex gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-control bg-surface">
              <Image
                src={experience.images[0] ?? ''}
                alt=""
                fill
                sizes="6rem"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="leading-snug font-semibold">{experience.title}</p>
              <p className="text-caption text-ink/60">{experience.location}</p>
            </div>
          </div>
          <dl className="flex justify-between gap-4 border-t border-line pt-4 text-body font-semibold">
            <dt>
              {formatRand(experience.price)} × {guests} {guests === 1 ? 'guest' : 'guests'}
            </dt>
            <dd>{formatRand(total)}</dd>
          </dl>
          {experience.cancellationPolicy ? (
            <p className="text-caption text-ink/65">{experience.cancellationPolicy}</p>
          ) : null}
        </div>
      </aside>
    </div>
  )
}

function Unavailable({ back, message }: { back: string; message: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-sheet border border-line px-6 py-12 sm:px-10">
      <h1 className="text-title font-semibold">Let&apos;s pick another time</h1>
      <p className="max-w-[52ch] text-ink/65">{message}</p>
      <Link href={back} className={buttonVariants()}>
        See available times
      </Link>
    </div>
  )
}
