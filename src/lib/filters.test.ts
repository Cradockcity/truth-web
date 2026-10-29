import { describe, expect, test } from 'vitest'

import { filtersToSearch, parseFilters, parseGroupSize } from './filters'

describe('parseFilters', () => {
  test('reads valid filters from the URL', () => {
    expect(
      parseFilters({
        location: 'Cape Town',
        category: 'Adventure',
        guests: '4',
        maxPrice: '150',
        sort: 'price-low',
      }),
    ).toEqual({
      location: 'Cape Town',
      category: 'Adventure',
      guests: 4,
      maxPrice: 150,
      sort: 'price-low',
    })
  })

  test('ignores malformed values instead of failing', () => {
    expect(
      parseFilters({ guests: 'lots', maxPrice: '-5', sort: 'cheapest', location: ['  ', 'x'] }),
    ).toEqual({ location: null, category: null, guests: null, maxPrice: null, sort: 'recommended' })
  })
})

test('filtersToSearch round-trips and drops defaults', () => {
  const filters = parseFilters({ category: 'Food & Drink', guests: '2' })
  expect(filtersToSearch(filters)).toBe('?category=Food+%26+Drink&guests=2')
  expect(filtersToSearch({ sort: 'recommended' })).toBe('')
})

test('parseGroupSize reads the number out of stored text', () => {
  expect(parseGroupSize('Up to 12 people')).toBe(12)
  expect(parseGroupSize(null)).toBeNull()
})
