'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useLayoutEffect, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'
import { applyTheme, isTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'Auto', icon: Monitor },
] as const satisfies readonly { value: Theme; label: string; icon: unknown }[]

const CHANGE_EVENT = 'truth-theme-change'

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function setTheme(theme: Theme) {
  try {
    if (theme === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be blocked; the choice still applies for this page view.
  }
  applyTheme(theme)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'system' as const)

  // Strict Mode's dev remount strips the attribute the head script set; re-apply before paint.
  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn('inline-flex rounded-full border border-line bg-surface p-1', className)}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            title={value === 'system' ? 'Match my device setting' : undefined}
            onClick={() => setTheme(value)}
            className={cn(
              'flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-caption font-medium transition-colors duration-200',
              selected ? 'bg-ink text-canvas' : 'text-ink/65 hover:text-ink',
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
