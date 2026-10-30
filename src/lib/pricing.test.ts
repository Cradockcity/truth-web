import { expect, test } from 'vitest'

import { quote } from './pricing'

test('total equals price × guests with no service fee', () => {
  expect(quote(85, 2)).toEqual({ subtotal: 170, fee: 0, total: 170 })
  expect(quote(110, 3)).toEqual({ subtotal: 330, fee: 0, total: 330 })
  expect(quote(75, 1)).toEqual({ subtotal: 75, fee: 0, total: 75 })
})
