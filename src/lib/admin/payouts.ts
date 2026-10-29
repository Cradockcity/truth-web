import 'server-only'

import { requireAdmin } from '@/lib/admin/guard'
import { type EarningStatus, earningStatus, type Recipient, sumAmounts } from '@/lib/payouts'
import { todayInSouthAfrica } from '@/lib/sessions'

// Admin reads go through the signed-in client: the tables only let admins (is_admin) read.

export type Earning = {
  id: string
  bookingId: string
  recipient: Recipient
  personId: string
  name: string
  baseAmount: number
  rate: number
  amount: number
  dueOn: string
  payoutId: string | null
  status: EarningStatus
  title: string
  sessionDate: string | null
  guests: number
}

export type Payout = {
  id: string
  recipient: Recipient
  personId: string
  name: string
  amount: number
  paidOn: string
  reference: string | null
  note: string | null
  bookingCount: number
}

const EARNING_COLUMNS = `
  id, booking_id, recipient, host_id, creator_id, recipient_name, base_amount, rate, amount,
  due_on, payout_id, voided_at,
  bookings ( booking_date, selected_date, guest_count, experience_snapshot )
` as const

const PAYOUT_COLUMNS = `
  id, recipient, host_id, creator_id, recipient_name, amount, paid_on, reference, note,
  payout_items ( count )
` as const

type EarningRow = {
  id: string
  booking_id: string
  recipient: string
  host_id: string | null
  creator_id: string | null
  recipient_name: string
  base_amount: number
  rate: number
  amount: number
  due_on: string
  payout_id: string | null
  voided_at: string | null
  bookings: {
    booking_date: string | null
    selected_date: string | null
    guest_count: number | null
    experience_snapshot: unknown
  } | null
}

function toEarning(row: EarningRow, today: string): Earning {
  const snapshot = row.bookings?.experience_snapshot as { title?: string } | null | undefined
  return {
    id: row.id,
    bookingId: row.booking_id,
    recipient: row.recipient === 'creator' ? 'creator' : 'host',
    personId: row.host_id ?? row.creator_id ?? '',
    name: row.recipient_name,
    baseAmount: Number(row.base_amount),
    rate: Number(row.rate),
    amount: Number(row.amount),
    dueOn: row.due_on,
    payoutId: row.payout_id,
    status: earningStatus(
      { payoutId: row.payout_id, voidedAt: row.voided_at, dueOn: row.due_on },
      today,
    ),
    title: snapshot?.title ?? 'Experience',
    sessionDate: row.bookings?.booking_date ?? row.bookings?.selected_date ?? null,
    guests: row.bookings?.guest_count ?? 1,
  }
}

type PayoutRow = {
  id: string
  recipient: string
  host_id: string | null
  creator_id: string | null
  recipient_name: string
  amount: number
  paid_on: string
  reference: string | null
  note: string | null
  payout_items: { count: number }[]
}

function toPayout(row: PayoutRow): Payout {
  return {
    id: row.id,
    recipient: row.recipient === 'creator' ? 'creator' : 'host',
    personId: row.host_id ?? row.creator_id ?? '',
    name: row.recipient_name,
    amount: Number(row.amount),
    paidOn: row.paid_on,
    reference: row.reference,
    note: row.note,
    bookingCount: row.payout_items[0]?.count ?? 0,
  }
}

const personColumn = (recipient: Recipient) => (recipient === 'host' ? 'host_id' : 'creator_id')

// The overview: everything still owed, recent payouts and this month's total.
export async function getPayoutsOverview() {
  const { supabase } = await requireAdmin()
  const today = todayInSouthAfrica()
  const monthStart = `${today.slice(0, 7)}-01`

  const [open, recent, month] = await Promise.all([
    supabase
      .from('payout_items')
      .select(EARNING_COLUMNS)
      .is('payout_id', null)
      .is('voided_at', null)
      .order('due_on')
      .limit(2000),
    supabase
      .from('payouts')
      .select(PAYOUT_COLUMNS)
      .order('paid_on', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.from('payouts').select('amount').gte('paid_on', monthStart),
  ])
  if (open.error) throw new Error(`Couldn’t load earnings: ${open.error.message}`)
  if (recent.error) throw new Error(`Couldn’t load payouts: ${recent.error.message}`)

  return {
    open: (open.data as EarningRow[]).map((row) => toEarning(row, today)),
    recent: (recent.data as PayoutRow[]).map(toPayout),
    paidThisMonth: sumAmounts((month.data ?? []).map((row) => ({ amount: Number(row.amount) }))),
  }
}

// One host or creator: their name, every earning and every payout.
export async function getPersonPayouts(recipient: Recipient, id: string) {
  const { supabase } = await requireAdmin()
  const today = todayInSouthAfrica()

  const person =
    recipient === 'host'
      ? await supabase.from('hosts').select('id, name').eq('id', id).maybeSingle()
      : await supabase.from('creators').select('id, name, slug').eq('id', id).maybeSingle()
  if (!person.data) return null

  const [earnings, payouts] = await Promise.all([
    supabase
      .from('payout_items')
      .select(EARNING_COLUMNS)
      .eq(personColumn(recipient), id)
      .order('due_on', { ascending: false })
      .limit(1000),
    supabase
      .from('payouts')
      .select(PAYOUT_COLUMNS)
      .eq(personColumn(recipient), id)
      .order('paid_on', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200),
  ])
  if (earnings.error) throw new Error(`Couldn’t load earnings: ${earnings.error.message}`)
  if (payouts.error) throw new Error(`Couldn’t load payouts: ${payouts.error.message}`)

  return {
    name: person.data.name,
    earnings: (earnings.data as EarningRow[]).map((row) => toEarning(row, today)),
    payouts: (payouts.data as PayoutRow[]).map(toPayout),
  }
}

// What a booking earned its host and creator.
export async function getBookingEarnings(bookingId: string) {
  const { supabase } = await requireAdmin()
  const today = todayInSouthAfrica()
  const { data, error } = await supabase
    .from('payout_items')
    .select(EARNING_COLUMNS)
    .eq('booking_id', bookingId)
    .order('recipient', { ascending: false })
  if (error) throw new Error(`Couldn’t load earnings: ${error.message}`)
  return (data as EarningRow[]).map((row) => toEarning(row, today))
}
