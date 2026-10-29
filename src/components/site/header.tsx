import { Menu, Search } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

// `overlay` floats the header over a hero photo, so it always uses the dark scheme.
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={cn(
        'z-40',
        overlay
          ? 'absolute inset-x-0 top-0 scheme-dark light:inset-x-3 light:top-3'
          : 'sticky top-0 w-full border-b border-line bg-canvas/85 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lead font-display tracking-[-0.02em] text-ink">
          TRUTH
        </Link>

        <SearchPill overlay={overlay} className="mx-auto" />

        <Link
          href="/menu"
          aria-label="Open menu"
          className={cn(
            buttonVariants({ variant: overlay ? 'glass' : 'secondary', size: 'icon' }),
            'ml-auto sm:ml-0',
          )}
        >
          <Menu />
        </Link>
      </div>
    </header>
  )
}

function SearchPill({ overlay, className }: { overlay: boolean; className?: string }) {
  return (
    <Link
      href="/experiences"
      className={cn(
        'group flex h-12 min-w-0 items-center rounded-full pr-1.5 pl-5 text-caption text-ink transition-colors duration-200',
        overlay
          ? 'glass hover:bg-night/70'
          : 'border border-line bg-control shadow-float hover:border-ink/25',
        className,
      )}
    >
      <span className="font-semibold">Anywhere</span>
      <span className="hidden items-center sm:flex">
        <Divider />
        <span className="font-semibold">Any date</span>
        <Divider />
        <span className="text-ink/65">Add guests</span>
      </span>
      <span className="ml-3 grid size-9 place-items-center rounded-full bg-ink text-canvas transition-transform duration-200 ease-out-quint group-hover:scale-105">
        <Search className="size-4" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="sr-only">Search experiences</span>
    </Link>
  )
}

function Divider() {
  return <span aria-hidden className="mx-4 h-5 w-px bg-ink/20" />
}
