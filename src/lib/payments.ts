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

  if ((data.outcome === 'paid' || data.outcome === 'already_paid') && transaction.fees != null) {
    await recordPaystackFee(transaction.reference, transaction.fees, transaction.channel)
  }
  return {
    outcome: data.outcome as ConfirmOutcome,
    bookingId: data.booking_id as string | null,
    accessToken: data.access_token as string | null,
  }
}

// Keeps Paystack's fee on the booking for the Revenue report. Saved once; a failure here
// never undoes a confirmed payment.
async function recordPaystackFee(reference: string, feeCents: number, channel?: string | null) {
  const { error } = await createAdminClient()
    .from('bookings')
    .update({ paystack_fee: feeCents / 100, payment_channel: channel?.slice(0, 40) ?? null })
    .eq('payment_reference', reference)
    .is('paystack_fee', null)
  if (error) console.error('Saving the Paystack fee failed', error)
}
