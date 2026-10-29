'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { Stepper } from '@/components/ui/stepper'
import { loadSessions } from '@/lib/actions/booking'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { quote } from '@/lib/pricing'
import { formatSessionDate, type Session } from '@/lib/sessions'

const PREVIEW_COUNT = 4

export function BookingWidget({
  experienceId,
  price,
  maxGuests,
}: {
  experienceId: string
  price: number
  maxGuests: number
}) {
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [guests, setGuests] = useState(1)
  const [selected, setSelected] = useState<Session | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadSessions(experienceId)
      .then((result) => {
        if (!cancelled) setSessions(result)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [experienceId])

  const open = useMemo(
    () => (sessions ?? []).filter((session) => session.remaining >= guests),
    [sessions, guests],
  )
  const choice = selected && selected.remaining >= guests ? selected : null
  const { subtotal, fee, total } = quote(price, guests)

  const bookHref = choice
    ? `/experiences/${experienceId}/book?${new URLSearchParams({
        date: choice.date,
        time: choice.time,
        guests: String(guests),
      })}`
    : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">Guests</span>
        <Stepper label="Guests" value={guests} min={1} max={maxGuests} onChange={setGuests} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Choose a time</legend>
        {failed ? (
          <p className="text-caption text-danger">
            We couldn&apos;t load available times. Refresh the page to try again.
          </p>
        ) : sessions === null ? (
          <div aria-busy className="flex flex-col gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-[3.75rem] animate-pulse rounded-control bg-surface" />
            ))}
          </div>
        ) : open.length === 0 ? (
          <p className="rounded-control bg-surface px-4 py-3 text-caption text-ink/70">
            {sessions.length === 0
              ? 'No sessions are open in the next two months.'
              : `No sessions have space for ${guests} guests. Try fewer guests.`}
          </p>
        ) : (
          <>
            <SessionList
              sessions={open.slice(0, PREVIEW_COUNT)}
              selected={choice}
              onSelect={setSelected}
              name="session-preview"
            />
            {open.length > PREVIEW_COUNT ? (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-1 cursor-pointer self-start text-caption font-semibold underline underline-offset-4 hover:text-ink/70"
              >
                Show all {open.length} dates
              </button>
            ) : null}
          </>
        )}
      </fieldset>

      {choice ? (
        <dl className="flex flex-col gap-2 border-t border-line pt-4 text-caption">
          <div className="flex justify-between gap-4 text-ink/75">
            <dt>
              {formatRand(price)} × {guests} {guests === 1 ? 'guest' : 'guests'}
            </dt>
            <dd>{formatRand(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-ink/75">
            <dt>Service fee</dt>
            <dd>{formatRand(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 pt-1 text-body font-semibold">
            <dt>Total</dt>
            <dd>{formatRand(total)}</dd>
          </div>
        </dl>
      ) : null}

      {bookHref ? (
        <Link href={bookHref} className={buttonVariants({ size: 'lg', className: 'w-full' })}>
          Reserve
        </Link>
      ) : (
        <p className="text-center text-caption text-ink/60">Choose a time to see the total</p>
      )}

      <Sheet open={showAll} onClose={() => setShowAll(false)} title="All available dates">
        <SessionList
          sessions={open}
          selected={choice}
          onSelect={(session) => {
            setSelected(session)
            setShowAll(false)
          }}
          name="session-all"
        />
      </Sheet>
    </div>
  )
}

function SessionList({
  sessions,
  selected,
  onSelect,
  name,
}: {
  sessions: Session[]
  selected: Session | null
  onSelect: (session: Session) => void
  name: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => {
        const key = `${session.date}T${session.time}`
        const checked = selected?.date === session.date && selected.time === session.time
        return (
          <label
            key={key}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3 rounded-control border px-4 py-3 transition-colors',
              checked ? 'border-ink bg-surface' : 'border-line hover:border-ink/40',
            )}
          >
            <input
              type="radio"
              name={name}
              value={key}
              checked={checked}
              onChange={() => onSelect(session)}
              className="sr-only"
            />
            <span className="flex flex-col">
              <span className="font-medium">{formatSessionDate(session.date)}</span>
              <span className="text-caption text-ink/60">{session.time}</span>
            </span>
            {session.remaining <= 4 ? (
              <span className="text-caption font-medium text-saved">
                {session.remaining === 1 ? '1 spot left' : `${session.remaining} spots left`}
              </span>
            ) : null}
          </label>
        )
      })}
    </div>
  )
}
