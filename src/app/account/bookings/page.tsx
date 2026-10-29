import { CalendarDays, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { formatSessionDate, todayInSouthAfrica, toHourMinute } from '@/lib/sessions'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'My bookings',
  robots: { index: false },
  referrer: 'no-referrer',
}

export default function MyBookingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-10 pb-24 sm:px-6">
        <h1 className="mb-8 text-headline font-wide">My bookings</h1>
        <Suspense
          fallback={<div aria-busy className="h-64 animate-pulse rounded-sheet bg-surface" />}
        >
          <BookingList />
        </Suspense>
      </main>
    </>
  )
}

type Row = {
  id: string
  access_token: string
  status: string
  booking_date: string | null
  start_time: string | null
  guest_count: number | null
  total_amount: number | null
  expires_at: string | null
  experience_snapshot: { title?: string; location?: string; main_image_url?: string } | null
}

async function BookingList() {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims.sub) redirect('/signin?next=/account/bookings')

  // Row-level security limits this to the signed-in customer's own bookings.
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, access_token, status, booking_date, start_time, guest_count, total_amount, expires_at, experience_snapshot',
    )
    .eq('customer_id', claims.claims.sub)
    .order('booking_date', { ascending: true })
    .returns<Row[]>()

  if (error) throw new Error(`Failed to load bookings: ${error.message}`)

  const { upcoming, past } = splitBookings(data)

  if (upcoming.length + past.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sheet border border-line px-6 py-12 sm:px-10">
        <h2 className="text-title font-semibold">No bookings yet</h2>
        <p className="max-w-[52ch] text-ink/65">
          Bookings you make while signed in, or with this email address, appear here.
        </p>
        <Link href="/experiences" className={buttonVariants()}>
          Find an experience
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12">
      {upcoming.length > 0 ? <Group title="Upcoming" rows={upcoming} /> : null}
      {past.length > 0 ? <Group title="Past and cancelled" rows={past} muted /> : null}
    </div>
  )
}

// Lapsed holds are noise to customers, so they're hidden rather than listed as expired.
function splitBookings(rows: Row[]) {
  const today = todayInSouthAfrica()
  const now = Date.now()
  const visible = rows.filter(
    (row) => !(row.status === 'pending' && row.expires_at && Date.parse(row.expires_at) <= now),
  )
  const upcoming = visible.filter(
    (row) => (row.booking_date ?? '') >= today && row.status !== 'cancelled',
  )
  const past = visible.filter((row) => !upcoming.includes(row)).reverse()
  return { upcoming, past }
}

function Group({ title, rows, muted = false }: { title: string; rows: Row[]; muted?: boolean }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title font-semibold">{title}</h2>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/bookings/${row.id}?token=${row.access_token}`}
              className={cn(
                'flex gap-4 rounded-sheet border border-line bg-control p-4 transition-colors hover:border-ink/30',
                muted && 'opacity-75',
              )}
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-control bg-surface">
                {row.experience_snapshot?.main_image_url ? (
                  <Image
                    src={row.experience_snapshot.main_image_url}
                    alt=""
                    fill
                    sizes="5rem"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="leading-snug font-semibold">
                    {row.experience_snapshot?.title ?? 'Experience'}
                  </p>
                  <StatusChip status={row.status} />
                </div>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink/65">
                  {row.booking_date ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" aria-hidden />
                      {formatSessionDate(row.booking_date, 'short')}
                      {row.start_time ? `, ${toHourMinute(row.start_time)}` : ''}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden />
                    {row.guest_count ?? 1} {row.guest_count === 1 ? 'guest' : 'guests'}
                  </span>
                  {row.total_amount !== null ? (
                    <span>{formatRand(Number(row.total_amount))}</span>
                  ) : null}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

const STATUS: Record<string, { label: string; tone: 'neutral' | 'accent' }> = {
  paid: { label: 'Confirmed', tone: 'accent' },
  pending: { label: 'Awaiting payment', tone: 'neutral' },
  failed: { label: 'Payment failed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  expired: { label: 'Expired', tone: 'neutral' },
}

function StatusChip({ status }: { status: string }) {
  const { label, tone } = STATUS[status] ?? { label: status, tone: 'neutral' as const }
  return (
    <Chip tone={tone} className="shrink-0">
      {label}
    </Chip>
  )
}
