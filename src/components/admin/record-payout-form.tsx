'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { recordPayout } from '@/lib/actions/admin-payouts'
import type { FormState } from '@/lib/admin/form'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { formatDay, type Recipient, sumAmounts } from '@/lib/payouts'

import { Field, SaveStatus } from './save-status'

type DueEarning = {
  id: string
  title: string
  sessionDate: string | null
  guests: number
  amount: number
}

// Ticks the due bookings being paid and records the transfer. Submitted by hand so a failed
// save keeps what was typed (see experience-details-form).
export function RecordPayoutForm({
  recipient,
  personId,
  name,
  due,
  today,
}: {
  recipient: Recipient
  personId: string
  name: string
  due: DueEarning[]
  today: string
}) {
  const [chosen, setChosen] = useState(() => new Set(due.map((earning) => earning.id)))
  const [state, setState] = useState<FormState>({})
  const [saving, start] = useTransition()
  const total = sumAmounts(due.filter((earning) => chosen.has(earning.id)))

  const toggle = (id: string) =>
    setChosen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        start(async () => {
          setState(
            await recordPayout({
              recipient,
              recipientId: personId,
              itemIds: [...chosen],
              paidOn: String(data.get('paidOn') ?? ''),
              reference: String(data.get('reference') ?? ''),
              note: String(data.get('note') ?? ''),
            }),
          )
        })
      }}
      className="flex flex-col gap-5"
    >
      <ul className="flex flex-col gap-2">
        {due.map((earning) => {
          const on = chosen.has(earning.id)
          return (
            <li key={earning.id}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-control border px-4 py-3 transition-colors',
                  on ? 'border-ink bg-surface' : 'border-line hover:border-ink/40',
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(earning.id)}
                  className="mt-1 accent-current"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">{earning.title}</span>
                  <span className="text-caption text-ink/60">
                    {earning.sessionDate ? formatDay(earning.sessionDate) : 'No date'} ·{' '}
                    {earning.guests === 1 ? '1 guest' : `${earning.guests} guests`}
                  </span>
                </span>
                <span className="font-medium tabular-nums">{formatRand(earning.amount)}</span>
              </label>
            </li>
          )
        })}
      </ul>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Paid on" htmlFor="paidOn" hint="The day you sent the money.">
          <Input id="paidOn" name="paidOn" type="date" required max={today} defaultValue={today} />
        </Field>
        <Field
          label="Payment reference"
          htmlFor="reference"
          hint="Optional. For example the reference on the bank transfer."
        >
          <Input id="reference" name="reference" maxLength={100} autoComplete="off" />
        </Field>
      </div>
      <Field label="Note" htmlFor="note" hint="Optional. Only admins see this.">
        <Textarea id="note" name="note" maxLength={500} rows={2} />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={saving || chosen.size === 0}>
          {saving ? 'Recording…' : `Record ${formatRand(total)} paid to ${name}`}
        </Button>
        <span className="text-caption text-ink/55">
          {chosen.size === 1 ? '1 booking' : `${chosen.size} bookings`}
        </span>
        <SaveStatus state={state} />
      </div>
    </form>
  )
}
