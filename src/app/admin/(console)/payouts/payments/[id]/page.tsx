import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PrintButton } from '@/components/admin/print-button'
import { RecipientChip } from '@/components/admin/recipient-chip'
import { getPayoutStatement } from '@/lib/admin/payouts'
import { bookingCode } from '@/lib/booking-filters'
import { isUuid } from '@/lib/data/experiences'
import { formatRand } from '@/lib/format'
import { formatDay } from '@/lib/payouts'

export const metadata = { title: 'Payment statement' }

// A statement for one payment: which bookings it paid for. Printable, or saved as a PDF
// to send to the host or creator.
export default async function PaymentStatementPage({
  params,
}: PageProps<'/admin/payouts/payments/[id]'>) {
  const { id } = await params
  const payout = isUuid(id) ? await getPayoutStatement(id) : null
  if (!payout) notFound()

  const isHost = payout.recipient === 'host'

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-col gap-1 text-caption">
          <Link
            href="/admin/payouts/payments"
            className="text-ink/60 hover:text-ink hover:underline"
          >
            All payments
          </Link>
          <Link
            href={`/admin/payouts/${payout.recipient}/${payout.personId}`}
            className="text-ink/60 hover:text-ink hover:underline"
          >
            {payout.name}&apos;s payouts
          </Link>
        </div>
        <PrintButton />
      </div>

      <article className="flex flex-col gap-8 rounded-sheet border border-line bg-control p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-lead font-display tracking-[-0.02em]">TRUTH</span>
            <h1 className="text-title font-semibold">Payment statement</h1>
          </div>
          <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-caption">
            <dt className="text-ink/60">Paid on</dt>
            <dd className="font-medium">{formatDay(payout.paidOn)}</dd>
            <dt className="text-ink/60">Reference</dt>
            <dd className="font-medium">{payout.reference ?? '—'}</dd>
            <dt className="text-ink/60">Statement</dt>
            <dd className="font-mono">{bookingCode(payout.id)}</dd>
          </dl>
        </header>

        <div className="flex flex-col gap-1">
          <span className="text-caption text-ink/60">Paid to</span>
          <span className="flex items-center gap-2 text-lead font-semibold">
            {payout.name} <RecipientChip recipient={payout.recipient} />
          </span>
          <span className="text-caption text-ink/60">
            {isHost
              ? 'Your share of the experience price for these bookings, after Truth’s commission.'
              : 'Your share of the experience price for bookings made through your page.'}
          </span>
        </div>

        <table className="w-full text-left text-caption">
          <thead className="border-b border-line text-ink/60">
            <tr>
              <th scope="col" className="py-2 pr-3 font-medium">
                Booking
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Experience
              </th>
              <th
                scope="col"
                className="hidden py-2 pr-3 text-right font-medium sm:table-cell print:table-cell"
              >
                Guests
              </th>
              <th
                scope="col"
                className="hidden py-2 pr-3 text-right font-medium sm:table-cell print:table-cell"
              >
                Price
              </th>
              <th
                scope="col"
                className="hidden py-2 pr-3 text-right font-medium sm:table-cell print:table-cell"
              >
                Share
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {payout.earnings.map((earning) => (
              <tr key={earning.id}>
                <td className="py-2.5 pr-3 align-top">
                  <span className="font-mono">{bookingCode(earning.bookingId)}</span>
                  <span className="block text-ink/60">
                    {earning.sessionDate ? formatDay(earning.sessionDate) : 'No date'}
                  </span>
                </td>
                <td className="py-2.5 pr-3 align-top">{earning.title}</td>
                <td className="hidden py-2.5 pr-3 text-right align-top tabular-nums sm:table-cell print:table-cell">
                  {earning.guests}
                </td>
                <td className="hidden py-2.5 pr-3 text-right align-top tabular-nums sm:table-cell print:table-cell">
                  {formatRand(earning.baseAmount)}
                </td>
                <td className="hidden py-2.5 pr-3 text-right align-top tabular-nums sm:table-cell print:table-cell">
                  {earning.rate}%
                </td>
                <td className="py-2.5 text-right align-top font-medium tabular-nums">
                  {formatRand(earning.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-ink/80">
            <tr>
              <th
                scope="row"
                colSpan={5}
                className="hidden py-3 pr-3 text-right font-semibold sm:table-cell print:table-cell"
              >
                Total paid
              </th>
              <th
                scope="row"
                colSpan={2}
                className="py-3 pr-3 text-left font-semibold sm:hidden print:hidden"
              >
                Total paid
              </th>
              <td className="py-3 text-right text-body font-semibold tabular-nums">
                {formatRand(payout.amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </article>

      {payout.note ? (
        <p className="text-caption text-ink/70 print:hidden">
          <span className="font-medium text-ink">Admin note (not printed):</span> {payout.note}
        </p>
      ) : null}
    </div>
  )
}
