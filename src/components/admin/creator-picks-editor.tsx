'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { saveCreatorPicks } from '@/lib/actions/admin-people'
import type { FormState } from '@/lib/admin/form'
import { cn } from '@/lib/cn'

import { SaveStatus } from './save-status'

export function CreatorPicksEditor({
  creatorId,
  initial,
  experiences,
}: {
  creatorId: string
  initial: string[]
  experiences: { id: string; title: string; location: string | null; isActive: boolean }[]
}) {
  const [chosen, setChosen] = useState(() => new Set(initial))
  const [state, setState] = useState<FormState>({})
  const [saving, start] = useTransition()

  const toggle = (id: string) =>
    setChosen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid gap-2 sm:grid-cols-2">
        {experiences.map((experience) => {
          const on = chosen.has(experience.id)
          return (
            <li key={experience.id}>
              <label
                className={cn(
                  'flex h-full cursor-pointer items-start gap-3 rounded-control border px-4 py-3 transition-colors',
                  on ? 'border-ink bg-surface' : 'border-line hover:border-ink/40',
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(experience.id)}
                  className="mt-1 accent-current"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{experience.title}</span>
                  <span className="text-caption text-ink/60">
                    {experience.location ?? 'No location'}
                    {experience.isActive ? '' : ' · Hidden, not shown until it’s live'}
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="sm"
          disabled={saving}
          onClick={() =>
            start(async () => {
              setState(await saveCreatorPicks({ id: creatorId, experienceIds: [...chosen] }))
            })
          }
        >
          {saving ? 'Saving…' : 'Save picks'}
        </Button>
        <span className="text-caption text-ink/55">
          {chosen.size === 1 ? '1 chosen' : `${chosen.size} chosen`}
        </span>
        <SaveStatus state={state} />
      </div>
    </div>
  )
}
