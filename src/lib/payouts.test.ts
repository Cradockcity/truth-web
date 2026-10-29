import { expect, test } from 'vitest'

import {
  earningStatus,
  formatDay,
  groupOwed,
  groupPayoutsByMonth,
  groupPayoutsByPerson,
  parsePayoutFilters,
  payoutFiltersToParams,
  payoutRange,
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

test('payment history filters read a year, a month in it and one person', () => {
  expect(
    parsePayoutFilters(
      { year: '2026', month: '2026-10', person: 'host:a2000000-0000-0000-0000-000000000002' },
      2026,
    ),
  ).toEqual({
    year: 2026,
    month: '2026-10',
    recipient: 'host',
    personId: 'a2000000-0000-0000-0000-000000000002',
    page: 1,
  })
  // Bad values fall back; a month outside the year is ignored.
  expect(
    parsePayoutFilters({ year: 'soon', month: '2025-01', person: 'boss:1', page: '0' }, 2026),
  ).toEqual({
    year: 2026,
    month: null,
    recipient: null,
    personId: null,
    page: 1,
  })
  const filters = parsePayoutFilters(
    { year: '2026', person: 'creator:b2000000-0000-0000-0000-000000000002' },
    2026,
  )
  expect(payoutFiltersToParams(filters, { page: 2 }).toString()).toBe(
    'year=2026&person=creator%3Ab2000000-0000-0000-0000-000000000002&page=2',
  )
  expect(payoutRange(filters)).toEqual(['2026-01-01', '2026-12-31'])
  expect(payoutRange({ ...filters, month: '2026-02' })).toEqual(['2026-02-01', '2026-02-28'])
})

const paid = [
  {
    recipient: 'host',
    personId: 'h1',
    name: 'David',
    amount: 196.8,
    paidOn: '2026-10-29',
    bookingCount: 1,
  },
  {
    recipient: 'host',
    personId: 'h1',
    name: 'David',
    amount: 100,
    paidOn: '2026-03-02',
    bookingCount: 2,
  },
  {
    recipient: 'creator',
    personId: 'c1',
    name: 'Adventure',
    amount: 12,
    paidOn: '2026-10-30',
    bookingCount: 1,
  },
] as const

test('payments add up per month, split by hosts and creators', () => {
  const months = groupPayoutsByMonth(paid, 2026)
  expect(months).toHaveLength(12)
  expect(months[0]).toMatchObject({ key: '2026-01', short: 'Jan', payments: 0, total: 0 })
  expect(months[2]).toMatchObject({
    key: '2026-03',
    payments: 1,
    hosts: 100,
    creators: 0,
    total: 100,
  })
  expect(months[9]).toMatchObject({
    key: '2026-10',
    long: 'October 2026',
    payments: 2,
    hosts: 196.8,
    creators: 12,
    total: 208.8,
  })
})

test('payments add up per person, most paid first', () => {
  expect(groupPayoutsByPerson(paid)).toEqual([
    {
      recipient: 'host',
      personId: 'h1',
      name: 'David',
      payments: 2,
      bookings: 3,
      total: 296.8,
      lastPaid: '2026-10-29',
    },
    {
      recipient: 'creator',
      personId: 'c1',
      name: 'Adventure',
      payments: 1,
      bookings: 1,
      total: 12,
      lastPaid: '2026-10-30',
    },
  ])
})
