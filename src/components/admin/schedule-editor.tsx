'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { type FormState, saveSchedule } from '@/lib/actions/admin-experiences'
import { cn } from '@/lib/cn'
import { type ScheduleSlot, toSessions, toSlots, WEEKDAYS } from '@/lib/schedule'

import { SmallButton } from './itinerary-editor'
import { SaveStatus } from './save-status'

type EditableSession = { key: string; time: string; capacity: number; days: number[] }

export function ScheduleEditor({
  experienceId,
  initial,
  defaultCapacity,
}: {
  experienceId: string
  initial: ScheduleSlot[]
  defaultCapacity: number
}) {
  const [sessions, setSessions] = useState<EditableSession[]>(() =>
    toSessions(initial).map((session) => ({ ...session, key: crypto.randomUUID() })),
  )
  const [state, setState] = useState<FormState>({})
  const [saving, start] = useTransition()

  const update = (key: string, patch: Partial<EditableSession>) =>
    setSessions((current) => current.map((s) => (s.key === key ? { ...s, ...patch } : s)))

  return (
    <div className="flex flex-col gap-4">
      {sessions.length === 0 ? (
        <p className="rounded-control bg-surface px-4 py-3 text-caption text-ink/70">
          No sessions: guests can&apos;t book this experience until you add one.
        </p>
      ) : null}

      {sessions.map((session, index) => (
        <fieldset
          key={session.key}
          className="flex flex-col gap-4 rounded-control border border-line p-4 lg:flex-row lg:items-end"
        >
          <legend className="sr-only">Session {index + 1}</legend>
          <div className="grid gap-2">
            <Label htmlFor={`time-${session.key}`}>Start time</Label>
            <Input
              id={`time-${session.key}`}
              type="time"
              value={session.time}
              onChange={(event) => update(session.key, { time: event.target.value })}
              className="w-36"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`seats-${session.key}`}>Seats</Label>
            <Input
              id={`seats-${session.key}`}
              type="number"
              min={1}
              max={500}
              value={session.capacity}
              onChange={(event) => update(session.key, { capacity: Number(event.target.value) })}
              className="w-24"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-caption font-medium text-ink/70">Runs on</span>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map((day) => {
                const on = session.days.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      update(session.key, {
                        days: on
                          ? session.days.filter((d) => d !== day.value)
                          : [...session.days, day.value],
                      })
                    }
                    className={cn(
                      'h-9 cursor-pointer rounded-full border px-3 text-caption font-medium transition-colors',
                      on ? 'border-ink bg-ink text-canvas' : 'border-line hover:border-ink/40',
                    )}
                  >
                    {day.short}
                  </button>
                )
              })}
            </div>
          </div>
          <SmallButton
            label="Remove session"
            onClick={() => setSessions((current) => current.filter((s) => s.key !== session.key))}
          >
            <Trash2 />
          </SmallButton>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setSessions((current) => [
              ...current,
              {
                key: crypto.randomUUID(),
                time: '09:00',
                capacity: defaultCapacity,
                days: [1, 2, 3, 4, 5, 6, 0],
              },
            ])
          }
        >
          <Plus /> Add session
        </Button>
        <Button
          size="sm"
          disabled={saving}
          onClick={() =>
            start(async () => {
              const result = await saveSchedule({
                id: experienceId,
                slots: toSlots(sessions.filter((s) => s.days.length > 0 && s.time)),
              })
              setState(result)
            })
          }
        >
          {saving ? 'Saving…' : 'Save schedule'}
        </Button>
        <SaveStatus state={state} />
      </div>
      <p className="text-caption text-ink/55">
        Changing seats doesn&apos;t cancel existing bookings. Removing a session only stops new
        bookings for it.
      </p>
    </div>
  )
}
