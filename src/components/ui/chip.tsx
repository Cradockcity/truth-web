import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium [&_svg]:size-3.5',
  {
    variants: {
      tone: {
        glass: 'glass',
        neutral: 'bg-raised text-ink/80',
        accent: 'bg-accent-soft text-accent',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type ChipProps = ComponentProps<'span'> & VariantProps<typeof chipVariants>

export function Chip({ className, tone, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ tone }), className)} {...props} />
}
