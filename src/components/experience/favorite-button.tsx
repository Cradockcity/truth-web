'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/cn'

export function FavoriteButton({ title, className }: { title: string; className?: string }) {
  const [saved, setSaved] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={() => setSaved((value) => !value)}
      className={cn(
        'grid size-10 cursor-pointer place-items-center rounded-full glass transition-transform duration-200 ease-out-quint active:scale-90',
        className,
      )}
    >
      <Heart
        className={cn('size-[18px] transition-colors', saved && 'fill-saved text-saved')}
        strokeWidth={2.25}
      />
    </button>
  )
}
