'use client'

import { Star } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'

import { Sheet } from '@/components/ui/sheet'
import { formatRand } from '@/lib/format'

const PHONE = '(width < 64rem)'

// Below the lg breakpoint the booking card leaves the page: a floating summary opens it full screen.
export function MobileBooking({
  price,
  rating,
  reviewCount,
  children,
}: {
  price: number
  rating: number | null
  reviewCount: number | null
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  // Links back to `#book` (from the booking form or an expired hold) land on the open sheet.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#book' && window.matchMedia(PHONE).matches) setOpen(true)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  function close() {
    setOpen(false)
    if (window.location.hash === '#book') {
      history.replaceState(history.state, '', window.location.pathname + window.location.search)
    }
  }

  return (
    <>
      <div className="fixed inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 lg:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="flex h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-full bg-ink py-2 pr-2 pl-5 text-left text-canvas shadow-lift transition-transform duration-200 ease-out-quint active:scale-[0.98]"
        >
          <span className="flex min-w-0 flex-col">
            <span className="leading-tight">
              <span className="font-semibold">{formatRand(price)}</span>
              <span className="text-caption text-canvas/75"> per person</span>
            </span>
            <span className="flex items-center gap-1 text-caption text-canvas/75">
              {rating !== null && reviewCount ? (
                <>
                  <Star className="size-3 fill-current" aria-hidden />
                  {rating.toFixed(1)} · {reviewCount} reviews
                </>
              ) : (
                'New experience'
              )}
            </span>
          </span>
          <span className="grid h-12 shrink-0 place-items-center rounded-full bg-canvas px-5 font-semibold text-ink">
            Check dates
          </span>
        </button>
      </div>

      <Sheet open={open} onClose={close} title="Book this experience" side="full">
        {open ? (
          // Next keeps this page mounted (hidden) after Reserve navigates away; a dialog left open
          // there would keep the next page inert, so close it as any link inside is followed.
          <div
            className="contents"
            onClickCapture={(event) => {
              if (event.target instanceof Element && event.target.closest('a[href]')) setOpen(false)
            }}
          >
            {children}
          </div>
        ) : null}
      </Sheet>
    </>
  )
}
