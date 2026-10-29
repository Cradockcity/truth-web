import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

import { verifyTransaction } from './paystack'

export type ConfirmOutcome =
  'paid' | 'already_paid' | 'not_found' | 'not_payable' | 'amount_mismatch' | 'sold_out' | 'unpaid'

// Never trust the callback URL or webhook alone: ask Paystack, then let the database check the amount.
export async function confirmPayment(reference: string) {
  const transaction = await verifyTransaction(reference)

  if (transaction.status !== 'success') {
    const { data } = await createAdminClient()
      .from('bookings')
      .select('id, access_token')
      .eq('payment_reference', reference)
      .maybeSingle()
    return {
      outcome: 'unpaid' as const,
      bookingId: data?.id ?? null,
      accessToken: data?.access_token ?? null,
    }
  }

  const { data, error } = await createAdminClient()
    .rpc('confirm_booking_payment', {
      p_reference: transaction.reference,
      p_amount_cents: transaction.amount,
      p_currency: transaction.currency,
    })
    .single()

  if (error) throw new Error(`Failed to confirm payment: ${error.message}`)
  return {
    outcome: data.outcome as ConfirmOutcome,
    bookingId: data.booking_id as string | null,
    accessToken: data.access_token as string | null,
  }
}
