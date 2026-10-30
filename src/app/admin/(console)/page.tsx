import Link from 'next/link'

import { BookingTable } from '@/components/admin/booking-table'
import { getDashboard } from '@/lib/admin/bookings'
import { formatRand } from '@/lib/format'

export const instant = false

export default async function AdminDashboard() {
  const data = await getDashboard()

  const stats = [
    {
      label: 'Upcoming bookings',
      value: String(data.upcomingBookings),
      detail: `${data.upcomingGuests} guests`,
      href: '/admin/bookings?when=upcoming&status=paid',
    },
    {
      label: 'Paid this month',
      value: formatRand(data.revenueThisMonth),
      detail: 'Before Paystack fees',
      href: '/admin/bookings?status=paid',
    },
    {
      label: 'Seats on hold',
      value: String(data.activeHolds),
      detail: 'Awaiting payment now',
      href: '/admin/bookings?status=pending',
    },
    {
      label: 'Live experiences',
      value: String(data.activeExperiences),
      detail: 'Visible on the site',
      href: '/admin/experiences',
    },
  ]

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-headline font-wide">Dashboard</h1>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col gap-1 rounded-sheet border border-line bg-control p-5 shadow-float transition-colors hover:border-ink/30"
          >
            <dt className="text-caption text-ink/60">{stat.label}</dt>
            <dd className="text-title font-semibold tabular-nums">{stat.value}</dd>
            <dd className="text-caption text-ink/50">{stat.detail}</dd>
          </Link>
        ))}
      </dl>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-title font-semibold">Latest bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-caption font-semibold underline underline-offset-4"
          >
            All bookings
          </Link>
        </div>
        <BookingTable bookings={data.recent} />
      </section>
    </div>
  )
}
