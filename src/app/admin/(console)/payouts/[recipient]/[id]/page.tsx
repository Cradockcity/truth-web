import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RecipientChip } from '@/components/admin/recipient-chip'
import { RecordPayoutForm } from '@/components/admin/record-payout-form'
import { Section } from '@/components/admin/save-status'
import { StatusChip } from '@/components/admin/status-chip'
import { UndoPayoutButton } from '@/components/admin/undo-payout-button'
import { type Earning, getPersonPayouts } from '@/lib/admin/payouts'
import { isUuid } from '@/lib/data/experiences'
import { formatRand } from '@/lib/format'
import { formatDay, RECIPIENTS, sumAmounts } from '@/lib/payouts'
import { todayInSouthAfrica } from '@/lib/sessions'

export const metadata = { title: 'Payouts' }

export default async function PersonPayoutsPage({
  params,
  searchParams,
}: PageProps<'/admin/payouts/[recipient]/[id]'>) {
  const [{ recipient: kind, id }, query] = await Promise.all([params, searchParams])
  const recipient = RECIPIENTS.find((value) => value === kind)
  const person = recipient && isUuid(id) ? await getPersonPayouts(recipient, id) : null
  if (!recipient || !person) notFound()

  const today = todayInSouthAfrica()
  const due = person.earnings.filter((earning) => earning.status === 'due')
  const upcoming = person.earnings.filter((earning) => earning.status === 'upcoming')
  const cancelled = person.earnings.filter((earning) => earning.status === 'cancelled')
  const recorded = person.payouts.find((payout) => payout.id === query.recorded)

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/payouts"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All payouts
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-headline font-wide text-balance">{person.name}</h1>
          <RecipientChip recipient={recipient} />
        </div>
        <Link
          href={`/admin/${recipient === 'host' ? 'hosts' : 'creators'}/${id}`}
          className="self-start text-caption text-ink/60 underline-offset-4 hover:text-ink hover:underline"
        >
          {recipient === 'host' ? 'Edit host' : 'Edit creator'}
        </Link>
        {recorded ? (
          <p role="status" className="text-caption text-success">
            Recorded {formatRand(recorded.amount)} paid on {formatDay(recorded.paidOn)}.
          </p>
        ) : query.undone ? (
          <p role="status" className="text-caption text-success">
            Payment undone. Its bookings are back under Due now, or Cancelled if the booking was
            cancelled.
          </p>
        ) : null}
      </div>

      <Section
        title={due.length > 0 ? `Due now: ${formatRand(sumAmounts(due))}` : 'Due now'}
        description="Untick any booking you aren’t paying yet. Recording a payment doesn’t send money: pay by bank transfer first."
      >
        {due.length === 0 ? (
          <p className="text-caption text-ink/60">Nothing is due.</p>
        ) : (
          <RecordPayoutForm
            key={due.map((earning) => earning.id).join()}
            recipient={recipient}
            personId={id}
            name={person.name}
            due={due}
            today={today}
          />
        )}
      </Section>

      {upcoming.length > 0 ? (
        <Section
          title={`Upcoming: ${formatRand(sumAmounts(upcoming))}`}
          description="Paid bookings for experiences still to come. Each becomes due the day after."
        >
          <EarningList earnings={upcoming} />
        </Section>
      ) : null}

      <Section title="Payments" description="Money recorded as paid to them, newest first.">
        {person.payouts.length === 0 ? (
          <p className="text-caption text-ink/60">No payments recorded yet.</p>
        ) : (
          <ul className="-mx-2 divide-y divide-line rounded-control border border-line">
            {person.payouts.map((payout) => (
              <li key={payout.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">
                    {formatRand(payout.amount)} on {formatDay(payout.paidOn)}
                  </span>
                  <span className="text-caption text-ink/60">
                    {payout.bookingCount === 1 ? '1 booking' : `${payout.bookingCount} bookings`}
                    {payout.reference ? ` · ref ${payout.reference}` : ''}
                    {payout.note ? ` · ${payout.note}` : ''}
                  </span>
                </span>
                <UndoPayoutButton id={payout.id} recipient={recipient} recipientId={id} />
              </li>
            ))}
          </ul>
        )}
        {person.earnings.some((earning) => earning.status === 'paid') ? (
          <details className="text-caption">
            <summary className="cursor-pointer text-ink/70">Bookings already paid</summary>
            <div className="mt-3">
              <EarningList
                earnings={person.earnings.filter((earning) => earning.status === 'paid')}
              />
            </div>
          </details>
        ) : null}
      </Section>

      {cancelled.length > 0 ? (
        <Section title="Cancelled" description="Bookings cancelled before they were paid out.">
          <EarningList earnings={cancelled} />
        </Section>
      ) : null}
    </div>
  )
}

function EarningList({ earnings }: { earnings: Earning[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line rounded-control border border-line">
      {earnings.map((earning) => (
        <li key={earning.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
          <span className="flex min-w-0 flex-1 flex-col">
            <Link
              href={`/admin/bookings/${earning.bookingId}`}
              className="font-medium underline-offset-4 hover:underline"
            >
              {earning.title}
            </Link>
            <span className="text-caption text-ink/60">
              {earning.sessionDate ? formatDay(earning.sessionDate) : 'No date'} · {earning.rate}%
              of {formatRand(earning.baseAmount)}
              {earning.status === 'upcoming' ? ` · due ${formatDay(earning.dueOn)}` : ''}
            </span>
          </span>
          <StatusChip status={earning.status} />
          <span className="w-24 text-right font-medium tabular-nums">
            {formatRand(earning.amount)}
          </span>
        </li>
      ))}
    </ul>
  )
}
