'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

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
  side?: 'right' | 'center'
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={cn(
        'm-0 max-h-none max-w-none bg-transparent p-0 text-ink backdrop:bg-night/45 backdrop:backdrop-blur-[2px]',
        'open:flex open:items-end sm:open:items-stretch',
        side === 'right' ? 'sm:open:justify-end' : 'sm:open:items-center sm:open:justify-center',
        'h-dvh w-full',
      )}
    >
      <div
        className={cn(
          'flex max-h-[88dvh] w-full flex-col rounded-t-sheet bg-canvas shadow-float sm:max-h-none',
          side === 'right'
            ? 'sm:h-full sm:w-[26rem] sm:rounded-none sm:border-l sm:border-line'
            : 'sm:max-h-[85dvh] sm:w-[34rem] sm:rounded-sheet',
        )}
      >
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
    </dialog>
  )
}
