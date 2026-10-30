import {
  CalendarCheck,
  Compass,
  History,
  LayoutDashboard,
  LogOut,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { ThemeToggle } from '@/components/site/theme-toggle'
import { adminSignOut } from '@/lib/actions/admin-auth'
import { requireAdmin } from '@/lib/admin/guard'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Truth admin' },
  robots: { index: false },
}

// The console is signed-in only (MFA + aal2), so it's always rendered at
// request time. Opt out of instant-navigation validation so each page can
// read the session through requireAdmin() without needing its own Suspense.
export const instant = false

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { href: '/admin/payment-history', label: 'Payment history', icon: History },
  { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
  { href: '/admin/experiences', label: 'Experiences', icon: Compass },
  { href: '/admin/hosts', label: 'Hosts', icon: Users },
  { href: '/admin/creators', label: 'Creators', icon: Sparkles },
] as const

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0 print:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-5 lg:py-6">
          <Link href="/admin" className="text-lead font-display tracking-[-0.02em]">
            TRUTH
            <span className="ml-2 align-middle text-caption font-medium tracking-normal text-ink/50">
              Admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-caption text-ink/60 hover:text-ink hover:underline lg:hidden"
          >
            View site
          </Link>
        </div>
        <nav
          aria-label="Admin"
          className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3"
        >
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-3 rounded-control px-3 py-2 text-caption font-medium text-ink/80 transition-colors hover:bg-ink/6 hover:text-ink lg:text-body"
            >
              <Icon className="size-4 text-ink/60" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-4 border-t border-line p-4 lg:flex">
          <ThemeToggle className="self-start" />
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="text-caption text-ink/60 hover:text-ink hover:underline">
              View site
            </Link>
            <form action={adminSignOut}>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-1.5 text-caption text-ink/60 hover:text-ink"
              >
                <LogOut className="size-3.5" aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10 print:p-0">
        <Suspense
          fallback={<div aria-busy className="h-64 animate-pulse rounded-sheet bg-surface" />}
        >
          <Guarded>{children}</Guarded>
        </Suspense>
      </main>
    </div>
  )
}

// Nothing in the console renders until the server has confirmed an MFA-verified admin.
async function Guarded({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return children
}
