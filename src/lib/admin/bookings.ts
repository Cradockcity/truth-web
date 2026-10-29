import 'server-only'

import { requireAdmin } from '@/lib/admin/guard'
import { getRefundState } from '@/lib/paystack'
import { todayInSouthAfrica } from '@/lib/sessions'

export type AdminBooking = {
  id: string
  accessToken: string
  status: string
  title: string
  location: string | null
  date: string | null
  time: string | null
  guests: number
  subtotal: number
  fee: number
  total: number
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  paymentReference: string | null
  createdAt: string | null
  expiresAt: string | null
  paidAt: string | null
  cancelledAt: string | null
  cancellationReason: string | null
  refundAmount: number | null
  refundStatus: string | null
  refundedAt: string | null
}

const COLUMNS = `
  id, access_token, status, booking_date, start_time, selected_date, selected_time, guest_count,
  subtotal, service_fee, total_amount, customer_name, customer_email, customer_phone,
  payment_reference, created_at, expires_at, paid_at, cancelled_at, cancellation_reason,
  refund_amount, refund_status, refunded_at, experience_snapshot
` as const

type Row = {
  id: string
  access_token: string
  status: string | null
  booking_date: string | null
  start_time: string | null
  selected_date: string | null
  selected_time: string | null
  guest_count: number | null
  subtotal: number | null
  service_fee: number | null
  total_amount: number | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  payment_reference: string | null
  created_at: string | null
  expires_at: string | null
  paid_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  refund_amount: number | null
  refund_status: string | null
  refunded_at: string | null
  experience_snapshot: { title?: string; location?: string } | null
}

function toBooking(row: Row): AdminBooking {
  const lapsed =
    row.status === 'pending' && row.expires_at !== null && Date.parse(row.expires_at) <= Date.now()
  return {
    id: row.id,
    accessToken: row.access_token,
    status: lapsed ? 'expired' : (row.status ?? 'pending'),
    title: row.experience_snapshot?.title ?? 'Experience',
    location: row.experience_snapshot?.location ?? null,
    // Bookings made by the old app only have the legacy text columns.
    date: row.booking_date ?? row.selected_date,
    time: (row.start_time ?? row.selected_time)?.slice(0, 5) ?? null,
    guests: row.guest_count ?? 1,
    subtotal: Number(row.subtotal ?? row.total_amount ?? 0),
    fee: Number(row.service_fee ?? 0),
    total: Number(row.total_amount ?? 0),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    paymentReference: row.payment_reference,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    cancelledAt: row.cancelled_at,
    cancellationReason: row.cancellation_reason,
    refundAmount: row.refund_amount === null ? null : Number(row.refund_amount),
    refundStatus: row.refund_status,
    refundedAt: row.refunded_at,
  }
}

export const BOOKING_FILTERS = ['all', 'paid', 'pending', 'cancelled'] as const
export type BookingFilter = (typeof BOOKING_FILTERS)[number]

export async function listBookings(options: {
  status: BookingFilter
  when: 'upcoming' | 'past' | 'all'
  query: string | null
}) {
  const { supabase } = await requireAdmin()
  const today = todayInSouthAfrica()

  let request = supabase.from('bookings').select(COLUMNS)
  if (options.status !== 'all') request = request.eq('status', options.status)
  if (options.when === 'upcoming') request = request.gte('booking_date', today)
  if (options.when === 'past') request = request.lt('booking_date', today)
  if (options.query) {
    // Escape PostgREST's filter syntax characters before building an ilike pattern.
    const term = options.query.replace(/[%_,().*\\]/g, ' ').trim()
    if (term) request = request.or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`)
  }

  const { data, error } = await request
    .order('booking_date', { ascending: options.when !== 'past', nullsFirst: false })
    .order('start_time', { ascending: true })
    .limit(200)
    .returns<Row[]>()

  if (error) throw new Error(`Failed to load bookings: ${error.message}`)
  return data.map(toBooking)
}

// Pull the refund's real status from Paystack, so it updates even without webhooks (e.g. local dev).
export async function syncRefundStatus(booking: AdminBooking): Promise<AdminBooking> {
  if (booking.refundStatus !== 'pending' || !booking.paymentReference) return booking
  const { supabase } = await requireAdmin()

  let state: Awaited<ReturnType<typeof getRefundState>>
  try {
    state = await getRefundState(booking.paymentReference)
  } catch (error) {
    console.error('Refund status check failed', error)
    return booking
  }
  if (!state || state === 'pending') return booking

  const refundedAt = state === 'processed' ? new Date().toISOString() : null
  await supabase
    .from('bookings')
    .update({ refund_status: state, refunded_at: refundedAt })
    .eq('id', booking.id)
  return { ...booking, refundStatus: state, refundedAt }
}

export async function getAdminBooking(id: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('bookings')
    .select(COLUMNS)
    .eq('id', id)
    .returns<Row[]>()
    .maybeSingle()
  if (error) throw new Error(`Failed to load booking: ${error.message}`)
  return data ? toBooking(data) : null
}

export async function getDashboard() {
  const { supabase } = await requireAdmin()
  const today = todayInSouthAfrica()
  const monthStart = `${today.slice(0, 7)}-01`

  const [upcoming, paidThisMonth, holds, experiences, recent] = await Promise.all([
    supabase
      .from('bookings')
      .select('guest_count', { count: 'exact' })
      .eq('status', 'paid')
      .gte('booking_date', today),
    supabase
      .from('bookings')
      .select('total_amount, refund_amount')
      .eq('status', 'paid')
      .gte('paid_at', `${monthStart}T00:00:00+02:00`),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString()),
    supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('bookings')
      .select(COLUMNS)
      .order('created_at', { ascending: false })
      .limit(8)
      .returns<Row[]>(),
  ])

  for (const result of [upcoming, paidThisMonth, holds, experiences, recent]) {
    if (result.error) throw new Error(`Failed to load dashboard: ${result.error.message}`)
  }

  return {
    upcomingBookings: upcoming.count ?? 0,
    upcomingGuests: (upcoming.data ?? []).reduce((sum, row) => sum + (row.guest_count ?? 0), 0),
    revenueThisMonth: (paidThisMonth.data ?? []).reduce(
      (sum, row) => sum + Number(row.total_amount ?? 0),
      0,
    ),
    activeHolds: holds.count ?? 0,
    activeExperiences: experiences.count ?? 0,
    recent: (recent.data ?? []).map(toBooking),
  }
}
