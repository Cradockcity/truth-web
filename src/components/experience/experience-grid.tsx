import type { ReactNode } from 'react'

const GRID = 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export function ExperienceGrid({ children }: { children: ReactNode }) {
  return <div className={GRID}>{children}</div>
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
