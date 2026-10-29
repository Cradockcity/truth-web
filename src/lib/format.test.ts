import { expect, test } from 'vitest'

import { formatRand } from './format'

const plain = (value: string) => value.replace(/\s/g, ' ')

test('formats whole rand with the symbol attached and South African grouping', () => {
  expect(formatRand(180)).toBe('R180')
  expect(plain(formatRand(12500))).toBe('R12 500')
})

test('shows exact cents when an amount has them', () => {
  expect(formatRand(8.5)).toBe('R8,50')
  expect(plain(formatRand(1178.5))).toBe('R1 178,50')
})

test('negative amounts keep the symbol attached, like -R7,11', () => {
  expect(formatRand(-7.11)).toBe('-R7,11')
  expect(plain(formatRand(-1250))).toBe('-R1 250')
})
