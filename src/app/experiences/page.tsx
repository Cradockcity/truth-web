import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { ExperienceCard } from '@/components/experience/experience-card'
import { CardGridSkeleton, ExperienceGrid } from '@/components/experience/experience-grid'
import { FiltersButton } from '@/components/search/filters-button'
import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { getFilterOptions, searchExperiences } from '@/lib/data/experiences'
import { countActiveFilters, filtersToSearch, parseFilters } from '@/lib/filters'

export const metadata: Metadata = {
  title: 'Experiences across South Africa',
  description:
    'Browse food, culture and adventure experiences across South Africa, hosted by local experts.',
  alternates: { canonical: '/experiences' },
}

export default function ExperiencesPage({ searchParams }: PageProps<'/experiences'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <Suspense fallback={<ResultsSkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  )
}

async function Results({ searchParams }: Pick<PageProps<'/experiences'>, 'searchParams'>) {
  const filters = parseFilters(await searchParams)
  const [experiences, options] = await Promise.all([searchExperiences(filters), getFilterOptions()])

  const heading = filters.location
    ? `Experiences in ${filters.location}`
    : 'Experiences across South Africa'
  const categories = [null, ...options.categories]

  return (
    <>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-headline font-wide text-balance">{heading}</h1>
        <p className="text-ink/60" aria-live="polite">
          {experiences.length === 1 ? '1 experience' : `${experiences.length} experiences`}
          {filters.guests ? ` for ${filters.guests} guests` : ''}
        </p>
      </div>

      <div className="mb-8 flex items-center gap-3 border-b border-line pb-5">
        <nav
          aria-label="Experience types"
          className="-mx-1 no-scrollbar flex flex-1 gap-2 overflow-x-auto px-1"
        >
          {categories.map((category) => {
            const selected = filters.category === category
            return (
              <Link
                key={category ?? 'all'}
                href={`/experiences${filtersToSearch({ ...filters, category })}`}
                scroll={false}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'flex h-9 shrink-0 items-center rounded-full border px-4 text-caption font-medium transition-colors',
                  selected
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line bg-control text-ink hover:border-ink/40',
                )}
              >
                {category ?? 'All'}
              </Link>
            )
          })}
        </nav>
        <FiltersButton key={filtersToSearch(filters)} filters={filters} options={options} />
      </div>

      {experiences.length > 0 ? (
        <ExperienceGrid>
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} priority={index < 4} />
          ))}
        </ExperienceGrid>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-sheet border border-line px-6 py-12 sm:px-10">
          <h2 className="text-title font-semibold">No experiences match these filters</h2>
          <p className="max-w-[52ch] text-ink/65">
            {countActiveFilters(filters) > 1
              ? 'Try removing a filter or two to see more of what South Africa has to offer.'
              : 'Try a different filter to see more of what South Africa has to offer.'}
          </p>
          <Link href="/experiences" className={buttonVariants({ variant: 'secondary' })}>
            Clear filters
          </Link>
        </div>
      )}
    </>
  )
}

function ResultsSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="h-10 w-2/3 max-w-lg rounded-full bg-surface" />
        <div className="h-4 w-32 rounded-full bg-surface" />
      </div>
      <div className="flex gap-2 border-b border-line pb-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-9 w-24 rounded-full bg-surface" />
        ))}
      </div>
      <CardGridSkeleton count={8} />
    </div>
  )
}
