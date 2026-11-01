'use client'

import { createContext, type ReactNode, useContext, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'

const FloatingContext = createContext(false)

// True while the header floats over a hero photo, so its controls use glass in the night scheme.
export function useHeaderFloating() {
  return useContext(FloatingContext)
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

const noSubscription = () => () => {}

// The hero fills the first screen; once it has scrolled up behind the header, the header turns solid.
const scrolledPastHero = () => window.scrollY > window.innerHeight - 96

export function HeaderShell({ overlay, children }: { overlay: boolean; children: ReactNode }) {
  const pastHero = useSyncExternalStore(
    overlay ? subscribeToScroll : noSubscription,
    scrolledPastHero,
    () => false,
  )
  const floating = overlay && !pastHero

  return (
    <FloatingContext value={floating}>
      <header
        className={cn(
          'z-40',
          overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0 w-full',
          floating
            ? 'scheme-dark light:inset-x-3 light:top-3'
            : 'border-b border-line bg-canvas/85 backdrop-blur-xl',
          overlay && !floating && 'animate-header-in',
        )}
      >
        {children}
      </header>
    </FloatingContext>
  )
}
