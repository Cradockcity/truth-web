'use server'

import { randomBytes } from 'node:crypto'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getBooking } from '@/lib/data/bookings'
import { publicEnv } from '@/lib/env'
import { initializeTransaction } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'

export type PaymentState = { error?: string }

const input = z.object({ bookingId: z.guid(), token: z.guid() })

export async function startPayment(
  _previous: PaymentState,
  formData: FormData,
): Promise<PaymentState> {
  const parsed = input.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return { error: 'This booking link is incomplete. Open it again from your booking page.' }
  const { bookingId, token } = parsed.data

  // The private token proves the visitor may pay for this booking.
  const booking = await getBooking(bookingId, token)
  if (!booking) return { error: 'We couldn’t find this booking.' }
  if (booking.status !== 'pending') {
    return { error: 'This booking can no longer be paid. Refresh the page to see its status.' }
  }

  const reference = `TRUTH-${bookingId.slice(0, 8)}-${randomBytes(4).toString('hex')}`.toUpperCase()

  let authorizationUrl: string
  try {
    const { data, error } = await createAdminClient()
      .rpc('attach_payment_reference', { p_booking_id: bookingId, p_reference: reference })
      .maybeSingle()
    if (error) throw error
    if (!data) return { error: 'Your hold has expired. Choose your session again to rebook.' }

    const transaction = await initializeTransaction({
      email: data.customer_email,
      amountCents: Math.round(Number(data.total_amount) * 100),
      currency: data.currency,
      reference,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL}/payments/paystack/callback`,
      bookingId,
    })
    authorizationUrl = transaction.authorization_url
  } catch (error) {
    console.error('startPayment failed', error)
    return { error: 'We couldn’t reach the payment provider. Try again in a moment.' }
  }

  redirect(authorizationUrl)
}
