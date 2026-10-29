import Link from 'next/link'

import { ThemeToggle } from './theme-toggle'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <Link href="/" className="text-lead font-display tracking-[-0.02em]">
            TRUTH
          </Link>
          <p className="text-caption text-ink/60">
            Unforgettable experiences, hosted by locals across South Africa.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  )
}
