import { expect, test } from 'vitest'

import { toCsv } from './csv'

test('csv quotes fields with commas, quotes and new lines', () => {
  const csv = toCsv(['Name', 'Note'], [['Smith, Jane', 'Said "hi"\nthen left']])
  expect(csv).toBe('﻿Name,Note\r\n"Smith, Jane","Said ""hi""\nthen left"\r\n')
})

test('csv leaves numbers and empty cells plain', () => {
  expect(toCsv(['A', 'B', 'C'], [[178.5, null, undefined]])).toBe('﻿A,B,C\r\n178.5,,\r\n')
})

test('csv stops text from running as an Excel formula', () => {
  const csv = toCsv(['A'], [['=HYPERLINK("x")'], ['+27 82 000'], ['-5'], ['@sum']])
  expect(csv.split('\r\n').slice(1, 5)).toEqual([
    `"'=HYPERLINK(""x"")"`,
    "'+27 82 000",
    "'-5",
    "'@sum",
  ])
  // Real negative numbers stay numbers.
  expect(toCsv(['A'], [[-5]])).toBe('﻿A\r\n-5\r\n')
})
