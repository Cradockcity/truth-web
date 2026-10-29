import Link from 'next/link'
import { Suspense } from 'react'

import { ExperienceCard } from '@/components/experience/experience-card'
import { SiteHeader } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { buttonVariants } from '@/components/ui/button'
import { getFeaturedExperiences } from '@/lib/data/experiences'

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main className="flex-1">
        <Hero />
        <section
          aria-labelledby="featured-heading"
          className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mb-6 flex items-center justify-between gap-6">
            <h2
              id="featured-heading"
              className="text-title font-semibold tracking-[-0.015em] text-ink"
            >
              Featured experiences
            </h2>
            <Link
              href="/experiences"
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'shrink-0' })}
            >
              View all
            </Link>
          </div>
          <Suspense fallback={<CardGridSkeleton />}>
            <FeaturedGrid />
          </Suspense>
        </section>
      </main>
    </>
  )
}

async function FeaturedGrid() {
  const experiences = await getFeaturedExperiences(4)

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  )
}

function CardGridSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="aspect-[4/5] animate-pulse rounded-media bg-surface" />
          <div className="h-4 w-3/4 rounded-full bg-surface" />
          <div className="h-3 w-1/2 rounded-full bg-surface" />
        </div>
      ))}
    </div>
  )
}
