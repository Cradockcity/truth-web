import { expect, test } from 'vitest'

import { formatSessionDate, todayInSouthAfrica, toHourMinute } from './sessions'

test('today is the South African calendar day, not UTC', () => {
  // 23:30 UTC on 29 Oct is already 30 Oct in Johannesburg (UTC+2).
  expect(todayInSouthAfrica(new Date('2026-10-29T23:30:00Z'))).toBe('2026-10-30')
})

test('session dates never shift a day', () => {
  expect(formatSessionDate('2026-10-31')).toMatch(/Saturday.*31.*October/)
  expect(toHourMinute('09:00:00')).toBe('09:00')
})
