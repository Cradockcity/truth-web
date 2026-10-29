import { expect, test } from 'vitest'

import { quote } from './pricing'

test('adds a 5% service fee rounded to cents', () => {
  expect(quote(85, 2)).toEqual({ subtotal: 170, fee: 8.5, total: 178.5 })
  expect(quote(110, 3)).toEqual({ subtotal: 330, fee: 16.5, total: 346.5 })
  expect(quote(75, 1)).toEqual({ subtotal: 75, fee: 3.75, total: 78.75 })
})
