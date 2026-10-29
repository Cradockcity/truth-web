import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-out-quint select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-canvas hover:bg-ink/85',
        secondary: 'border border-line bg-control text-ink shadow-float hover:border-ink/30',
        glass: 'glass hover:bg-night/70',
        ghost: 'text-ink/80 hover:bg-ink/8 hover:text-ink',
      },
      size: {
        sm: 'h-9 px-4 text-caption',
        md: 'h-11 px-5 text-body',
        lg: 'h-14 px-7 text-lead',
        icon: 'size-11',
        'icon-sm': 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
