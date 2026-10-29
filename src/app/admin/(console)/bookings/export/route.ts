import { exportBookings } from '@/lib/admin/bookings'
import { bookingCode, parseBookingFilters } from '@/lib/booking-filters'
import { csvResponse, toCsv } from '@/lib/csv'
import { todayInSouthAfrica } from '@/lib/sessions'

const when = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'short',
  timeStyle: 'short',
  hourCycle: 'h23',
  timeZone: 'Africa/Johannesburg',
})
const stamp = (value: string | null) =>
  value ? when.format(new Date(value)).replace(', ', ' ') : null

// The bookings matching the page's filters, as a spreadsheet. exportBookings checks for an admin.
export async function GET(request: Request) {
  const filters = parseBookingFilters(Object.fromEntries(new URL(request.url).searchParams))
  const bookings = await exportBookings(filters)

  const csv = toCsv(
    [
      'Booking code',
      'Session date',
      'Time',
      'Experience',
      'Host',
      'Creator',
      'Customer',
      'Email',
      'Phone',
      'Guests',
      'Experience amount',
      'Service fee',
      'Total',
      'Status',
      'Paid at',
      'Refund',
      'Refund status',
      'Cancelled at',
      'Paystack reference',
    ],
    bookings.map((b) => [
      bookingCode(b.id),
      b.date,
      b.time,
      b.title,
      b.hostName,
      b.creatorName,
      b.customerName,
      b.customerEmail,
      b.customerPhone,
      b.guests,
      b.subtotal,
      b.fee,
      b.total,
      b.status,
      stamp(b.paidAt),
      b.refundAmount,
      b.refundStatus,
      stamp(b.cancelledAt),
      b.paymentReference,
    ]),
  )
  return csvResponse(csv, `truth-bookings-${todayInSouthAfrica()}.csv`)
}
