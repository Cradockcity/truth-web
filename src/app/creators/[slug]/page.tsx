import { MapPin, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ExperienceCard } from '@/components/experience/experience-card'
import { ExperienceGrid } from '@/components/experience/experience-grid'
import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { getCreator, getCreatorSlugs } from '@/lib/data/creators'

export async function generateStaticParams() {
  const slugs = await getCreatorSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/creators/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const creator = await getCreator(slug)
  if (!creator) return { title: 'Creator not found' }

  const description = creator.bio ?? `Experiences recommended by ${creator.name}.`
  return {
    title: `${creator.name}'s picks`,
    description,
    alternates: { canonical: `/creators/${creator.slug}` },
    openGraph: {
      title: `${creator.name}'s picks on Truth`,
      description,
      images: creator.coverUrl ? [creator.coverUrl] : creator.avatarUrl ? [creator.avatarUrl] : [],
    },
  }
}

export default function CreatorPage({ params }: PageProps<'/creators/[slug]'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div aria-busy className="h-48 animate-pulse rounded-sheet bg-surface sm:h-72" />
          }
        >
          {params.then(({ slug }) => (
            <CreatorProfile slug={slug} />
          ))}
        </Suspense>
      </main>
    </>
  )
}

async function CreatorProfile({ slug }: { slug: string }) {
  const creator = await getCreator(slug)
  if (!creator) notFound()

  return (
    <>
      <div className="relative h-48 overflow-hidden rounded-sheet bg-accent-soft sm:h-72">
        {creator.coverUrl ? (
          <Image
            src={creator.coverUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 80rem, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="-mt-12 flex flex-col gap-6 px-2 sm:-mt-16 sm:px-6">
        {creator.avatarUrl ? (
          <Image
            src={creator.avatarUrl}
            alt={creator.name}
            width={128}
            height={128}
            priority
            className="relative size-24 rounded-full border-4 border-canvas object-cover sm:size-32"
          />
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-4">
            <h1 className="text-headline font-wide">{creator.name}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-ink/70">
              {creator.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden /> {creator.location}
                </span>
              ) : null}
              {creator.followers ? (
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" aria-hidden /> {creator.followers} followers
                </span>
              ) : null}
            </div>
            {creator.bio ? (
              <p className="max-w-[60ch] text-lead text-ink/80">{creator.bio}</p>
            ) : null}
            {creator.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {creator.tags.map((tag) => (
                  <li key={tag}>
                    <Chip tone="accent">{tag.replace(/^#/, '')}</Chip>
                  </li>
                ))}
              </ul>
            ) : null}
            {creator.socials.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {creator.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {creator.quote || creator.featuredIn.length > 0 ? (
            <aside className="flex flex-col gap-6 rounded-sheet border border-line bg-control p-6 shadow-float">
              {creator.quote ? (
                <blockquote className="border-l-2 border-accent pl-4 text-lead text-ink/85">
                  {creator.quote}
                </blockquote>
              ) : null}
              {creator.featuredIn.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-caption font-medium text-ink/60">Featured in</p>
                  <p className="text-ink/80">{creator.featuredIn.join(', ')}</p>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>

      <section aria-labelledby="picks-heading" className="mt-16">
        <h2 id="picks-heading" className="mb-6 text-title font-semibold">
          {creator.name}&apos;s picks
        </h2>
        {creator.experiences.length > 0 ? (
          <ExperienceGrid>
            {creator.experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </ExperienceGrid>
        ) : (
          <p className="text-ink/65">{creator.name} hasn&apos;t picked any experiences yet.</p>
        )}
      </section>
    </>
  )
}
