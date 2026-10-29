import { expect, test } from 'vitest'

import {
  earningStatus,
  formatDay,
  groupOwed,
  parsePayoutFilters,
  payoutFiltersToParams,
  sumAmounts,
} from './payouts'

test('earnings are due from their due date, and paid or cancelled ones stay that way', () => {
  const open = { payoutId: null, voidedAt: null, dueOn: '2026-11-03' }
  expect(earningStatus(open, '2026-11-02')).toBe('upcoming')
  expect(earningStatus(open, '2026-11-03')).toBe('due')
  expect(earningStatus({ ...open, payoutId: 'p1' }, '2026-11-03')).toBe('paid')
  expect(earningStatus({ ...open, voidedAt: '2026-11-01T10:00:00Z' }, '2026-11-03')).toBe(
    'cancelled',
  )
})

test('amounts add up exactly in rands and cents', () => {
  expect(sumAmounts([{ amount: 0.1 }, { amount: 0.2 }])).toBe(0.3)
  expect(sumAmounts([{ amount: 126.4 }, { amount: 820 }, { amount: 50.15 }])).toBe(996.55)
  expect(sumAmounts([])).toBe(0)
})

test('open earnings are grouped per person, most owed first', () => {
  const base = { dueOn: '2026-11-03' }
  const owed = groupOwed([
    { ...base, recipient: 'host', personId: 'h1', name: 'David', amount: 820, status: 'due' },
    { ...base, recipient: 'host', personId: 'h1', name: 'David', amount: 410, status: 'due' },
    {
      recipient: 'host',
      personId: 'h1',
      name: 'David',
      amount: 100,
      dueOn: '2026-12-01',
      status: 'upcoming',
    },
    {
      recipient: 'host',
      personId: 'h1',
      name: 'David',
      amount: 90,
      dueOn: '2026-11-20',
      status: 'upcoming',
    },
    { ...base, recipient: 'creator', personId: 'h1', name: 'Same id', amount: 50, status: 'due' },
    { ...base, recipient: 'host', personId: 'h2', name: 'Paid', amount: 999, status: 'paid' },
  ])
  expect(owed).toEqual([
    {
      recipient: 'host',
      personId: 'h1',
      name: 'David',
      due: { count: 2, total: 1230 },
      upcoming: { count: 2, total: 190, next: '2026-11-20' },
    },
    {
      recipient: 'creator',
      personId: 'h1',
      name: 'Same id',
      due: { count: 1, total: 50 },
      upcoming: { count: 0, total: 0, next: null },
    },
  ])
})

test('days show with the year', () => {
  expect(formatDay('2026-03-12')).toBe('12 Mar 2026')
})

test('payment history filters read a month and one person', () => {
  expect(
    parsePayoutFilters({ month: '2026-10', person: 'host:a2000000-0000-0000-0000-000000000002' }),
  ).toEqual({
    from: '2026-10-01',
    to: '2026-10-31',
    recipient: 'host',
    personId: 'a2000000-0000-0000-0000-000000000002',
    page: 1,
  })
  expect(parsePayoutFilters({ person: 'boss:1', from: 'soon', page: '0' })).toEqual({
    from: null,
    to: null,
    recipient: null,
    personId: null,
    page: 1,
  })
  const filters = parsePayoutFilters({
    from: '2026-10-01',
    person: 'creator:b2000000-0000-0000-0000-000000000002',
  })
  expect(payoutFiltersToParams(filters, { page: 2 }).toString()).toBe(
    'from=2026-10-01&person=creator%3Ab2000000-0000-0000-0000-000000000002&page=2',
  )
})
