import { ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'

import { BarChart } from '@/components/admin/bar-chart'
import { RecipientChip } from '@/components/admin/recipient-chip'
import { FilterField, FilterLink, Pager, Stat } from '@/components/admin/report-parts'
import { Section } from '@/components/admin/save-status'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { getPaymentHistoryReport, listPayoutHistory, listPeopleOptions } from '@/lib/admin/payouts'
import { formatRand } from '@/lib/format'
import {
  formatDay,
  groupPayoutsByMonth,
  groupPayoutsByPerson,
  monthsOf,
  type PayoutFilters,
  PAYOUTS_PER_PAGE,
  parsePayoutFilters,
  payoutFiltersToParams,
  sumAmounts,
} from '@/lib/payouts'
import { todayInSouthAfrica } from '@/lib/sessions'

export const metadata = { title: 'Payment history' }

const bookingCount = (n: number) => (n === 1 ? '1 booking' : `${n} bookings`)

const SERIES = [
  { key: 'hosts', label: 'Hosts', className: 'bg-series-1' },
  { key: 'creators', label: 'Creators', className: 'bg-series-2' },
]

// Money paid to hosts and creators: totals by month and person, and every payment with
// its statement.
export default async function PaymentHistoryPage({
  searchParams,
}: PageProps<'/admin/payment-history'>) {
  const filters = parsePayoutFilters(await searchParams, Number(todayInSouthAfrica().slice(0, 4)))
  const [report, list, people] = await Promise.all([
    getPaymentHistoryReport(filters),
    listPayoutHistory(filters),
    listPeopleOptions(),
  ])

  const months = groupPayoutsByMonth(report.payouts, filters.year)
  const byPerson = groupPayoutsByPerson(report.payouts)
  const hosts = sumAmounts(report.payouts.filter((payout) => payout.recipient === 'host'))
  const creators = sumAmounts(report.payouts.filter((payout) => payout.recipient === 'creator'))
  const href = (changes: Partial<PayoutFilters>) =>
    `/admin/payment-history?${payoutFiltersToParams(filters, { page: 1, ...changes })}`
  const person =
    filters.recipient && filters.personId ? `${filters.recipient}:${filters.personId}` : ''
  const monthLabel = filters.month
    ? monthsOf(filters.year).find((month) => month.key === filters.month)?.long
    : null
  const exportHref = `/admin/payment-history/export?${payoutFiltersToParams(filters, { page: 1 })}`

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-headline font-wide">Payment history</h1>
          <p className="text-ink/70">
            Everything paid to hosts and creators. Open a payment for its statement.
          </p>
        </div>
        <a href={exportHref} className={buttonVariants({ variant: 'secondary' })}>
          <Download /> Download CSV
        </a>
      </div>

      <form className="flex flex-wrap items-end gap-4 rounded-sheet border border-line bg-control p-5">
        <FilterField label="Year" htmlFor="year" className="w-32">
          <Select id="year" name="year" defaultValue={String(filters.year)}>
            {report.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Paid to" htmlFor="person" className="min-w-56 flex-1">
          <Select id="person" name="person" defaultValue={person}>
            <option value="">Everyone</option>
            <optgroup label="Hosts">
              {people.hosts.map((host) => (
                <option key={host.id} value={`host:${host.id}`}>
                  {host.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Creators">
              {people.creators.map((creator) => (
                <option key={creator.id} value={`creator:${creator.id}`}>
                  {creator.name}
                </option>
              ))}
            </optgroup>
          </Select>
        </FilterField>
        <Button type="submit">Show</Button>
        <Link
          href="/admin/payment-history"
          className="pb-3 text-caption text-ink/60 underline-offset-4 hover:text-ink hover:underline"
        >
          Clear
        </Link>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={`Paid in ${filters.year}`}
          value={formatRand(sumAmounts(report.payouts))}
          strong
        />
        <Stat label="To hosts" value={formatRand(hosts)} />
        <Stat label="To creators" value={formatRand(creators)} />
        <Stat
          label="Payments"
          value={String(report.payouts.length)}
          detail={bookingCount(report.payouts.reduce((n, payout) => n + payout.bookingCount, 0))}
        />
      </div>

      <Section title="By month">
        <BarChart
          title={`Paid out per month, ${filters.year}`}
          series={SERIES}
          columns={months.map((month) => ({
            key: month.key,
            label: month.short,
            longLabel: month.long,
            values: { hosts: month.hosts, creators: month.creators },
          }))}
          format={formatRand}
        />
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-md text-left text-caption">
            <thead className="border-b border-line text-ink/60">
              <tr>
                <th scope="col" className="px-2 py-2 font-medium">
                  Month
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Payments
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Hosts
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Creators
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {months.map((month) => (
                <tr key={month.key} className={month.payments === 0 ? 'text-ink/45' : undefined}>
                  <th scope="row" className="px-2 py-2 font-medium">
                    {month.payments > 0 ? (
                      <Link
                        href={`${href({ month: month.key })}#payments`}
                        className="underline-offset-4 hover:underline"
                      >
                        {month.long}
                      </Link>
                    ) : (
                      month.long
                    )}
                  </th>
                  <td className="px-2 py-2 text-right tabular-nums">{month.payments}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{formatRand(month.hosts)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {formatRand(month.creators)}
                  </td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums">
                    {formatRand(month.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="By person" description={`Who was paid in ${filters.year}, most first.`}>
        {byPerson.length === 0 ? (
          <p className="text-caption text-ink/60">No payments in {filters.year}.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-md text-left text-caption">
              <thead className="border-b border-line text-ink/60">
                <tr>
                  <th scope="col" className="px-2 py-2 font-medium">
                    Paid to
                  </th>
                  <th scope="col" className="px-2 py-2 text-right font-medium">
                    Payments
                  </th>
                  <th scope="col" className="px-2 py-2 text-right font-medium">
                    Bookings
                  </th>
                  <th scope="col" className="px-2 py-2 font-medium">
                    Last paid
                  </th>
                  <th scope="col" className="px-2 py-2 text-right font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {byPerson.map((row) => (
                  <tr key={`${row.recipient}:${row.personId}`}>
                    <th scope="row" className="px-2 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <Link
                          href={`/admin/payouts/${row.recipient}/${row.personId}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {row.name}
                        </Link>
                        <RecipientChip recipient={row.recipient} />
                      </span>
                    </th>
                    <td className="px-2 py-2 text-right tabular-nums">{row.payments}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{row.bookings}</td>
                    <td className="px-2 py-2">{formatDay(row.lastPaid)}</td>
                    <td className="px-2 py-2 text-right font-semibold tabular-nums">
                      {formatRand(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <section id="payments" className="flex scroll-mt-6 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title font-semibold">Payments</h2>
          <div className="flex flex-wrap gap-2">
            <FilterLink href={`${href({ month: null })}#payments`} active={!filters.month}>
              All of {filters.year}
            </FilterLink>
            {monthLabel ? (
              <FilterLink href={`${href({})}#payments`} active>
                {monthLabel}
              </FilterLink>
            ) : null}
          </div>
        </div>
        <p className="text-caption text-ink/70 tabular-nums">
          {list.count === 1 ? '1 payment' : `${list.count} payments`} · {formatRand(list.total)}
        </p>

        {list.payouts.length === 0 ? (
          <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
            No payments match.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-sheet border border-line bg-control">
            {list.payouts.map((payout) => (
              <li key={payout.id}>
                <Link
                  href={`/admin/payment-history/${payout.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface"
                >
                  <span className="w-28 shrink-0 text-caption text-ink/60">
                    {formatDay(payout.paidOn)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="truncate">{payout.name}</span>
                      <RecipientChip recipient={payout.recipient} />
                    </span>
                    <span className="truncate text-caption text-ink/60">
                      {payout.bookingCount === 1 ? '1 booking' : `${payout.bookingCount} bookings`}
                      {payout.reference ? ` · ref ${payout.reference}` : ''}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">{formatRand(payout.amount)}</span>
                  <span className="hidden items-center gap-1 text-caption font-semibold sm:flex">
                    View statement <ChevronRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Pager
          page={filters.page}
          perPage={PAYOUTS_PER_PAGE}
          count={list.count}
          href={(page) => `${href({ page })}#payments`}
        />
      </section>
    </div>
  )
}
