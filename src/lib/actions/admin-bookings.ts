'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getAdminBooking } from '@/lib/admin/bookings'
import { requireAdmin } from '@/lib/admin/guard'
import { refundTransaction } from '@/lib/paystack'
import { REFUND_OPTIONS, refundAmount } from '@/lib/refunds'

export type CancelState = { error?: string; done?: string }

const input = z.object({
  bookingId: z.guid(),
  refund: z.enum(REFUND_OPTIONS),
  reason: z.string().trim().min(3, 'Add a short reason (kept for your records).').max(300),
  confirm: z.literal('yes', { error: 'Tick the box to confirm.' }),
})

export async function cancelBooking(
  _previous: CancelState,
  formData: FormData,
): Promise<CancelState> {
  const { supabase } = await requireAdmin()

  const parsed = input.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' }
  const { bookingId, refund, reason } = parsed.data

  const booking = await getAdminBooking(bookingId)
  if (!booking) return { error: 'That booking no longer exists.' }
  if (booking.status !== 'paid' && booking.status !== 'pending' && booking.status !== 'expired') {
    return { error: 'This booking is already closed.' }
  }

  const paid = booking.status === 'paid'
  const amount = paid ? refundAmount(refund, booking.total, booking.fee) : 0

  // Refund first: if Paystack refuses, the booking stays as it was.
  if (amount > 0) {
    if (!booking.paymentReference) return { error: 'This booking has no payment to refund.' }
    try {
      await refundTransaction({
        reference: booking.paymentReference,
        amountCents: Math.round(amount * 100),
        note: reason,
      })
    } catch (error) {
      console.error('Refund failed', error)
      const message = error instanceof Error ? error.message : ''
      return {
        error: /balance|insufficient/i.test(message)
          ? 'Paystack couldn’t send the refund: your pending payouts don’t cover it yet. Try again later or refund from the Paystack dashboard.'
          : 'Paystack couldn’t send the refund. Nothing was changed. Try again, or refund from the Paystack dashboard.',
      }
    }
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
      refund_amount: paid ? amount : null,
      refund_status: amount > 0 ? 'pending' : null,
    })
    .eq('id', bookingId)

  if (error) {
    console.error('Cancel update failed', error)
    return {
      error:
        amount > 0
          ? 'The refund was sent, but the booking couldn’t be marked cancelled. Refresh and check before trying again.'
          : 'Couldn’t cancel the booking. Try again.',
    }
  }

  revalidatePath(`/admin/bookings/${bookingId}`)
  revalidatePath('/admin/bookings')
  return { done: amount > 0 ? 'Cancelled. The refund is on its way.' : 'Cancelled.' }
}
