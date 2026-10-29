'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import type { FormState } from '@/lib/admin/form'

import { SaveStatus } from './save-status'

export function DeleteSection({
  id,
  title,
  description,
  confirmLabel,
  action: deleteAction,
}: {
  id: string
  title: string
  description: string
  confirmLabel: string
  action: (previous: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, action, pending] = useActionState(deleteAction, {})

  return (
    <section className="flex flex-col gap-4 rounded-sheet border border-danger/30 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-title font-semibold">{title}</h2>
        <p className="text-caption text-ink/60">{description}</p>
      </div>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <label className="flex items-start gap-3 text-caption">
          <input
            type="checkbox"
            name="confirm"
            value="yes"
            required
            className="mt-0.5 accent-current"
          />
          {confirmLabel}
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            className="border-danger/50 text-danger hover:border-danger"
          >
            {pending ? 'Deleting…' : title}
          </Button>
          <SaveStatus state={state} />
        </div>
      </form>
    </section>
  )
}
