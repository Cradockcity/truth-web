'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { undoPayout } from '@/lib/actions/admin-payouts'
import type { FormState } from '@/lib/admin/form'
import type { Recipient } from '@/lib/payouts'

import { SaveStatus } from './save-status'

// For a payment recorded by mistake. Asks once before undoing.
export function UndoPayoutButton({
  id,
  recipient,
  recipientId,
}: {
  id: string
  recipient: Recipient
  recipientId: string
}) {
  const [asking, setAsking] = useState(false)
  const [state, setState] = useState<FormState>({})
  const [saving, start] = useTransition()

  if (!asking) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setAsking(true)}>
        Undo
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-caption text-ink/70">Undo this payment?</span>
      <Button
        variant="secondary"
        size="sm"
        disabled={saving}
        onClick={() =>
          start(async () => setState(await undoPayout({ id, recipient, recipientId })))
        }
      >
        {saving ? 'Undoing…' : 'Yes, undo'}
      </Button>
      <Button variant="ghost" size="sm" disabled={saving} onClick={() => setAsking(false)}>
        Keep it
      </Button>
      <SaveStatus state={state} />
    </div>
  )
}
