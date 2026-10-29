import { expect, test } from 'vitest'

import {
  bookingRevenue,
  groupRevenueByMonth,
  parseRevenueFilters,
  revenueFiltersToParams,
  totalRevenue,
} from './revenue'

const base = { refundAmount: null, refundStatus: null }

test('a paid booking: Truth keeps the fee and commission, less Paystack', () => {
  // R150 price + R7,50 service fee; host 80% (R120); no creator; Paystack R5,72.
  expect(
    bookingRevenue({
      ...base,
      total: 157.5,
      paystackFee: 5.72,
      shares: [{ recipient: 'host', amount: 120, voided: false }],
    }),
  ).toEqual({
    guestPaid: 157.5,
    refunded: 0,
    host: 120,
    creator: 0,
    fee: 5.72,
    feeKnown: true,
    made: 31.78,
  })
})

test('a creator booking pays the creator from Truth’s part', () => {
  const revenue = bookingRevenue({
    ...base,
    total: 157.5,
    paystackFee: 5.72,
    shares: [
      { recipient: 'host', amount: 120, voided: false },
      { recipient: 'creator', amount: 7.5, voided: false },
    ],
  })
  expect(revenue.made).toBe(24.28)
})

test('cancelled with a full refund: Truth loses only Paystack’s fee', () => {
  expect(
    bookingRevenue({
      total: 178.5,
      refundAmount: 178.5,
      refundStatus: 'processed',
      paystackFee: 7.11,
      shares: [{ recipient: 'host', amount: 144.5, voided: true }],
    }),
  ).toMatchObject({ refunded: 178.5, host: 0, made: -7.11 })
})

test('cancelled after the host was paid: the paid share still counts', () => {
  expect(
    bookingRevenue({
      total: 252,
      refundAmount: 252,
      refundStatus: 'pending',
      paystackFee: 8.4,
      shares: [{ recipient: 'host', amount: 196.8, voided: false }],
    }).made,
  ).toBe(-205.2)
})

test('a failed refund wasn’t given back', () => {
  expect(
    bookingRevenue({
      total: 100,
      refundAmount: 100,
      refundStatus: 'failed',
      paystackFee: 3,
      shares: [],
    }),
  ).toMatchObject({ refunded: 0, made: 97 })
})

test('a missing fee counts as R0 and is flagged', () => {
  const rows = [
    bookingRevenue({ ...base, total: 158, paystackFee: null, shares: [] }),
    bookingRevenue({ ...base, total: 100, paystackFee: 3, shares: [] }),
  ]
  expect(rows[0]).toMatchObject({ fee: 0, feeKnown: false, made: 158 })
  expect(totalRevenue(rows)).toEqual({
    bookings: 2,
    guestPaid: 258,
    refunded: 0,
    host: 0,
    creator: 0,
    fee: 3,
    made: 255,
    missingFees: 1,
  })
})

test('revenue groups by the experience month', () => {
  const row = bookingRevenue({ ...base, total: 100, paystackFee: 3, shares: [] })
  const months = groupRevenueByMonth(
    [
      { ...row, date: '2026-03-11' },
      { ...row, date: '2026-03-20' },
      { ...row, date: '2025-03-01' },
      { ...row, date: null },
    ],
    2026,
  )
  expect(months[2]).toMatchObject({ key: '2026-03', bookings: 2, made: 194 })
  expect(months[0]).toMatchObject({ bookings: 0, made: 0 })
})

test('revenue filters come from the URL', () => {
  const filters = parseRevenueFilters(
    { year: '2026', month: '2026-10', host: 'A3000000-0000-0000-0000-000000000003', page: '2' },
    2026,
  )
  expect(filters).toEqual({
    year: 2026,
    month: '2026-10',
    experienceId: null,
    hostId: 'a3000000-0000-0000-0000-000000000003',
    page: 2,
  })
  expect(revenueFiltersToParams(filters, { page: 1 }).toString()).toBe(
    'year=2026&month=2026-10&host=a3000000-0000-0000-0000-000000000003',
  )
  expect(parseRevenueFilters({ year: 'x', experience: 'nope' }, 2027)).toMatchObject({
    year: 2027,
    experienceId: null,
  })
})
