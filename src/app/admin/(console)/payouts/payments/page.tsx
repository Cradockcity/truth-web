import { ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'

import { RecipientChip } from '@/components/admin/recipient-chip'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { listPayoutHistory, listPeopleOptions } from '@/lib/admin/payouts'
import { formatRand } from '@/lib/format'
import {
  formatDay,
  type PayoutFilters,
  PAYOUTS_PER_PAGE,
  parsePayoutFilters,
  payoutFiltersToParams,
} from '@/lib/payouts'

export const metadata = { title: 'Payment history' }

export default async function PaymentHistoryPage({
  searchParams,
}: PageProps<'/admin/payouts/payments'>) {
  const filters = parsePayoutFilters(await searchParams)
  const [{ payouts, count, total }, people] = await Promise.all([
    listPayoutHistory(filters),
    listPeopleOptions(),
  ])

  const href = (changes: Partial<PayoutFilters>) => {
    const params = payoutFiltersToParams(filters, changes)
    return `/admin/payouts/payments${params.size ? `?${params}` : ''}`
  }
  const person =
    filters.recipient && filters.personId ? `${filters.recipient}:${filters.personId}` : ''
  const first = (filters.page - 1) * PAYOUTS_PER_PAGE + 1
  const last = Math.min(filters.page * PAYOUTS_PER_PAGE, count)

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/payouts"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          Payouts
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-headline font-wide">Payment history</h1>
          <a
            href={`/admin/payouts/payments/export?${payoutFiltersToParams(filters, { page: 1 })}`}
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Download /> Download CSV
          </a>
        </div>
        <p className="text-caption text-ink/60">
          The CSV has one line per booking paid, so you can see what each payment covered.
        </p>
      </div>

      <form className="grid gap-4 rounded-sheet border border-line bg-control p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid content-start gap-2 sm:col-span-2">
          <Label htmlFor="person">Paid to</Label>
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
        </div>
        <div className="grid content-start gap-2">
          <Label htmlFor="month">Month</Label>
          <Input id="month" name="month" type="month" className="h-12" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid content-start gap-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              name="from"
              type="date"
              defaultValue={filters.from ?? ''}
              className="h-12 px-2"
            />
          </div>
          <div className="grid content-start gap-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              name="to"
              type="date"
              defaultValue={filters.to ?? ''}
              className="h-12 px-2"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
          <Button type="submit">Show</Button>
          <Link
            href="/admin/payouts/payments"
            className="text-caption text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Clear filters
          </Link>
          <span className="text-caption text-ink/50">
            A month fills in From and To. Dates are payment dates.
          </span>
        </div>
      </form>

      <p className="text-caption text-ink/70 tabular-nums" aria-live="polite">
        <span className="font-semibold text-ink">
          {count === 1 ? '1 payment' : `${count} payments`}
        </span>{' '}
        · {formatRand(total)} paid
        {filters.from || filters.to
          ? ` · ${filters.from ? formatDay(filters.from) : 'start'} to ${filters.to ? formatDay(filters.to) : 'today'}`
          : ''}
      </p>

      {payouts.length === 0 ? (
        <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
          No payments match.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-sheet border border-line bg-control">
          {payouts.map((payout) => (
            <li key={payout.id}>
              <Link
                href={`/admin/payouts/payments/${payout.id}`}
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
                  Statement <ChevronRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {count > PAYOUTS_PER_PAGE ? (
        <nav aria-label="Pages" className="flex items-center justify-between gap-4 text-caption">
          <span className="text-ink/60">
            Showing {first}–{last} of {count}
          </span>
          <span className="flex gap-2">
            {filters.page > 1 ? (
              <Link
                href={href({ page: filters.page - 1 })}
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Previous
              </Link>
            ) : null}
            {last < count ? (
              <Link
                href={href({ page: filters.page + 1 })}
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Next
              </Link>
            ) : null}
          </span>
        </nav>
      ) : null}
    </div>
  )
}
