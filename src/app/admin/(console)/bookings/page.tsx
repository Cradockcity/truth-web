import { Download } from 'lucide-react'
import Link from 'next/link'

import { BookingTable } from '@/components/admin/booking-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { getBookingFilterOptions, getBookingTotals, listBookings } from '@/lib/admin/bookings'
import {
  BOOKING_STATUSES,
  BOOKING_WHENS,
  type BookingFilters,
  BOOKINGS_PER_PAGE,
  bookingFiltersToParams,
  parseBookingFilters,
} from '@/lib/booking-filters'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'
import { formatDay } from '@/lib/payouts'

export const metadata = { title: 'Bookings' }

const STATUS_LABELS: Record<BookingFilters['status'], string> = {
  all: 'All',
  paid: 'Paid',
  pending: 'Awaiting payment',
  cancelled: 'Cancelled',
}
const WHEN_LABELS: Record<BookingFilters['when'], string> = {
  upcoming: 'Upcoming',
  past: 'Past',
  all: 'Any date',
}

export default async function AdminBookingsPage({ searchParams }: PageProps<'/admin/bookings'>) {
  const filters = parseBookingFilters(await searchParams)
  const [{ bookings, count }, totals, options] = await Promise.all([
    listBookings(filters),
    getBookingTotals(filters),
    getBookingFilterOptions(),
  ])

  const href = (changes: Partial<BookingFilters>) => {
    const params = bookingFiltersToParams(filters, { page: 1, ...changes })
    return `/admin/bookings${params.size ? `?${params}` : ''}`
  }
  const range = filters.from || filters.to
  const first = (filters.page - 1) * BOOKINGS_PER_PAGE + 1
  const last = Math.min(filters.page * BOOKINGS_PER_PAGE, count)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline font-wide">Bookings</h1>
        <a
          href={`/admin/bookings/export?${bookingFiltersToParams(filters, { page: 1 })}`}
          className={buttonVariants({ variant: 'secondary' })}
        >
          <Download /> Download CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {BOOKING_STATUSES.map((value) => (
          <FilterLink key={value} href={href({ status: value })} active={filters.status === value}>
            {STATUS_LABELS[value]}
          </FilterLink>
        ))}
        <span aria-hidden className="mx-1 w-px self-stretch bg-line" />
        {BOOKING_WHENS.map((value) => (
          <FilterLink
            key={value}
            href={href({ when: value, from: null, to: null })}
            active={!range && filters.when === value}
          >
            {WHEN_LABELS[value]}
          </FilterLink>
        ))}
        {range ? (
          <FilterLink href={href({})} active>
            {filters.from ? formatDay(filters.from) : 'Any time'} –{' '}
            {filters.to ? formatDay(filters.to) : 'any time'}
          </FilterLink>
        ) : null}
      </div>

      <form
        role="search"
        className="grid gap-4 rounded-sheet border border-line bg-control p-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {filters.status !== 'all' ? (
          <input type="hidden" name="status" value={filters.status} />
        ) : null}
        {!range && filters.when !== 'upcoming' ? (
          <input type="hidden" name="when" value={filters.when} />
        ) : null}

        <FilterField label="Search" htmlFor="q" className="sm:col-span-2">
          <Input
            id="q"
            name="q"
            defaultValue={filters.q ?? ''}
            placeholder="Name, email, phone, booking code or Paystack ref"
            className="h-12"
          />
        </FilterField>
        <FilterField label="Experience" htmlFor="experience" className="sm:col-span-2">
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
        <FilterField label="Creator" htmlFor="creator">
          <Select id="creator" name="creator" defaultValue={filters.creatorId ?? ''}>
            <option value="">Any or none</option>
            {options.creators.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Month" htmlFor="month">
          <Input id="month" name="month" type="month" className="h-12" />
        </FilterField>
        <div className="grid grid-cols-2 gap-2">
          <FilterField label="From" htmlFor="from">
            <Input
              id="from"
              name="from"
              type="date"
              defaultValue={filters.from ?? ''}
              className="h-12 px-2"
            />
          </FilterField>
          <FilterField label="To" htmlFor="to">
            <Input
              id="to"
              name="to"
              type="date"
              defaultValue={filters.to ?? ''}
              className="h-12 px-2"
            />
          </FilterField>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
          <Button type="submit">Search</Button>
          <Link
            href="/admin/bookings"
            className="text-caption text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Clear filters
          </Link>
          <span className="text-caption text-ink/50">
            A month fills in From and To. Dates are experience dates.
          </span>
        </div>
      </form>

      <p
        className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-ink/70 tabular-nums"
        aria-live="polite"
      >
        <span className="font-semibold text-ink">
          {totals.bookings === 1 ? '1 booking' : `${totals.bookings} bookings`}
        </span>
        <span>{totals.paid} paid</span>
        <span>{totals.guests === 1 ? '1 guest' : `${totals.guests} guests`}</span>
        <span>{formatRand(totals.taken)} taken</span>
        {totals.refunded > 0 ? <span>{formatRand(totals.refunded)} refunded</span> : null}
      </p>

      <BookingTable bookings={bookings} />

      {count > BOOKINGS_PER_PAGE ? (
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

function FilterField({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('grid content-start gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-9 items-center rounded-full border px-3.5 text-caption font-medium transition-colors',
        active ? 'border-ink bg-ink text-canvas' : 'border-line bg-control hover:border-ink/40',
      )}
    >
      {children}
    </Link>
  )
}
