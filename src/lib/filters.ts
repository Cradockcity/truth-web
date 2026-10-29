import { z } from 'zod'

export const SORTS = ['recommended', 'price-low', 'price-high', 'rating'] as const
export type Sort = (typeof SORTS)[number]

export const SORT_LABELS: Record<Sort, string> = {
  recommended: 'Recommended',
  'price-low': 'Price: low to high',
  'price-high': 'Price: high to low',
  rating: 'Highest rated',
}

export type ExperienceFilters = {
  location: string | null
  category: string | null
  guests: number | null
  maxPrice: number | null
  sort: Sort
}

type RawParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const text = z.string().trim().min(1).max(80).nullable().catch(null)

const positiveInt = (max: number) => z.coerce.number().int().min(1).max(max).nullable().catch(null)

// Lenient by design: anything malformed in the URL falls back to "no filter" rather than erroring.
export function parseFilters(params: RawParams): ExperienceFilters {
  return {
    location: text.parse(first(params.location) ?? null),
    category: text.parse(first(params.category) ?? null),
    guests: positiveInt(30).parse(first(params.guests) ?? null),
    maxPrice: positiveInt(100_000).parse(first(params.maxPrice) ?? null),
    sort: z.enum(SORTS).catch('recommended').parse(first(params.sort)),
  }
}

export function filtersToSearch(filters: Partial<ExperienceFilters>) {
  const params = new URLSearchParams()
  if (filters.location) params.set('location', filters.location)
  if (filters.category) params.set('category', filters.category)
  if (filters.guests) params.set('guests', String(filters.guests))
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
  if (filters.sort && filters.sort !== 'recommended') params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function countActiveFilters(filters: ExperienceFilters) {
  return [filters.location, filters.category, filters.guests, filters.maxPrice].filter(Boolean)
    .length
}

// Group sizes are stored as text such as "Up to 8 people".
export function parseGroupSize(groupSize: string | null): number | null {
  const match = groupSize?.match(/\d+/)
  return match ? Number(match[0]) : null
}
