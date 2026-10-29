import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className={cn('relative', className)}>
      <select
        className="h-12 w-full cursor-pointer appearance-none rounded-control border border-line bg-control pr-10 pl-4 text-body text-ink transition-colors duration-200 hover:border-ink/40 focus-visible:border-accent focus-visible:outline-none"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink/60"
      />
    </div>
  )
}
