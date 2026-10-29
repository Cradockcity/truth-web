'use client'

import { Heart } from 'lucide-react'

import { cn } from '@/lib/cn'
import { toggleSaved, useIsSaved } from '@/lib/saved'

export function FavoriteButton({
  id,
  title,
  className,
}: {
  id: string
  title: string
  className?: string
}) {
  const saved = useIsSaved(id)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={() => toggleSaved(id)}
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
