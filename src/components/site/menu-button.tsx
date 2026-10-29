'use client'

import { CalendarCheck, Compass, Heart, Home, LogIn, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { signOut } from '@/lib/actions/auth'
import { cn } from '@/lib/cn'
import { useSavedIds } from '@/lib/saved'
import { useUser } from '@/lib/use-user'

import { ThemeToggle } from './theme-toggle'

const LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experiences', label: 'Explore experiences', icon: Compass },
  { href: '/saved', label: 'Saved', icon: Heart },
] as const

const ROW =
  'flex w-full cursor-pointer items-center gap-3 rounded-control px-3 py-3 text-left text-body font-medium transition-colors hover:bg-ink/6'

export function MenuButton({ overlay, className }: { overlay: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const savedCount = useSavedIds().length
  const user = useUser()
  const close = () => setOpen(false)

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

      <Sheet open={open} onClose={close} title="Menu">
        <nav aria-label="Main" className="flex flex-col gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={close} className={ROW}>
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

        <div className="mt-6 flex flex-col gap-1 border-t border-line pt-6">
          {user === undefined ? (
            <div aria-busy className="h-12 animate-pulse rounded-control bg-surface" />
          ) : user ? (
            <>
              <p className="truncate px-3 pb-2 text-caption text-ink/60">
                Signed in as {user.email}
              </p>
              <Link href="/account/bookings" onClick={close} className={ROW}>
                <CalendarCheck className="size-5 text-ink/70" aria-hidden />
                My bookings
              </Link>
              <form action={signOut}>
                <button type="submit" className={ROW}>
                  <LogOut className="size-5 text-ink/70" aria-hidden />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/signin" onClick={close} className={ROW}>
              <LogIn className="size-5 text-ink/70" aria-hidden />
              Sign in
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
          <p className="text-caption font-medium text-ink/60">Appearance</p>
          <ThemeToggle className="self-start" />
        </div>
      </Sheet>
    </>
  )
}
