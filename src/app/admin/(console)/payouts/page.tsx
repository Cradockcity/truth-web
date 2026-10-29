import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { RecipientChip } from '@/components/admin/recipient-chip'
import { Stat } from '@/components/admin/report-parts'
import { Section } from '@/components/admin/save-status'
import { getPayoutsOverview } from '@/lib/admin/payouts'
import { formatRand } from '@/lib/format'
import { formatDay, groupOwed, type Owed, sumAmounts } from '@/lib/payouts'

export const metadata = { title: 'Payouts' }

export default async function AdminPayoutsPage() {
  const { open } = await getPayoutsOverview()
  const people = groupOwed(open)
  const due = people.filter((person) => person.due.count > 0)
  const upcoming = people.filter((person) => person.upcoming.count > 0)

  return (
    <div className="flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-headline font-wide">Payouts</h1>
        <p className="max-w-2xl text-ink/70">
          What Truth owes hosts and creators for paid bookings. Each booking becomes due the day
          after the experience. Pay by bank transfer, then record it here. Past payments and their
          statements are under{' '}
          <Link href="/admin/payment-history" className="underline underline-offset-4">
            Payment history
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Due now"
          value={formatRand(sumAmounts(due.map((person) => ({ amount: person.due.total }))))}
          detail={due.length === 1 ? 'To 1 person' : `To ${due.length} people`}
        />
        <Stat
          label="Upcoming"
          value={formatRand(
            sumAmounts(upcoming.map((person) => ({ amount: person.upcoming.total }))),
          )}
          detail="For experiences not yet done"
        />
      </div>

      <Section title="Due now" description="Experiences that have happened. Ready to pay.">
        {due.length === 0 ? (
          <Empty>Nothing is due. You’re all paid up.</Empty>
        ) : (
          <PeopleList>
            {due.map((person) => (
              <PersonLine
                key={`${person.recipient}:${person.personId}`}
                person={person}
                detail={count(person.due.count)}
                amount={person.due.total}
                action="Record payment"
              />
            ))}
          </PeopleList>
        )}
      </Section>

      <Section title="Upcoming" description="Paid bookings for experiences still to come.">
        {upcoming.length === 0 ? (
          <Empty>No upcoming earnings.</Empty>
        ) : (
          <PeopleList>
            {upcoming.map((person) => (
              <PersonLine
                key={`${person.recipient}:${person.personId}`}
                person={person}
                detail={`${count(person.upcoming.count)}${person.upcoming.next ? ` · next due ${formatDay(person.upcoming.next)}` : ''}`}
                amount={person.upcoming.total}
                action="View"
              />
            ))}
          </PeopleList>
        )}
      </Section>
    </div>
  )
}

const count = (n: number) => (n === 1 ? '1 booking' : `${n} bookings`)

function PeopleList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="-mx-2 divide-y divide-line overflow-hidden rounded-control border border-line">
      {children}
    </ul>
  )
}

function PersonLine({
  person,
  detail,
  amount,
  action,
}: {
  person: Owed
  detail: string
  amount: number
  action: string
}) {
  return (
    <li>
      <Link
        href={`/admin/payouts/${person.recipient}/${person.personId}`}
        className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2 font-medium">
            <span className="truncate">{person.name}</span>
            <RecipientChip recipient={person.recipient} />
          </span>
          <span className="truncate text-caption text-ink/60">{detail}</span>
        </span>
        <span className="font-medium tabular-nums">{formatRand(amount)}</span>
        <span className="hidden items-center gap-1 text-caption font-semibold sm:flex">
          {action} <ChevronRight className="size-4" aria-hidden />
        </span>
      </Link>
    </li>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-caption text-ink/60">{children}</p>
}
