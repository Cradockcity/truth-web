import { expect, test } from 'vitest'

import { toSessions, toSlots } from './schedule'

test('groups weekday rows into sessions and back', () => {
  const slots = [
    { weekday: 1, time: '09:00', capacity: 8 },
    { weekday: 2, time: '09:00', capacity: 8 },
    { weekday: 6, time: '15:00', capacity: 4 },
  ]
  const sessions = toSessions(slots)
  expect(sessions).toEqual([
    { time: '09:00', capacity: 8, days: [1, 2] },
    { time: '15:00', capacity: 4, days: [6] },
  ])
  expect(toSlots(sessions)).toEqual(slots)
})

test('a later session overrides an earlier one on the same day and time', () => {
  expect(
    toSlots([
      { time: '09:00', capacity: 8, days: [1] },
      { time: '09:00', capacity: 12, days: [1] },
    ]),
  ).toEqual([{ weekday: 1, time: '09:00', capacity: 12 }])
})
