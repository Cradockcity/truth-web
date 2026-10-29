'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/cn'
import type { FilterOptions } from '@/lib/data/experiences'
import { type ExperienceFilters, filtersToSearch, parseFilters } from '@/lib/filters'

import { FilterFields } from './filter-fields'

export function SearchPill({
  options,
  overlay,
  className,
}: {
  options: FilterOptions
  overlay: boolean
  className?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ExperienceFilters>(() => parseFilters({}))

  function search() {
    setOpen(false)
    router.push(`/experiences${filtersToSearch(draft)}`)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group flex h-12 min-w-0 cursor-pointer items-center rounded-full pr-1.5 pl-5 text-caption text-ink transition-colors duration-200',
          overlay
            ? 'glass hover:bg-night/70'
            : 'border border-line bg-control shadow-float hover:border-ink/25',
          className,
        )}
      >
        <span className="font-semibold">{draft.location ?? 'Anywhere'}</span>
        <span className="hidden items-center sm:flex">
          <Divider />
          <span className="font-semibold">{draft.category ?? 'Any type'}</span>
          <Divider />
          <span className={draft.guests ? 'font-semibold' : 'text-ink/65'}>
            {draft.guests ? `${draft.guests} guests` : 'Add guests'}
          </span>
        </span>
        <span className="ml-3 grid size-9 place-items-center rounded-full bg-ink text-canvas transition-transform duration-200 ease-out-quint group-hover:scale-105">
          <Search className="size-4" strokeWidth={2.5} aria-hidden />
        </span>
        <span className="sr-only">Search experiences</span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Find an experience"
        side="center"
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" onClick={() => setDraft(parseFilters({}))}>
              Clear
            </Button>
            <Button onClick={search}>
              <Search /> Search
            </Button>
          </div>
        }
      >
        <FilterFields
          value={draft}
          onChange={setDraft}
          options={options}
          fields={['location', 'category', 'guests']}
        />
      </Sheet>
    </>
  )
}

function Divider() {
  return <span aria-hidden className="mx-4 h-5 w-px bg-ink/20" />
}
