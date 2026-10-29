import 'server-only'

import { requireAdmin } from '@/lib/admin/guard'
import { type Revenue, bookingRevenue, type RevenueFilters } from '@/lib/revenue'

export type RevenueBooking = Revenue & {
  id: string
  date: string | null
  paidAt: string | null
  status: string
  title: string
  hostName: string | null
  guests: number
  channel: string | null
}

type Row = {
  id: string
  status: string | null
  booking_date: string | null
  selected_date: string | null
  guest_count: number | null
  total_amount: number | null
  refund_amount: number | null
  refund_status: string | null
  paystack_fee: number | null
  payment_channel: string | null
  paid_at: string | null
  experience_snapshot: unknown
  hosts: { name: string } | null
  payout_items: { recipient: string; amount: number; voided_at: string | null }[]
}

const COLUMNS = `
  id, status, booking_date, selected_date, guest_count, total_amount, refund_amount,
  refund_status, paystack_fee, payment_channel, paid_at, experience_snapshot,
  hosts ( name ), payout_items ( recipient, amount, voided_at )
` as const

function toRevenue(row: Row): RevenueBooking {
  const snapshot = row.experience_snapshot as { title?: string } | null
  return {
    id: row.id,
    date: row.booking_date ?? row.selected_date,
    paidAt: row.paid_at,
    status: row.status ?? 'paid',
    title: snapshot?.title ?? 'Experience',
    hostName: row.hosts?.name ?? null,
    guests: row.guest_count ?? 1,
    channel: row.payment_channel,
    ...bookingRevenue({
      total: Number(row.total_amount ?? 0),
      refundAmount: row.refund_amount === null ? null : Number(row.refund_amount),
      refundStatus: row.refund_status,
      paystackFee: row.paystack_fee === null ? null : Number(row.paystack_fee),
      shares: row.payout_items.map((item) => ({
        recipient: item.recipient,
        amount: Number(item.amount),
        voided: item.voided_at !== null,
      })),
    }),
  }
}

// Every booking that was paid (including ones cancelled later) with an experience date in the
// year, newest first. Old-app bookings only have selected_date. The page narrows to a month
// and pages through the list itself, so the year's chart and totals use the same rows.
export async function getRevenueYear(filters: RevenueFilters) {
  const { supabase } = await requireAdmin()
  const from = `${filters.year}-01-01`
  const to = `${filters.year}-12-31`

  let query = supabase
    .from('bookings')
    .select(COLUMNS)
    .not('paid_at', 'is', null)
    .or(
      `and(booking_date.gte.${from},booking_date.lte.${to}),and(booking_date.is.null,selected_date.gte.${from},selected_date.lte.${to})`,
    )
  if (filters.experienceId) query = query.eq('experience_id', filters.experienceId)
  if (filters.hostId) query = query.eq('host_id', filters.hostId)

  // Old-app bookings marked paid have no paid_at; they count when their status says paid.
  let legacy = supabase
    .from('bookings')
    .select(COLUMNS)
    .is('paid_at', null)
    .eq('status', 'paid')
    .is('booking_date', null)
    .gte('selected_date', from)
    .lte('selected_date', to)
  if (filters.experienceId) legacy = legacy.eq('experience_id', filters.experienceId)
  if (filters.hostId) legacy = legacy.eq('host_id', filters.hostId)

  const [paid, old] = await Promise.all([
    query.limit(10000).returns<Row[]>(),
    legacy.limit(1000).returns<Row[]>(),
  ])
  if (paid.error) throw new Error(`Couldn’t load revenue: ${paid.error.message}`)
  if (old.error) throw new Error(`Couldn’t load revenue: ${old.error.message}`)

  return [...paid.data, ...old.data]
    .map(toRevenue)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}
