import Image from 'next/image'

import { cn } from '@/lib/cn'

import { FavoriteButton } from './favorite-button'

export function Gallery({ id, title, images }: { id: string; title: string; images: string[] }) {
  const [main, ...rest] = images
  if (!main) return null
  const side = rest.slice(0, 4)

  return (
    <div className="relative">
      {/* Phones: swipeable strip. */}
      <div className="-mx-4 no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:hidden">
        {images.map((src, index) => (
          <div
            key={src}
            className="relative aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-media bg-surface"
          >
            <Image
              src={src}
              alt={index === 0 ? title : `${title}, photo ${index + 1}`}
              fill
              priority={index === 0}
              sizes="88vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Larger screens: one hero photo with up to four alongside. */}
      <div
        className={cn(
          'hidden h-[min(32rem,60vh)] gap-2 overflow-hidden rounded-sheet sm:grid',
          side.length === 0
            ? 'grid-cols-1'
            : side.length === 1
              ? 'grid-cols-2'
              : 'grid-cols-4 grid-rows-2',
        )}
      >
        <div className={cn('relative bg-surface', side.length > 1 && 'col-span-2 row-span-2')}>
          <Image
            src={main}
            alt={title}
            fill
            priority
            sizes="(min-width: 1280px) 40rem, 50vw"
            className="object-cover"
          />
        </div>
        {side.map((src, index) => (
          <div
            key={src}
            className={cn(
              'relative bg-surface',
              side.length === 2 && 'row-span-2',
              side.length === 3 && index === 0 && 'row-span-2',
            )}
          >
            <Image
              src={src}
              alt={`${title}, photo ${index + 2}`}
              fill
              sizes="(min-width: 1280px) 20rem, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <FavoriteButton
        id={id}
        title={title}
        className="absolute top-3 right-3 sm:top-4 sm:right-4"
      />
    </div>
  )
}
