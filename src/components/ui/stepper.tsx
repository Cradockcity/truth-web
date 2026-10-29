'use client'

import { Minus, Plus } from 'lucide-react'

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  const button =
    'grid size-9 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-30'

  return (
    <div className="flex items-center gap-4" role="group" aria-label={label}>
      <button
        type="button"
        className={button}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Fewer ${label.toLowerCase()}`}
      >
        <Minus className="size-4" />
      </button>
      <output aria-live="polite" className="w-6 text-center text-body font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`More ${label.toLowerCase()}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
