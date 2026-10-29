import { Download } from 'lucide-react'
import Link from 'next/link'

import { BarChart } from '@/components/admin/bar-chart'
import { FilterField, Pager, Stat } from '@/components/admin/report-parts'
import { Section } from '@/components/admin/save-status'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { getBookingFilterOptions } from '@/lib/admin/bookings'
import { getRevenueYear } from '@/lib/admin/revenue'
import { bookingCode } from '@/lib/booking-filters'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { formatDay, monthsOf } from '@/lib/payouts'
import {
  groupRevenueByMonth,
  parseRevenueFilters,
  REVENUE_PER_PAGE,
  type RevenueFilters,
  revenueFiltersToParams,
  totalRevenue,
} from '@/lib/revenue'
import { todayInSouthAfrica } from '@/lib/sessions'

export const metadata = { title: 'Revenue' }

const percent = new Intl.NumberFormat('en-ZA', { style: 'percent', maximumFractionDigits: 1 })

// What Truth made: guest payments less refunds, host and creator shares and Paystack's fees.
export default async function RevenuePage({ searchParams }: PageProps<'/admin/revenue'>) {
  // Read the request first: the current date may only be used after it (Cache Components).
  const params = await searchParams
  const thisYear = Number(todayInSouthAfrica().slice(0, 4))
  const filters = parseRevenueFilters(params, thisYear)
  const [rows, options] = await Promise.all([getRevenueYear(filters), getBookingFilterOptions()])

  const months = groupRevenueByMonth(rows, filters.year)
  const shown = filters.month ? rows.filter((row) => row.date?.startsWith(filters.month!)) : rows
  const totals = totalRevenue(shown)
  const start = (filters.page - 1) * REVENUE_PER_PAGE
  const page = shown.slice(start, start + REVENUE_PER_PAGE)
  const period = filters.month
    ? (monthsOf(filters.year).find((month) => month.key === filters.month)?.long ?? '')
    : String(filters.year)
  const href = (changes: Partial<RevenueFilters>) =>
    `/admin/revenue?${revenueFiltersToParams(filters, { page: 1, ...changes })}`
  const years = Array.from(
    { length: Math.max(thisYear, filters.year) - 2025 + 1 },
    (_, i) => Math.max(thisYear, filters.year) - i,
  )

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-headline font-wide">Revenue</h1>
          <p className="max-w-2xl text-ink/70">
            What Truth made on each paid booking: what the guest paid, less refunds, the host’s and
            creator’s shares and Paystack’s fee. Grouped by experience date.
          </p>
        </div>
        <a
          href={`/admin/revenue/export?${revenueFiltersToParams(filters, { page: 1 })}`}
          className={buttonVariants({ variant: 'secondary' })}
        >
          <Download /> Download CSV
        </a>
      </div>

      <form className="grid gap-4 rounded-sheet border border-line bg-control p-5 sm:grid-cols-2 lg:grid-cols-[8rem_10rem_1fr_1fr_auto]">
        <FilterField label="Year" htmlFor="year">
          <Select id="year" name="year" defaultValue={String(filters.year)}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Month" htmlFor="month">
          <Select id="month" name="month" defaultValue={filters.month ?? ''}>
            <option value="">Whole year</option>
            {monthsOf(filters.year).map((month) => (
              <option key={month.key} value={month.key}>
                {month.long}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Experience" htmlFor="experience">
          <Select id="experience" name="experience" defaultValue={filters.experienceId ?? ''}>
            <option value="">All experiences</option>
            {options.experiences.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Host" htmlFor="host">
          <Select id="host" name="host" defaultValue={filters.hostId ?? ''}>
            <option value="">All hosts</option>
            {options.hosts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </FilterField>
        <div className="flex items-end gap-3">
          <Button type="submit">Show</Button>
          <Link
            href="/admin/revenue"
            className="pb-3 text-caption text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Clear
          </Link>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label={`Truth made, ${period}`}
          value={formatRand(totals.made)}
          detail={
            totals.guestPaid > 0
              ? `${percent.format(totals.made / totals.guestPaid)} of what guests paid`
              : 'No paid bookings'
          }
          strong
        />
        <Stat
          label="Guests paid"
          value={formatRand(totals.guestPaid)}
          detail={
            totals.refunded > 0
              ? `${formatRand(totals.refunded)} refunded`
              : `${totals.bookings === 1 ? '1 booking' : `${totals.bookings} bookings`}`
          }
        />
        <Stat label="Hosts’ share" value={formatRand(totals.host)} />
        <Stat label="Creators’ share" value={formatRand(totals.creator)} />
        <Stat
          label="Paystack fees"
          value={formatRand(totals.fee)}
          detail={
            totals.missingFees > 0
              ? `${totals.missingFees} without a recorded fee`
              : 'As charged by Paystack'
          }
        />
      </div>

      <Section title="By month" description={`Experience dates in ${filters.year}.`}>
        <BarChart
          title={`Truth made per month, ${filters.year}`}
          series={[{ key: 'made', label: 'Truth made', className: 'bg-series-1' }]}
          columns={months.map((month) => ({
            key: month.key,
            label: month.short,
            longLabel: month.long,
            values: { made: month.made },
          }))}
          format={formatRand}
        />
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-2xl text-left text-caption">
            <thead className="border-b border-line text-ink/60">
              <tr>
                <th scope="col" className="px-2 py-2 font-medium">
                  Month
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Bookings
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Guests paid
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Refunds
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Hosts
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Creators
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Paystack
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Truth made
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {months.map((month) => (
                <tr key={month.key} className={month.bookings === 0 ? 'text-ink/45' : undefined}>
                  <th scope="row" className="px-2 py-2 font-medium">
                    {month.bookings > 0 ? (
                      <Link
                        href={`${href({ month: month.key })}#bookings`}
                        className="underline-offset-4 hover:underline"
                      >
                        {month.long}
                      </Link>
                    ) : (
                      month.long
                    )}
                  </th>
                  <td className="px-2 py-2 text-right tabular-nums">{month.bookings}</td>
                  <Money value={month.guestPaid} />
                  <Money value={month.refunded} />
                  <Money value={month.host} />
                  <Money value={month.creator} />
                  <Money value={month.fee} />
                  <Money value={month.made} strong />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <section id="bookings" className="flex scroll-mt-6 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-title font-semibold">Bookings, {period}</h2>
          <p className="text-caption text-ink/60">
            Paid bookings, including ones cancelled later. Open one for its details.
          </p>
        </div>
        {page.length === 0 ? (
          <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
            No paid bookings in {period}.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-sheet border border-line bg-control">
            <table className="w-full min-w-3xl text-left text-caption">
              <thead className="border-b border-line bg-surface text-ink/60">
                <tr>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Booking
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Experience
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Guest paid
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Refund
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Host
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Creator
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Paystack
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Truth made
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {page.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2.5 align-top">
                      <Link
                        href={`/admin/bookings/${row.id}`}
                        className="font-mono underline-offset-4 hover:underline"
                      >
                        {bookingCode(row.id)}
                      </Link>
                      <span className="block text-ink/55">
                        {row.date ? formatDay(row.date) : 'No date'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {row.title}
                      <span className="block text-ink/55">
                        {[
                          row.hostName,
                          row.guests === 1 ? '1 guest' : `${row.guests} guests`,
                          row.status === 'cancelled' ? 'Cancelled' : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </td>
                    <Money value={row.guestPaid} />
                    <Money value={row.refunded} />
                    <Money value={row.host} />
                    <Money value={row.creator} />
                    <td className="px-3 py-2.5 text-right align-top tabular-nums">
                      {row.feeKnown ? (
                        formatRand(row.fee)
                      ) : (
                        <span className="text-ink/50">Not recorded</span>
                      )}
                    </td>
                    <Money value={row.made} strong />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager
          page={filters.page}
          perPage={REVENUE_PER_PAGE}
          count={shown.length}
          href={(next) => `${href({ page: next })}#bookings`}
        />
      </section>
    </div>
  )
}

function Money({ value, strong }: { value: number; strong?: boolean }) {
  return (
    <td
      className={cn(
        'px-2 py-2 text-right align-top tabular-nums',
        strong && 'font-semibold',
        value < 0 && 'text-danger',
        value === 0 && 'text-ink/45',
      )}
    >
      {formatRand(value)}
    </td>
  )
}
