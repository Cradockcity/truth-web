import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'

import type { ExperienceCardData } from './experience-card'
import { FavoriteButton } from './favorite-button'

// The compact card for dense grids (search results): square photo, title, place, price and rating.
export function ExperienceTile({
  experience,
  priority = false,
  className,
}: {
  experience: ExperienceCardData
  priority?: boolean
  className?: string
}) {
  const { id, title, location, price, rating, reviewCount, imageUrl } = experience

  return (
    <article className={cn('group relative flex flex-col gap-2', className)}>
      <div className="relative aspect-square overflow-hidden rounded-media bg-surface">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 13rem, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.04]"
        />
        <FavoriteButton id={id} title={title} className="absolute top-2 right-2 z-10" />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 px-0.5">
        <h3 className="line-clamp-2 text-body leading-snug font-semibold text-ink">
          <Link
            href={`/experiences/${id}`}
            className="after:absolute after:inset-0 after:rounded-media focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {title}
          </Link>
        </h3>
        <p className="truncate text-caption text-ink/70">{location}</p>
        <p className="flex items-center gap-1.5 text-caption text-ink">
          <span>
            <span className="font-semibold">{formatRand(price)}</span>
            <span className="sr-only"> per person</span>
          </span>
          {rating !== null && reviewCount ? (
            <>
              <span aria-hidden className="text-ink/40">
                ·
              </span>
              <span className="flex items-center gap-1 text-ink/80">
                <Star className="size-3 fill-ink text-ink" aria-hidden />
                <span aria-hidden>{rating.toFixed(1)}</span>
                <span className="sr-only">
                  Rated {rating.toFixed(1)} out of 5 from {reviewCount} reviews
                </span>
              </span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  )
}
