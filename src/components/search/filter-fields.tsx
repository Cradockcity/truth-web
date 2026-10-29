'use client'

import { Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Stepper } from '@/components/ui/stepper'
import type { FilterOptions } from '@/lib/data/experiences'
import { type ExperienceFilters, SORT_LABELS, SORTS, type Sort } from '@/lib/filters'
import { formatRand } from '@/lib/format'

export type FilterField = 'location' | 'category' | 'guests' | 'maxPrice' | 'sort'

const PRICE_STEPS = [100, 150, 200, 300, 500, 1000, 2000]

export function FilterFields({
  value,
  onChange,
  options,
  fields,
}: {
  value: ExperienceFilters
  onChange: (next: ExperienceFilters) => void
  options: FilterOptions
  fields: FilterField[]
}) {
  const set = <K extends keyof ExperienceFilters>(key: K, next: ExperienceFilters[K]) =>
    onChange({ ...value, [key]: next })

  const priceSteps = PRICE_STEPS.filter((step) => step < options.highestPrice * 2)

  return (
    <div className="flex flex-col gap-6">
      {fields.includes('location') ? (
        <div className="grid gap-2">
          <Label htmlFor="filter-location">Where</Label>
          <Select
            id="filter-location"
            value={value.location ?? ''}
            onChange={(event) => set('location', event.target.value || null)}
          >
            <option value="">Anywhere</option>
            {options.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {fields.includes('category') ? (
        <div className="grid gap-2">
          <Label htmlFor="filter-category">Type of experience</Label>
          <Select
            id="filter-category"
            value={value.category ?? ''}
            onChange={(event) => set('category', event.target.value || null)}
          >
            <option value="">Any type</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {fields.includes('guests') ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Guests</p>
            <p className="text-caption text-ink/60">Hides experiences too small for your group</p>
          </div>
          <Stepper
            label="Guests"
            value={value.guests ?? 0}
            min={0}
            max={30}
            onChange={(guests) => set('guests', guests || null)}
          />
        </div>
      ) : null}

      {fields.includes('maxPrice') ? (
        <div className="grid gap-2">
          <Label htmlFor="filter-price">Price per person</Label>
          <Select
            id="filter-price"
            value={value.maxPrice ?? ''}
            onChange={(event) => set('maxPrice', Number(event.target.value) || null)}
          >
            <option value="">Any price</option>
            {priceSteps.map((step) => (
              <option key={step} value={step}>
                Up to {formatRand(step)}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {fields.includes('sort') ? (
        <div className="grid gap-2">
          <Label htmlFor="filter-sort">Sort by</Label>
          <Select
            id="filter-sort"
            value={value.sort}
            onChange={(event) => set('sort', event.target.value as Sort)}
          >
            {SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {SORT_LABELS[sort]}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
    </div>
  )
}
