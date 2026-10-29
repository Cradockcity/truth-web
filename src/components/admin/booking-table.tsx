import Link from 'next/link'

import type { AdminBooking } from '@/lib/admin/bookings'
import { formatRand } from '@/lib/format'
import { formatSessionDate } from '@/lib/sessions'

import { StatusChip } from './status-chip'

export function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  if (bookings.length === 0) {
    return (
      <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
        No bookings match.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-sheet border border-line bg-control">
      <table className="w-full text-left text-caption">
        <thead className="hidden border-b border-line bg-surface text-ink/60 md:table-header-group">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Session
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Experience
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Customer
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Guests
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Total
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="relative grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-surface md:table-row md:p-0"
            >
              <td className="md:px-4 md:py-3">
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="font-medium after:absolute after:inset-0"
                >
                  {booking.date ? formatSessionDate(booking.date, 'short') : 'No date'}
                </Link>
                {booking.time ? <span className="text-ink/60"> · {booking.time}</span> : null}
              </td>
              <td className="col-span-2 text-ink/80 md:col-span-1 md:px-4 md:py-3">
                {booking.title}
              </td>
              <td className="text-ink/80 md:px-4 md:py-3">
                {booking.customerName ?? '—'}
                <span className="block text-ink/50">{booking.customerEmail}</span>
              </td>
              <td className="hidden text-right tabular-nums md:table-cell md:px-4 md:py-3">
                {booking.guests}
              </td>
              <td className="text-right tabular-nums md:px-4 md:py-3">
                {formatRand(booking.total)}
              </td>
              <td className="col-start-2 row-start-1 md:px-4 md:py-3">
                <StatusChip status={booking.status} />
                {booking.refundAmount ? (
                  <span className="mt-1 block text-ink/55">
                    {booking.refundStatus === 'processed'
                      ? `Refunded ${formatRand(booking.refundAmount)}`
                      : booking.refundStatus === 'failed'
                        ? 'Refund failed'
                        : 'Refund processing'}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
