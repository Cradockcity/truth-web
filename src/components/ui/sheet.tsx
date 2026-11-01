'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'

const noSubscription = () => () => {}

const PLACEMENT = {
  right: {
    dialog: 'open:items-end sm:open:items-stretch sm:open:justify-end',
    panel:
      'max-h-[88dvh] rounded-t-sheet shadow-float sm:h-full sm:max-h-none sm:w-[26rem] sm:rounded-none sm:border-l sm:border-line',
  },
  center: {
    dialog: 'open:items-end sm:open:items-center sm:open:justify-center',
    panel:
      'max-h-[88dvh] rounded-t-sheet shadow-float sm:max-h-[85dvh] sm:w-[34rem] sm:rounded-sheet',
  },
  full: { dialog: 'open:items-stretch', panel: 'h-full' },
} as const

// Native <dialog>: focus trapping, Escape to close and inert background come from the browser.
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  side?: keyof typeof PLACEMENT
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open, mounted])

  if (!mounted) return null

  // Rendered into <body> so the sheet takes the page's colours, not those of the control that opens
  // it (the home header forces the night scheme over the hero photo).
  return createPortal(
    <dialog
      ref={ref}
      aria-label={title}
      // React passes a nested sheet's close event up the tree; only react to this dialog's own.
      onClose={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={cn(
        'm-0 max-h-none max-w-none bg-transparent p-0 text-ink backdrop:bg-night/45 backdrop:backdrop-blur-[2px]',
        'open:flex',
        PLACEMENT[side].dialog,
        'h-dvh w-full',
      )}
    >
      <div className={cn('flex w-full flex-col bg-canvas', PLACEMENT[side].panel)}>
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-lead font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 cursor-pointer place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/8 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-line px-5 py-4">{footer}</div> : null}
      </div>
    </dialog>,
    document.body,
  )
}
