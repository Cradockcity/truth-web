import { Search } from 'lucide-react'
import Link from 'next/link'

import { BookingTable } from '@/components/admin/booking-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BOOKING_FILTERS, type BookingFilter, listBookings } from '@/lib/admin/bookings'
import { cn } from '@/lib/cn'

export const metadata = { title: 'Bookings' }

const STATUS_LABELS: Record<BookingFilter, string> = {
  all: 'All',
  paid: 'Paid',
  pending: 'Awaiting payment',
  cancelled: 'Cancelled',
}
const WHEN = { upcoming: 'Upcoming', past: 'Past', all: 'Any date' } as const
type When = keyof typeof WHEN

export default async function AdminBookingsPage({ searchParams }: PageProps<'/admin/bookings'>) {
  const query = await searchParams
  const status = BOOKING_FILTERS.find((value) => value === query.status) ?? 'all'
  const when: When = query.when === 'past' || query.when === 'all' ? query.when : 'upcoming'
  const q = typeof query.q === 'string' && query.q.trim() ? query.q.trim().slice(0, 80) : null

  const bookings = await listBookings({ status, when, query: q })
  const href = (next: Partial<{ status: string; when: string }>) => {
    const params = new URLSearchParams({ status, when, ...(q ? { q } : {}), ...next })
    return `/admin/bookings?${params}`
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline font-wide">Bookings</h1>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {BOOKING_FILTERS.map((value) => (
            <FilterLink key={value} href={href({ status: value })} active={status === value}>
              {STATUS_LABELS[value]}
            </FilterLink>
          ))}
          <span aria-hidden className="mx-1 w-px self-stretch bg-line" />
          {(Object.keys(WHEN) as When[]).map((value) => (
            <FilterLink key={value} href={href({ when: value })} active={when === value}>
              {WHEN[value]}
            </FilterLink>
          ))}
        </div>

        <form className="flex gap-2" role="search">
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="when" value={when} />
          <Input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search name or email"
            aria-label="Search bookings by customer name or email"
            className="h-10 lg:w-64"
          />
          <Button type="submit" variant="secondary" size="icon-sm" aria-label="Search">
            <Search />
          </Button>
        </form>
      </div>

      <p className="text-caption text-ink/60" aria-live="polite">
        {bookings.length === 1 ? '1 booking' : `${bookings.length} bookings`}
        {bookings.length === 200 ? ' (showing the first 200)' : ''}
      </p>
      <BookingTable bookings={bookings} />
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
