'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type FormState, saveItinerary } from '@/lib/actions/admin-experiences'

import { SaveStatus } from './save-status'

type Step = { key: string; time: string; activity: string }

export function ItineraryEditor({
  experienceId,
  initial,
}: {
  experienceId: string
  initial: { time: string; activity: string }[]
}) {
  const [steps, setSteps] = useState<Step[]>(() =>
    initial.map((step) => ({ ...step, key: crypto.randomUUID() })),
  )
  const [state, setState] = useState<FormState>({})
  const [saving, start] = useTransition()

  const update = (key: string, patch: Partial<Step>) =>
    setSteps((current) => current.map((step) => (step.key === key ? { ...step, ...patch } : step)))
  const move = (index: number, by: -1 | 1) =>
    setSteps((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      if (item) next.splice(index + by, 0, item)
      return next
    })

  return (
    <div className="flex flex-col gap-4">
      {steps.length === 0 ? (
        <p className="text-caption text-ink/60">No steps yet. Add the first part of the day.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <li key={step.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                aria-label={`Step ${index + 1} time`}
                value={step.time}
                onChange={(event) => update(step.key, { time: event.target.value })}
                placeholder="09:00"
                className="sm:w-28"
              />
              <Input
                aria-label={`Step ${index + 1} description`}
                value={step.activity}
                onChange={(event) => update(step.key, { activity: event.target.value })}
                placeholder="Meet at the tourism office for a short welcome"
                className="flex-1"
              />
              <div className="flex gap-1">
                <SmallButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowUp />
                </SmallButton>
                <SmallButton
                  label="Move down"
                  disabled={index === steps.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown />
                </SmallButton>
                <SmallButton
                  label="Remove step"
                  onClick={() =>
                    setSteps((current) => current.filter((item) => item.key !== step.key))
                  }
                >
                  <Trash2 />
                </SmallButton>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setSteps((current) => [
              ...current,
              { key: crypto.randomUUID(), time: '', activity: '' },
            ])
          }
        >
          <Plus /> Add step
        </Button>
        <Button
          size="sm"
          disabled={saving}
          onClick={() =>
            start(async () => {
              const result = await saveItinerary({
                id: experienceId,
                steps: steps
                  .map(({ time, activity }) => ({ time, activity }))
                  .filter((step) => step.time.trim() || step.activity.trim()),
              })
              setState(result)
            })
          }
        >
          {saving ? 'Saving…' : 'Save itinerary'}
        </Button>
        <SaveStatus state={state} />
      </div>
    </div>
  )
}

export function SmallButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 cursor-pointer place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/8 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:size-4"
    >
      {children}
    </button>
  )
}
