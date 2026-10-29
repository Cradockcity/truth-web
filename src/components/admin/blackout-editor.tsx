'use client'

import { X } from 'lucide-react'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { addBlackout, removeBlackout } from '@/lib/actions/admin-experiences'
import type { FormState } from '@/lib/admin/form'
import { formatSessionDate } from '@/lib/sessions'

import { SaveStatus } from './save-status'

export function BlackoutEditor({
  experienceId,
  blackouts,
  today,
}: {
  experienceId: string
  blackouts: { date: string; reason: string | null }[]
  today: string
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(addBlackout, {})
  const upcoming = blackouts.filter((b) => b.date >= today)

  return (
    <div className="flex flex-col gap-5">
      {upcoming.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {upcoming.map((blackout) => (
            <li
              key={blackout.date}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-1 pl-3 text-caption"
            >
              <span>
                {formatSessionDate(blackout.date, 'short')}
                {blackout.reason ? <span className="text-ink/55"> · {blackout.reason}</span> : null}
              </span>
              <form action={removeBlackout}>
                <input type="hidden" name="id" value={experienceId} />
                <input type="hidden" name="date" value={blackout.date} />
                <button
                  type="submit"
                  aria-label={`Unblock ${formatSessionDate(blackout.date)}`}
                  className="grid size-7 cursor-pointer place-items-center rounded-full hover:bg-ink/8"
                >
                  <X className="size-3.5" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption text-ink/60">No dates blocked.</p>
      )}

      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="id" value={experienceId} />
        <div className="grid gap-2">
          <Label htmlFor="blackout-date">Date</Label>
          <Input id="blackout-date" name="date" type="date" min={today} required className="w-44" />
        </div>
        <div className="grid flex-1 gap-2">
          <Label htmlFor="blackout-reason">Reason (optional, only you see it)</Label>
          <Input id="blackout-reason" name="reason" maxLength={120} placeholder="Host on leave" />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? 'Blocking…' : 'Block date'}
        </Button>
      </form>
      <SaveStatus state={state} />
    </div>
  )
}
