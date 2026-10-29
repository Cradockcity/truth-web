import { monthRange } from '@/lib/booking-filters'

// Payouts: what Truth owes hosts and creators (earnings) and what it has sent (payouts).
// The amounts are worked out in the database when a booking is paid (record_booking_earnings).

export const RECIPIENTS = ['host', 'creator'] as const
export type Recipient = (typeof RECIPIENTS)[number]

export type EarningStatus = 'upcoming' | 'due' | 'paid' | 'cancelled'

export function earningStatus(
  earning: { payoutId: string | null; voidedAt: string | null; dueOn: string },
  today: string,
): EarningStatus {
  if (earning.payoutId) return 'paid'
  if (earning.voidedAt) return 'cancelled'
  return earning.dueOn <= today ? 'due' : 'upcoming'
}

// Adds in cents so R0,10 + R0,20 is R0,30, not 0.30000000000000004.
export function sumAmounts(items: readonly { amount: number }[]) {
  return items.reduce((cents, item) => cents + Math.round(item.amount * 100), 0) / 100
}

export type Owed = {
  recipient: Recipient
  personId: string
  name: string
  due: { count: number; total: number }
  upcoming: { count: number; total: number; next: string | null }
}

// One line per person for the open earnings (not paid, not cancelled), most owed first.
export function groupOwed(
  earnings: readonly {
    recipient: Recipient
    personId: string
    name: string
    amount: number
    dueOn: string
    status: EarningStatus
  }[],
) {
  const people = new Map<
    string,
    Owed & { dueItems: { amount: number }[]; upcomingItems: { amount: number }[] }
  >()
  for (const earning of earnings) {
    if (earning.status !== 'due' && earning.status !== 'upcoming') continue
    const key = `${earning.recipient}:${earning.personId}`
    const person = people.get(key) ?? {
      recipient: earning.recipient,
      personId: earning.personId,
      name: earning.name,
      due: { count: 0, total: 0 },
      upcoming: { count: 0, total: 0, next: null },
      dueItems: [],
      upcomingItems: [],
    }
    if (earning.status === 'due') person.dueItems.push(earning)
    else {
      person.upcomingItems.push(earning)
      if (!person.upcoming.next || earning.dueOn < person.upcoming.next) {
        person.upcoming.next = earning.dueOn
      }
    }
    people.set(key, person)
  }

  return [...people.values()]
    .map(({ dueItems, upcomingItems, ...person }): Owed => ({
      ...person,
      due: { count: dueItems.length, total: sumAmounts(dueItems) },
      upcoming: {
        ...person.upcoming,
        count: upcomingItems.length,
        total: sumAmounts(upcomingItems),
      },
    }))
    .sort((a, b) => b.due.total - a.due.total || b.upcoming.total - a.upcoming.total)
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// "12 Mar 2026". Dates are calendar days, so format them as UTC midnight.
export function formatDay(date: string) {
  return dayFormat.format(new Date(`${date}T00:00:00Z`))
}

// The payment history's filters, read from the URL like the bookings search.
export const PAYOUTS_PER_PAGE = 50

export type PayoutFilters = {
  from: string | null
  to: string | null
  recipient: Recipient | null
  personId: string | null
  page: number
}

type Params = Record<string, string | string[] | undefined>
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const isDay = (value: string | undefined): value is string =>
  !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))

// "person" is "host:<id>" or "creator:<id>", so one dropdown covers both.
export function parsePayoutFilters(params: Params): PayoutFilters {
  const month = monthRange(one(params.month) ?? '')
  const from = one(params.from)
  const to = one(params.to)
  const person = /^(host|creator):([0-9a-f-]{36})$/i.exec(one(params.person) ?? '')
  const page = Number(one(params.page))
  return {
    from: isDay(from) ? from : (month?.[0] ?? null),
    to: isDay(to) ? to : (month?.[1] ?? null),
    recipient: person ? (person[1]!.toLowerCase() as Recipient) : null,
    personId: person ? person[2]!.toLowerCase() : null,
    page: Number.isInteger(page) && page > 1 && page <= 1000 ? page : 1,
  }
}

export function payoutFiltersToParams(
  filters: PayoutFilters,
  changes: Partial<PayoutFilters> = {},
) {
  const next = { ...filters, ...changes }
  const params = new URLSearchParams()
  if (next.from) params.set('from', next.from)
  if (next.to) params.set('to', next.to)
  if (next.recipient && next.personId) params.set('person', `${next.recipient}:${next.personId}`)
  if (next.page > 1) params.set('page', String(next.page))
  return params
}
