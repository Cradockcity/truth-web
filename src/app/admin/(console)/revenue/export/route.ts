import { getRevenueYear } from '@/lib/admin/revenue'
import { bookingCode } from '@/lib/booking-filters'
import { csvResponse, toCsv } from '@/lib/csv'
import { parseRevenueFilters } from '@/lib/revenue'
import { todayInSouthAfrica } from '@/lib/sessions'

// The Revenue report's bookings (the year, or the chosen month), one line each.
// getRevenueYear checks for an admin.
export async function GET(request: Request) {
  const filters = parseRevenueFilters(
    Object.fromEntries(new URL(request.url).searchParams),
    Number(todayInSouthAfrica().slice(0, 4)),
  )
  const rows = (await getRevenueYear(filters))
    .filter((row) => !filters.month || row.date?.startsWith(filters.month))
    .reverse()

  const csv = toCsv(
    [
      'Booking code',
      'Experience date',
      'Experience',
      'Host',
      'Guests',
      'Status',
      'Paid by',
      'Guest paid',
      'Refund',
      'Host share',
      'Creator share',
      'Paystack fee',
      'Truth made',
    ],
    rows.map((row) => [
      bookingCode(row.id),
      row.date,
      row.title,
      row.hostName,
      row.guests,
      row.status,
      row.channel,
      row.guestPaid,
      row.refunded,
      row.host,
      row.creator,
      row.feeKnown ? row.fee : null,
      row.made,
    ]),
  )
  return csvResponse(csv, `truth-revenue-${filters.month ?? filters.year}.csv`)
}
