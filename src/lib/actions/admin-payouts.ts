'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { type FormState, text } from '@/lib/admin/form'
import { requireAdmin } from '@/lib/admin/guard'
import { RECIPIENTS } from '@/lib/payouts'
import { todayInSouthAfrica } from '@/lib/sessions'

const payment = z.object({
  recipient: z.enum(RECIPIENTS),
  recipientId: z.guid(),
  itemIds: z
    .array(z.guid())
    .min(1, 'Tick at least one booking.')
    .max(500, 'Pay at most 500 bookings at once.'),
  paidOn: z.iso
    .date('Choose the date you paid.')
    .refine((day) => day <= todayInSouthAfrica(), 'The payment date can’t be in the future.'),
  reference: text(100),
  note: text(500),
})

const FAILURES: Record<string, string> = {
  items_not_payable:
    'Some of those bookings are already paid, cancelled or not due yet. Refresh the page and try again.',
  bad_date: 'The payment date can’t be in the future.',
  no_items: 'Tick at least one booking.',
}

const failure = (message: string) =>
  FAILURES[Object.keys(FAILURES).find((code) => message.includes(code)) ?? ''] ??
  `Couldn’t record the payment: ${message}`

export async function recordPayout(input: z.input<typeof payment>): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = payment.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' }
  const form = parsed.data

  const { data: id, error } = await supabase.rpc('admin_record_payout', {
    p_recipient: form.recipient,
    p_recipient_id: form.recipientId,
    p_item_ids: form.itemIds,
    p_paid_on: form.paidOn,
    p_reference: form.reference ?? '',
    p_note: form.note ?? '',
  })
  if (error) return { error: failure(error.message) }

  redirect(`/admin/payouts/${form.recipient}/${form.recipientId}?recorded=${id}`)
}

const undo = z.object({ id: z.guid(), recipient: z.enum(RECIPIENTS), recipientId: z.guid() })

export async function undoPayout(input: z.input<typeof undo>): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = undo.safeParse(input)
  if (!parsed.success) return { error: 'Couldn’t find that payment.' }

  const { error } = await supabase.rpc('admin_undo_payout', { p_payout_id: parsed.data.id })
  if (error) return { error: `Couldn’t undo the payment: ${error.message}` }

  redirect(`/admin/payouts/${parsed.data.recipient}/${parsed.data.recipientId}?undone=1`)
}
