'use client'

import { Lock } from 'lucide-react'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { type PaymentState, startPayment } from '@/lib/actions/payment'

export function PayButton({
  bookingId,
  token,
  totalLabel,
}: {
  bookingId: string
  token: string
  totalLabel: string
}) {
  const [state, action, pending] = useActionState<PaymentState, FormData>(startPayment, {})

  return (
    <form action={action} className="mt-5 flex flex-col gap-3">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="token" value={token} />
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
        <Lock /> {pending ? 'Opening secure payment…' : `Pay ${totalLabel}`}
      </Button>
      {state.error ? (
        <p role="alert" className="text-caption text-danger">
          {state.error}
        </p>
      ) : (
        <p className="text-caption text-ink/60">
          You&apos;ll pay on Paystack&apos;s secure checkout, then come straight back here.
        </p>
      )}
    </form>
  )
}
