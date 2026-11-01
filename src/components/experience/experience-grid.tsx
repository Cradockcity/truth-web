import type { ReactNode } from 'react'

const GRID = 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

// Denser grid for ExperienceTile: two across on phones, up to six on wide screens.
const TILE_GRID =
  'grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export function ExperienceGrid({ children }: { children: ReactNode }) {
  return <div className={GRID}>{children}</div>
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className={TILE_GRID}>{children}</div>
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden className={GRID}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="aspect-[4/5] animate-pulse rounded-media bg-surface" />
          <div className="h-4 w-3/4 rounded-full bg-surface" />
          <div className="h-3 w-1/2 rounded-full bg-surface" />
        </div>
      ))}
    </div>
  )
}

export function TileGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden className={TILE_GRID}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="aspect-square animate-pulse rounded-media bg-surface" />
          <div className="h-4 w-3/4 rounded-full bg-surface" />
          <div className="h-3 w-1/2 rounded-full bg-surface" />
        </div>
      ))}
    </div>
  )
}
