import { expect, test } from 'vitest'

import { safeNext } from './safe-next'

test('keeps same-site paths', () => {
  expect(safeNext('/experiences/abc?x=1')).toBe('/experiences/abc?x=1')
})

test('rejects anything that could leave the site', () => {
  for (const value of [
    '//evil.com',
    'https://evil.com',
    '/\\evil.com',
    'evil',
    '',
    null,
    undefined,
  ]) {
    expect(safeNext(value)).toBe('/account/bookings')
  }
})
