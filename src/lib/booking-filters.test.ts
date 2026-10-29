import { expect, test } from 'vitest'

import {
  bookingCode,
  bookingCodeRange,
  bookingFiltersToParams,
  bookingTotals,
  monthRange,
  parseBookingFilters,
} from './booking-filters'

test('filters come from the URL, and bad values fall back to defaults', () => {
  expect(parseBookingFilters({})).toEqual({
    status: 'all',
    when: 'upcoming',
    q: null,
    experienceId: null,
    hostId: null,
    creatorId: null,
    from: null,
    to: null,
    page: 1,
  })
  const filters = parseBookingFilters({
    status: 'paid',
    when: 'past',
    q: '  jane ',
    host: 'a2000000-0000-0000-0000-000000000002',
    creator: 'not-an-id',
    page: '3',
  })
  expect(filters).toMatchObject({
    status: 'paid',
    when: 'past',
    q: 'jane',
    creatorId: null,
    page: 3,
  })
  expect(parseBookingFilters({ status: 'nope', page: '-1' })).toMatchObject({
    status: 'all',
    page: 1,
  })
})

test('a date range replaces Upcoming and Past', () => {
  const filters = parseBookingFilters({ when: 'past', from: '2026-03-01', to: '2026-03-31' })
  expect(filters.when).toBe('all')
  expect(bookingFiltersToParams(filters).toString()).toBe('from=2026-03-01&to=2026-03-31')
})

test('a month becomes its first and last day', () => {
  expect(monthRange('2026-02')).toEqual(['2026-02-01', '2026-02-28'])
  expect(monthRange('2028-02')).toEqual(['2028-02-01', '2028-02-29'])
  expect(monthRange('2026-13')).toBeNull()
  expect(parseBookingFilters({ month: '2026-03' })).toMatchObject({
    from: '2026-03-01',
    to: '2026-03-31',
    when: 'all',
  })
})

test('links keep the filters and leave out defaults', () => {
  const filters = parseBookingFilters({ status: 'paid', q: 'jane', page: '2' })
  expect(bookingFiltersToParams(filters).toString()).toBe('status=paid&q=jane&page=2')
  expect(bookingFiltersToParams(filters, { page: 1 }).toString()).toBe('status=paid&q=jane')
})

test('a booking code matches ids that start with it', () => {
  expect(bookingCode('8a29506e-940a-45e4-9a4c-16eda9ce2312')).toBe('8A29506E')
  expect(bookingCodeRange(' 8A29506E ')).toEqual([
    '8a29506e-0000-0000-0000-000000000000',
    '8a29506e-ffff-ffff-ffff-ffffffffffff',
  ])
  expect(bookingCodeRange('jane')).toBeNull()
  expect(bookingCodeRange('8a29506')).toBeNull()
})

test('money taken counts paid bookings, less refunds', () => {
  const row = { paid_at: '2026-10-29T09:00:00Z', refund_amount: null, refund_status: null }
  expect(
    bookingTotals([
      { ...row, status: 'paid', guest_count: 2, total_amount: 252 },
      { ...row, status: 'paid', guest_count: 1, total_amount: 89.25 },
      // Paid, then cancelled with a refund: the refund comes off.
      {
        status: 'cancelled',
        paid_at: '2026-10-29T09:00:00Z',
        guest_count: 1,
        total_amount: 178.5,
        refund_amount: 170,
        refund_status: 'processed',
      },
      // Never paid: counted as a booking, but no money.
      {
        status: 'pending',
        paid_at: null,
        guest_count: 4,
        total_amount: 500,
        refund_amount: null,
        refund_status: null,
      },
      // A failed refund wasn't returned.
      {
        ...row,
        status: 'cancelled',
        guest_count: 1,
        total_amount: 100,
        refund_amount: 100,
        refund_status: 'failed',
      },
    ]),
  ).toEqual({ bookings: 5, paid: 2, guests: 3, taken: 449.75, refunded: 170 })
})
