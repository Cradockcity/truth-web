import Link from 'next/link'

import { Label } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

// Pieces shared by the admin list and report screens (Bookings, Payouts, Payment history,
// Revenue), so they look and behave the same.

export function Stat({
  label,
  value,
  detail,
  strong,
}: {
  label: string
  value: string
  detail?: string
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-sheet border bg-control p-5',
        strong ? 'border-ink/40' : 'border-line',
      )}
    >
      <span className="text-caption text-ink/60">{label}</span>
      <span className="text-title font-wide tabular-nums sm:text-headline">{value}</span>
      {detail ? <span className="text-caption text-ink/55">{detail}</span> : null}
    </div>
  )
}

export function FilterLink({
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

export function FilterField({
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

// "Showing 51–100 of 124" with Previous / Next.
export function Pager({
  page,
  perPage,
  count,
  href,
}: {
  page: number
  perPage: number
  count: number
  href: (page: number) => string
}) {
  if (count <= perPage) return null
  const first = (page - 1) * perPage + 1
  const last = Math.min(page * perPage, count)
  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-4 text-caption">
      <span className="text-ink/60">
        Showing {first}–{last} of {count}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          >
            Previous
          </Link>
        ) : null}
        {last < count ? (
          <Link
            href={href(page + 1)}
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          >
            Next
          </Link>
        ) : null}
      </span>
    </nav>
  )
}
