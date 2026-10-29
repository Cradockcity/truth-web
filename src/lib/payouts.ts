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
  year: number
  month: string | null // "2026-10", within the year; the list and CSV narrow to it
  recipient: Recipient | null
  personId: string | null
  page: number
}

type Params = Record<string, string | string[] | undefined>
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// "person" is "host:<id>" or "creator:<id>", so one dropdown covers both.
export function parsePayoutFilters(params: Params, thisYear: number): PayoutFilters {
  const requested = Number(one(params.year))
  const year =
    Number.isInteger(requested) && requested >= 2020 && requested <= 2100 ? requested : thisYear
  const month = one(params.month)
  const person = /^(host|creator):([0-9a-f-]{36})$/i.exec(one(params.person) ?? '')
  const page = Number(one(params.page))
  return {
    year,
    month: month && monthRange(month) && month.startsWith(`${year}-`) ? month : null,
    recipient: person ? (person[1]!.toLowerCase() as Recipient) : null,
    personId: person ? person[2]!.toLowerCase() : null,
    page: Number.isInteger(page) && page > 1 && page <= 1000 ? page : 1,
  }
}

// The payment dates the filters cover: the chosen month, or the whole year.
export function payoutRange(filters: PayoutFilters): [string, string] {
  return (
    (filters.month && monthRange(filters.month)) || [
      `${filters.year}-01-01`,
      `${filters.year}-12-31`,
    ]
  )
}

export function payoutFiltersToParams(
  filters: PayoutFilters,
  changes: Partial<PayoutFilters> = {},
) {
  const next = { ...filters, ...changes }
  const params = new URLSearchParams({ year: String(next.year) })
  if (next.month) params.set('month', next.month)
  if (next.recipient && next.personId) params.set('person', `${next.recipient}:${next.personId}`)
  if (next.page > 1) params.set('page', String(next.page))
  return params
}

const monthName = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' })
const monthAndYear = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

// The twelve months of a year: "2026-03", "Mar", "March 2026".
export function monthsOf(year: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(year, index, 1))
    return {
      key: `${year}-${String(index + 1).padStart(2, '0')}`,
      short: monthName.format(date),
      long: monthAndYear.format(date),
    }
  })
}

type PaidRow = {
  recipient: Recipient
  personId: string
  name: string
  amount: number
  paidOn: string
  bookingCount: number
}

// Payments per month of the year, split by hosts and creators.
export function groupPayoutsByMonth(payouts: readonly PaidRow[], year: number) {
  return monthsOf(year).map((month) => {
    const inMonth = payouts.filter((payout) => payout.paidOn.startsWith(month.key))
    const hosts = sumAmounts(inMonth.filter((payout) => payout.recipient === 'host'))
    const creators = sumAmounts(inMonth.filter((payout) => payout.recipient === 'creator'))
    return { ...month, payments: inMonth.length, hosts, creators, total: sumAmounts(inMonth) }
  })
}

// Payments per person, most paid first.
export function groupPayoutsByPerson(payouts: readonly PaidRow[]) {
  const people = new Map<
    string,
    { recipient: Recipient; personId: string; name: string; payments: PaidRow[] }
  >()
  for (const payout of payouts) {
    const key = `${payout.recipient}:${payout.personId}`
    const person = people.get(key) ?? { ...payout, payments: [] }
    person.payments.push(payout)
    people.set(key, person)
  }
  return [...people.values()]
    .map(({ payments, ...person }) => ({
      recipient: person.recipient,
      personId: person.personId,
      name: person.name,
      payments: payments.length,
      bookings: payments.reduce((count, payout) => count + payout.bookingCount, 0),
      total: sumAmounts(payments),
      lastPaid: payments.reduce(
        (last, payout) => (payout.paidOn > last ? payout.paidOn : last),
        '',
      ),
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
}
