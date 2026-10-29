import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-control border border-line bg-control px-4 text-body text-ink transition-colors duration-200 placeholder:text-ink/45 hover:border-ink/40 focus-visible:border-accent focus-visible:outline-none aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-caption font-medium text-ink/70', className)} {...props} />
}
