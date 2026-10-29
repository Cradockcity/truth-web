import { exportPayouts } from '@/lib/admin/payouts'
import { bookingCode } from '@/lib/booking-filters'
import { csvResponse, toCsv } from '@/lib/csv'
import { parsePayoutFilters } from '@/lib/payouts'
import { todayInSouthAfrica } from '@/lib/sessions'

// Payments matching the history's filters, one line per booking paid. exportPayouts checks
// for an admin.
export async function GET(request: Request) {
  const filters = parsePayoutFilters(Object.fromEntries(new URL(request.url).searchParams))
  const payouts = await exportPayouts(filters)

  const csv = toCsv(
    [
      'Paid on',
      'Paid to',
      'Type',
      'Payment reference',
      'Statement',
      'Payment total',
      'Booking code',
      'Experience',
      'Session date',
      'Guests',
      'Experience price',
      'Share %',
      'Amount',
    ],
    payouts.flatMap((payout) =>
      payout.earnings.map((earning) => [
        payout.paidOn,
        payout.name,
        payout.recipient === 'host' ? 'Host' : 'Creator',
        payout.reference,
        bookingCode(payout.id),
        payout.amount,
        bookingCode(earning.bookingId),
        earning.title,
        earning.sessionDate,
        earning.guests,
        earning.baseAmount,
        earning.rate,
        earning.amount,
      ]),
    ),
  )
  return csvResponse(csv, `truth-payments-${todayInSouthAfrica()}.csv`)
}
