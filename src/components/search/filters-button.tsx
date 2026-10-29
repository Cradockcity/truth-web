'use client'

import { SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import type { FilterOptions } from '@/lib/data/experiences'
import { countActiveFilters, type ExperienceFilters, filtersToSearch } from '@/lib/filters'

import { FilterFields } from './filter-fields'

export function FiltersButton({
  filters,
  options,
}: {
  filters: ExperienceFilters
  options: FilterOptions
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(filters)
  const active = countActiveFilters(filters)

  function apply(next: ExperienceFilters) {
    setOpen(false)
    router.push(`/experiences${filtersToSearch(next)}`, { scroll: false })
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setDraft(filters)
          setOpen(true)
        }}
      >
        <SlidersHorizontal /> Filters
        {active > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-ink text-[0.7rem] text-canvas">
            {active}
          </span>
        ) : null}
      </Button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                apply({ ...draft, location: null, category: null, guests: null, maxPrice: null })
              }
            >
              Clear all
            </Button>
            <Button onClick={() => apply(draft)}>Show results</Button>
          </div>
        }
      >
        <FilterFields
          value={draft}
          onChange={setDraft}
          options={options}
          fields={['location', 'category', 'guests', 'maxPrice', 'sort']}
        />
      </Sheet>
    </>
  )
}
