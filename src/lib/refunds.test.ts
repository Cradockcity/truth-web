import { expect, test } from 'vitest'

import { refundAmount } from './refunds'

test('each refund choice returns the right amount', () => {
  expect(refundAmount('full', 178.5, 8.5)).toBe(178.5)
  expect(refundAmount('minus-fee', 178.5, 8.5)).toBe(170)
  expect(refundAmount('none', 178.5, 8.5)).toBe(0)
})

test('never refunds a negative amount', () => {
  expect(refundAmount('minus-fee', 5, 8.5)).toBe(0)
})
