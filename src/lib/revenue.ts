import { monthRange } from '@/lib/booking-filters'
import { monthsOf, sumAmounts } from '@/lib/payouts'

// What Truth made on each paid booking:
//   what the guest paid − refunds − the host's share − the creator's share − Paystack's fee.
// Shares cancelled with the booking count as 0; shares paid out before a cancellation still
// count. Paystack keeps its fee when a payment is refunded, so a fully refunded booking is a
// small loss. Bookings are grouped by experience date, like payouts.

export type RevenueInput = {
  total: number
  refundAmount: number | null
  refundStatus: string | null
  paystackFee: number | null
  shares: readonly { recipient: string; amount: number; voided: boolean }[]
}

export type Revenue = {
  guestPaid: number
  refunded: number
  host: number
  creator: number
  fee: number
  feeKnown: boolean
  made: number
}

const cents = (value: number) => Math.round(value * 100)

export function bookingRevenue(input: RevenueInput): Revenue {
  const live = input.shares.filter((share) => !share.voided)
  const share = (recipient: string) =>
    live.filter((s) => s.recipient === recipient).reduce((total, s) => total + cents(s.amount), 0)

  const guestPaid = cents(input.total)
  const refunded = input.refundStatus === 'failed' ? 0 : cents(input.refundAmount ?? 0)
  const host = share('host')
  const creator = share('creator')
  const fee = cents(input.paystackFee ?? 0)
  return {
    guestPaid: guestPaid / 100,
    refunded: refunded / 100,
    host: host / 100,
    creator: creator / 100,
    fee: fee / 100,
    feeKnown: input.paystackFee !== null,
    made: (guestPaid - refunded - host - creator - fee) / 100,
  }
}

export type RevenueTotals = Omit<Revenue, 'feeKnown'> & { bookings: number; missingFees: number }

export function totalRevenue(rows: readonly Revenue[]): RevenueTotals {
  const add = (key: keyof Omit<Revenue, 'feeKnown'>) =>
    sumAmounts(rows.map((row) => ({ amount: row[key] })))
  return {
    bookings: rows.length,
    guestPaid: add('guestPaid'),
    refunded: add('refunded'),
    host: add('host'),
    creator: add('creator'),
    fee: add('fee'),
    made: add('made'),
    missingFees: rows.filter((row) => !row.feeKnown).length,
  }
}

// The twelve months of a year, each with its totals.
export function groupRevenueByMonth(
  rows: readonly (Revenue & { date: string | null })[],
  year: number,
) {
  return monthsOf(year).map((month) => ({
    ...month,
    ...totalRevenue(rows.filter((row) => row.date?.startsWith(month.key))),
  }))
}

// Filters, read from the URL.
export const REVENUE_PER_PAGE = 50

export type RevenueFilters = {
  year: number
  month: string | null
  experienceId: string | null
  hostId: string | null
  page: number
}

type Params = Record<string, string | string[] | undefined>
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function parseRevenueFilters(params: Params, thisYear: number): RevenueFilters {
  const requested = Number(one(params.year))
  const year =
    Number.isInteger(requested) && requested >= 2020 && requested <= 2100 ? requested : thisYear
  const month = one(params.month)
  const experience = one(params.experience)
  const host = one(params.host)
  const page = Number(one(params.page))
  return {
    year,
    month: month && monthRange(month) && month.startsWith(`${year}-`) ? month : null,
    experienceId: experience && GUID.test(experience) ? experience.toLowerCase() : null,
    hostId: host && GUID.test(host) ? host.toLowerCase() : null,
    page: Number.isInteger(page) && page > 1 && page <= 1000 ? page : 1,
  }
}

export function revenueFiltersToParams(
  filters: RevenueFilters,
  changes: Partial<RevenueFilters> = {},
) {
  const next = { ...filters, ...changes }
  const params = new URLSearchParams({ year: String(next.year) })
  if (next.month) params.set('month', next.month)
  if (next.experienceId) params.set('experience', next.experienceId)
  if (next.hostId) params.set('host', next.hostId)
  if (next.page > 1) params.set('page', String(next.page))
  return params
}
