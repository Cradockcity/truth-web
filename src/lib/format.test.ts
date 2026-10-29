import { expect, test } from 'vitest'

import { formatRand } from './format'

test('formats whole rand with the symbol attached and South African grouping', () => {
  expect(formatRand(180)).toBe('R180')
  expect(formatRand(12500).replace(/\s/g, ' ')).toBe('R12 500')
})
