'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getSessions } from '@/lib/data/bookings'
import type { Session } from '@/lib/sessions'
import { createClient } from '@/lib/supabase/server'

export async function loadSessions(experienceId: unknown): Promise<Session[]> {
  const parsed = z.guid().safeParse(experienceId)
  return parsed.success ? getSessions(parsed.data) : []
}

const bookingForm = z.object({
  experienceId: z.guid(),
  date: z.iso.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1).max(30),
  name: z.string().trim().min(2, 'Enter your full name').max(120, 'Use a shorter name'),
  email: z.email('Enter an email address like name@example.com').max(254),
  phone: z
    .string()
    .trim()
    .max(30, 'Use a shorter phone number')
    .regex(/^[+\d\s()-]*$/, 'Use only numbers, spaces and +')
    .optional()
    .transform((value) => value || undefined),
  creator: z
    .string()
    .regex(/^[a-z0-9-]{1,80}$/)
    .optional()
    .catch(undefined),
})

export type BookingFormState = {
  fieldErrors?: Partial<Record<'name' | 'email' | 'phone', string>>
  formError?: string
  values?: { name: string; email: string; phone: string }
}

const RPC_ERRORS: Record<string, string> = {
  not_enough_space: 'Someone just booked some of those seats. Choose fewer guests or another time.',
  slot_unavailable: 'That session is no longer available. Choose another time.',
  experience_unavailable: 'This experience is no longer taking bookings.',
  invalid_email: 'Enter an email address like name@example.com.',
  invalid_name: 'Enter your full name.',
  invalid_guests: 'Choose between 1 and 30 guests.',
}

export async function createBooking(
  _previous: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const raw = Object.fromEntries(formData)
  const values = {
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
  }

  const parsed = bookingForm.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: BookingFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if ((field === 'name' || field === 'email' || field === 'phone') && !fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    return Object.keys(fieldErrors).length > 0
      ? { fieldErrors, values }
      : { formError: 'That session is no longer valid. Go back and choose a time.', values }
  }

  const form = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('create_booking', {
      p_experience_id: form.experienceId,
      p_date: form.date,
      p_start_time: form.time,
      p_guests: form.guests,
      p_name: form.name,
      p_email: form.email,
      p_phone: form.phone,
      p_creator_slug: form.creator,
    })
    .single()

  if (error || !data) {
    const known = error && Object.keys(RPC_ERRORS).find((code) => error.message.includes(code))
    return {
      formError: known
        ? RPC_ERRORS[known]
        : "We couldn't reserve your seats just now. Try again in a moment.",
      values,
    }
  }

  redirect(`/bookings/${data.booking_id}?token=${data.access_token}`)
}
