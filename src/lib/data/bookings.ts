import 'server-only'

import { connection } from 'next/server'

import { type Session, todayInSouthAfrica, toHourMinute } from '@/lib/sessions'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'

import { isUuid } from './experiences'

// Live seat counts: deliberately not cached, and never prerendered (it depends on today's date).
export async function getSessions(experienceId: string, days = 60): Promise<Session[]> {
  await connection()
  if (!isUuid(experienceId)) return []

  const { data, error } = await createPublicClient().rpc('get_availability', {
    p_experience_id: experienceId,
    p_from: todayInSouthAfrica(),
    p_days: days,
  })
  if (error) throw new Error(`Failed to load availability: ${error.message}`)

  return data.map((slot) => ({
    date: slot.slot_date,
    time: toHourMinute(slot.start_time),
    capacity: slot.capacity,
    remaining: slot.remaining,
  }))
}

export type BookingView = {
  id: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'
  experienceId: string | null
  title: string
  location: string | null
  imageUrl: string | null
  date: string | null
  time: string | null
  guests: number
  subtotal: number
  fee: number
  total: number
  customerName: string | null
  customerEmail: string | null
  expiresAt: string | null
}

// Visible to the private-link holder, the signed-in owner or an admin (enforced in the database).
export async function getBooking(
  id: string,
  accessToken: string | null,
): Promise<BookingView | null> {
  if (!isUuid(id) || (accessToken !== null && !isUuid(accessToken))) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('get_booking', { p_booking_id: id, p_access_token: accessToken ?? undefined })
    .maybeSingle()

  if (error) throw new Error(`Failed to load booking: ${error.message}`)
  if (!data) return null

  return {
    id: data.id,
    status: data.status as BookingView['status'],
    experienceId: data.experience_id,
    title: data.experience_title ?? 'Your experience',
    location: data.experience_location,
    imageUrl: data.experience_image,
    date: data.booking_date,
    time: data.start_time ? toHourMinute(data.start_time) : null,
    guests: data.guest_count ?? 1,
    subtotal: Number(data.subtotal ?? 0),
    fee: Number(data.service_fee ?? 0),
    total: Number(data.total_amount ?? 0),
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    expiresAt: data.expires_at,
  }
}
