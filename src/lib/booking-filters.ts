import { z } from 'zod'

// The admin bookings search: read from the URL so a search can be bookmarked or downloaded.

export const BOOKING_STATUSES = ['all', 'paid', 'pending', 'cancelled'] as const
export const BOOKING_WHENS = ['upcoming', 'past', 'all'] as const
export const BOOKINGS_PER_PAGE = 50

export type BookingFilters = {
  status: (typeof BOOKING_STATUSES)[number]
  when: (typeof BOOKING_WHENS)[number]
  q: string | null
  experienceId: string | null
  hostId: string | null
  creatorId: string | null
  from: string | null
  to: string | null
  page: number
}

type Params = Record<string, string | string[] | undefined>

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const pick = <T extends z.ZodType>(schema: T, value: unknown) => {
  const parsed = schema.safeParse(value)
  return parsed.success ? (parsed.data as z.output<T>) : null
}

// "2026-03" → the first and last day of that month.
export function monthRange(month: string): [string, string] | null {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month)
  if (!match) return null
  const lastDay = new Date(Date.UTC(Number(match[1]), Number(match[2]), 0)).getUTCDate()
  return [`${month}-01`, `${month}-${String(lastDay).padStart(2, '0')}`]
}

// Bad or missing values fall back to the defaults instead of failing the page.
// A month fills in From and To when those are empty.
export function parseBookingFilters(params: Params): BookingFilters {
  const month = monthRange(one(params.month) ?? '')
  const from = pick(z.iso.date(), one(params.from)) ?? month?.[0] ?? null
  const to = pick(z.iso.date(), one(params.to)) ?? month?.[1] ?? null
  const q = one(params.q)?.trim().slice(0, 80)
  return {
    status: pick(z.enum(BOOKING_STATUSES), one(params.status)) ?? 'all',
    // A date range replaces Upcoming/Past.
    when: from || to ? 'all' : (pick(z.enum(BOOKING_WHENS), one(params.when)) ?? 'upcoming'),
    q: q || null,
    experienceId: pick(z.guid(), one(params.experience)),
    hostId: pick(z.guid(), one(params.host)),
    creatorId: pick(z.guid(), one(params.creator)),
    from,
    to,
    page: pick(z.coerce.number().int().min(1).max(1000), one(params.page)) ?? 1,
  }
}

// Back to URL parameters, leaving out defaults so links stay short.
export function bookingFiltersToParams(
  filters: BookingFilters,
  changes: Partial<BookingFilters> = {},
) {
  const next = { ...filters, ...changes }
  const params = new URLSearchParams()
  if (next.status !== 'all') params.set('status', next.status)
  if (next.when !== 'upcoming' && !next.from && !next.to) params.set('when', next.when)
  if (next.q) params.set('q', next.q)
  if (next.experienceId) params.set('experience', next.experienceId)
  if (next.hostId) params.set('host', next.hostId)
  if (next.creatorId) params.set('creator', next.creatorId)
  if (next.from) params.set('from', next.from)
  if (next.to) params.set('to', next.to)
  if (next.page > 1) params.set('page', String(next.page))
  return params
}

// The 8-character code shown for a booking is the start of its id.
export const bookingCode = (id: string) => id.slice(0, 8).toUpperCase()

// A code typed into the search matches every id that starts with it.
export function bookingCodeRange(query: string): [string, string] | null {
  const code = query.trim().toLowerCase()
  if (!/^[0-9a-f]{8}$/.test(code)) return null
  return [`${code}-0000-0000-0000-000000000000`, `${code}-ffff-ffff-ffff-ffffffffffff`]
}

export type BookingTotals = {
  bookings: number
  paid: number
  guests: number
  taken: number
  refunded: number
}

// Money taken counts every booking that was paid (including ones cancelled later),
// less what was refunded or is being refunded.
export function bookingTotals(
  rows: readonly {
    status: string | null
    paid_at: string | null
    guest_count: number | null
    total_amount: number | null
    refund_amount: number | null
    refund_status: string | null
  }[],
): BookingTotals {
  let paid = 0
  let guests = 0
  let takenCents = 0
  let refundedCents = 0
  for (const row of rows) {
    const wasPaid = row.status === 'paid' || (row.status === 'cancelled' && row.paid_at !== null)
    if (!wasPaid) continue
    if (row.status === 'paid') {
      paid += 1
      guests += row.guest_count ?? 0
    }
    takenCents += Math.round(Number(row.total_amount ?? 0) * 100)
    if (row.refund_status !== 'failed') {
      refundedCents += Math.round(Number(row.refund_amount ?? 0) * 100)
    }
  }
  return {
    bookings: rows.length,
    paid,
    guests,
    taken: (takenCents - refundedCents) / 100,
    refunded: refundedCents / 100,
  }
}
