'use client'

import { Compass, Heart, Home, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/cn'
import { useSavedIds } from '@/lib/saved'

import { ThemeToggle } from './theme-toggle'

const LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experiences', label: 'Explore experiences', icon: Compass },
  { href: '/saved', label: 'Saved', icon: Heart },
] as const

export function MenuButton({ overlay, className }: { overlay: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const savedCount = useSavedIds().length

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ variant: overlay ? 'glass' : 'secondary', size: 'icon' }),
          className,
        )}
      >
        <Menu />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Main" className="flex flex-col gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-control px-3 py-3 text-body font-medium transition-colors hover:bg-ink/6"
            >
              <Icon className="size-5 text-ink/70" aria-hidden />
              <span className="flex-1">{label}</span>
              {href === '/saved' && savedCount > 0 ? (
                <span className="rounded-full bg-raised px-2 py-0.5 text-caption">
                  {savedCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
          <p className="text-caption font-medium text-ink/60">Appearance</p>
          <ThemeToggle className="self-start" />
        </div>
      </Sheet>
    </>
  )
}
