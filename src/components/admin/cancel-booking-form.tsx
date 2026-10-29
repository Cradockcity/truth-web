'use client'

import { useActionState, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { cancelBooking, type CancelState } from '@/lib/actions/admin-bookings'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { refundAmount, type RefundOption } from '@/lib/refunds'

export function CancelBookingForm({
  bookingId,
  paid,
  total,
  fee,
}: {
  bookingId: string
  paid: boolean
  total: number
  fee: number
}) {
  const [state, action, pending] = useActionState<CancelState, FormData>(cancelBooking, {})
  const [refund, setRefund] = useState<RefundOption>(paid ? 'full' : 'none')

  if (state.done) {
    return (
      <p role="status" className="rounded-control bg-surface px-4 py-3">
        {state.done}
      </p>
    )
  }

  const options: { value: RefundOption; label: string; hint: string }[] = paid
    ? [
        {
          value: 'full',
          label: `Full refund, ${formatRand(total)}`,
          hint: 'Everything the guest paid',
        },
        {
          value: 'minus-fee',
          label: `Refund ${formatRand(refundAmount('minus-fee', total, fee))}`,
          hint: `Keeps the ${formatRand(fee)} service fee`,
        },
        { value: 'none', label: 'No refund', hint: 'For example, a late cancellation or no-show' },
      ]
    : []

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="refund" value={refund} />

      {paid ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-semibold">Refund</legend>
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-control border px-4 py-3 transition-colors',
                refund === option.value
                  ? 'border-ink bg-surface'
                  : 'border-line hover:border-ink/40',
              )}
            >
              <input
                type="radio"
                name="refund-choice"
                value={option.value}
                checked={refund === option.value}
                onChange={() => setRefund(option.value)}
                className="mt-1 accent-current"
              />
              <span className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-caption text-ink/60">{option.hint}</span>
              </span>
            </label>
          ))}
          <p className="text-caption text-ink/55">
            Paystack doesn&apos;t return its own processing fee on refunds.
          </p>
        </fieldset>
      ) : (
        <p className="text-ink/70">
          This booking isn&apos;t paid, so cancelling just releases the seats.
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="cancel-reason">Reason (only you see this)</Label>
        <Input
          id="cancel-reason"
          name="reason"
          required
          placeholder="Host unavailable on the day"
        />
      </div>

      <label className="flex items-start gap-3 text-caption">
        <input
          type="checkbox"
          name="confirm"
          value="yes"
          required
          className="mt-0.5 accent-current"
        />
        I understand this cancels the booking
        {paid && refund !== 'none' ? ' and sends the refund now' : ''}.
      </label>

      {state.error ? (
        <p role="alert" className="text-caption text-danger">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="self-start border-danger/50 text-danger hover:border-danger"
      >
        {pending ? 'Cancelling…' : 'Cancel booking'}
      </Button>
    </form>
  )
}
