import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/cn'
import { formatRand } from '@/lib/format'

import { FavoriteButton } from './favorite-button'

export type ExperienceCardData = {
  id: string
  title: string
  location: string
  category: string
  duration: string
  price: number
  rating: number | null
  reviewCount: number | null
  imageUrl: string
}

export function ExperienceCard({
  experience,
  priority = false,
  className,
}: {
  experience: ExperienceCardData
  priority?: boolean
  className?: string
}) {
  const { id, title, location, category, duration, price, rating, reviewCount, imageUrl } =
    experience

  return (
    <article className={cn('group relative flex flex-col gap-4', className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-surface">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.04]"
        />
        <Chip tone="glass" className="absolute top-3 left-3">
          {category}
        </Chip>
        <FavoriteButton id={id} title={title} className="absolute top-3 right-3 z-10" />
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-body leading-snug font-semibold text-balance text-ink">
          <Link
            href={`/experiences/${id}`}
            className="after:absolute after:inset-0 after:rounded-media focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {title}
          </Link>
        </h3>
        <p className="text-caption text-ink/60">
          {location}, {duration}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p className="text-body text-ink">
            <span className="font-semibold">{formatRand(price)}</span>
            <span className="text-ink/60"> per person</span>
          </p>
          {rating !== null && reviewCount ? (
            <p className="flex items-center gap-1 text-caption text-ink/80">
              <Star className="size-3.5 fill-ink text-ink" aria-hidden />
              <span aria-hidden>{rating.toFixed(1)}</span>
              <span aria-hidden className="text-ink/60">
                ({reviewCount})
              </span>
              <span className="sr-only">
                Rated {rating.toFixed(1)} out of 5 from {reviewCount} reviews
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
