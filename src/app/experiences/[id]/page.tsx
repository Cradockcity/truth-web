import {
  Accessibility,
  BadgeCheck,
  CalendarX,
  Check,
  Clock,
  Languages,
  MapPin,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

import { Gallery } from '@/components/experience/gallery'
import { SiteHeader } from '@/components/site/header'
import { Chip } from '@/components/ui/chip'
import {
  type ExperienceDetail,
  getActiveExperienceIds,
  getExperience,
} from '@/lib/data/experiences'
import { filtersToSearch } from '@/lib/filters'
import { formatRand } from '@/lib/format'

export async function generateStaticParams() {
  const ids = await getActiveExperienceIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: PageProps<'/experiences/[id]'>): Promise<Metadata> {
  const { id } = await params
  const experience = await getExperience(id)
  if (!experience) return { title: 'Experience not found' }

  const description = experience.summary || `${experience.title} in ${experience.location}.`
  return {
    title: `${experience.title}, ${experience.location}`,
    description,
    alternates: { canonical: `/experiences/${experience.id}` },
    openGraph: {
      title: experience.title,
      description,
      type: 'website',
      images: experience.images.slice(0, 1),
    },
  }
}

export default function ExperiencePage({ params }: PageProps<'/experiences/[id]'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8">
        <Suspense fallback={<DetailSkeleton />}>
          {params.then(({ id }) => (
            <ExperienceDetails id={id} />
          ))}
        </Suspense>
      </main>
    </>
  )
}

function DetailSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-8">
      <div className="h-4 w-48 rounded-full bg-surface" />
      <div className="h-72 animate-pulse rounded-sheet bg-surface sm:h-[min(32rem,60vh)]" />
      <div className="flex flex-col gap-3">
        <div className="h-10 w-3/4 max-w-xl rounded-full bg-surface" />
        <div className="h-4 w-60 rounded-full bg-surface" />
      </div>
    </div>
  )
}

async function ExperienceDetails({ id }: { id: string }) {
  const experience = await getExperience(id)
  if (!experience) notFound()

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-caption text-ink/60">
        <Link href="/experiences" className="hover:text-ink hover:underline">
          Experiences
        </Link>
        <span aria-hidden> / </span>
        <Link
          href={`/experiences${filtersToSearch({ location: experience.location })}`}
          className="hover:text-ink hover:underline"
        >
          {experience.location}
        </Link>
      </nav>

      <Gallery id={experience.id} title={experience.title} images={experience.images} />

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10">
          <TitleBlock experience={experience} />
          <div className="lg:hidden">
            <BookingCard experience={experience} />
          </div>
          <Facts experience={experience} />
          {experience.host ? <HostCard host={experience.host} /> : null}

          {experience.description ? (
            <Section title="About this experience">
              <p className="max-w-[65ch] whitespace-pre-line text-ink/80">
                {experience.description}
              </p>
            </Section>
          ) : null}

          {experience.highlights.length > 0 ? (
            <Section title="Highlights">
              <CheckList items={experience.highlights} />
            </Section>
          ) : null}

          {experience.itinerary.length > 0 ? (
            <Section title="What you'll do">
              <ol className="relative flex flex-col gap-6 border-l border-line pl-6">
                {experience.itinerary.map((step, index) => (
                  <li key={index} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[1.85rem] size-3 rounded-full border-2 border-canvas bg-ink"
                    />
                    {step.time ? (
                      <p className="text-caption font-semibold text-ink/60 tabular-nums">
                        {step.time}
                      </p>
                    ) : null}
                    <p className="text-ink/85">{step.activity}</p>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {experience.includes.length > 0 || experience.whatToBring.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2">
              {experience.includes.length > 0 ? (
                <Section title="What's included">
                  <CheckList items={experience.includes} />
                </Section>
              ) : null}
              {experience.whatToBring.length > 0 ? (
                <Section title="What to bring">
                  <ul className="flex flex-col gap-2 text-ink/80">
                    {experience.whatToBring.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink/40"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
            </div>
          ) : null}

          <GoodToKnow experience={experience} />
          <Reviews experience={experience} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BookingCard experience={experience} />
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(experience) }} />
    </>
  )
}

function TitleBlock({ experience }: { experience: ExperienceDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-headline font-wide text-balance">{experience.title}</h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-ink/75">
        <Rating rating={experience.rating} count={experience.reviewCount} />
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden /> {experience.location}
        </span>
        <Chip>{experience.category}</Chip>
      </div>
      {experience.recommendedBy.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {experience.recommendedBy.map((creator) => (
            <Link key={creator.slug} href={`/creators/${creator.slug}`}>
              <Chip tone="accent" className="py-1 pl-1 transition-opacity hover:opacity-80">
                {creator.avatarUrl ? (
                  <Image
                    src={creator.avatarUrl}
                    alt=""
                    width={22}
                    height={22}
                    className="size-[22px] rounded-full object-cover"
                  />
                ) : (
                  <Sparkles />
                )}
                Recommended by {creator.name}
              </Chip>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Rating({ rating, count }: { rating: number | null; count: number | null }) {
  if (rating === null || !count) return <span>New experience</span>
  return (
    <a href="#reviews" className="flex items-center gap-1.5 font-medium text-ink hover:underline">
      <Star className="size-4 fill-ink" aria-hidden />
      {rating.toFixed(1)}
      <span className="font-normal text-ink/60">({count} reviews)</span>
    </a>
  )
}

function BookingCard({ experience }: { experience: ExperienceDetail }) {
  return (
    <div className="flex flex-col gap-5 rounded-sheet border border-line bg-control p-6 shadow-float">
      <p>
        <span className="text-title font-semibold">{formatRand(experience.price)}</span>
        <span className="text-ink/60"> per person</span>
      </p>
      <ul className="flex flex-col gap-3 text-caption text-ink/75">
        {experience.duration ? (
          <li className="flex items-center gap-2.5">
            <Clock className="size-4" aria-hidden /> {experience.duration}
          </li>
        ) : null}
        {experience.groupSize ? (
          <li className="flex items-center gap-2.5">
            <Users className="size-4" aria-hidden /> {experience.groupSize}
          </li>
        ) : null}
        {experience.cancellationPolicy ? (
          <li className="flex items-center gap-2.5">
            <CalendarX className="size-4" aria-hidden /> {experience.cancellationPolicy}
          </li>
        ) : null}
      </ul>
      <p className="rounded-control bg-surface px-4 py-3 text-caption text-ink/70">
        Online booking opens soon. Save this experience with the heart to find it again.
      </p>
    </div>
  )
}

function Facts({ experience }: { experience: ExperienceDetail }) {
  const facts = [
    experience.duration && { icon: Clock, label: 'Duration', value: experience.duration },
    experience.groupSize && { icon: Users, label: 'Group size', value: experience.groupSize },
    experience.host?.languages.length && {
      icon: Languages,
      label: 'Hosted in',
      value: experience.host.languages.join(', '),
    },
  ].filter((fact): fact is { icon: typeof Clock; label: string; value: string } => Boolean(fact))

  if (facts.length === 0) return null
  return (
    <dl className="grid gap-4 border-y border-line py-6 sm:grid-cols-3">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <Icon className="mt-0.5 size-5 text-ink/60" aria-hidden />
          <div>
            <dt className="text-caption text-ink/60">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

function HostCard({ host }: { host: NonNullable<ExperienceDetail['host']> }) {
  const since = host.joinedDate
    ? new Intl.DateTimeFormat('en-ZA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(host.joinedDate),
      )
    : null

  return (
    <section aria-label="Your host" className="flex gap-4">
      {host.avatarUrl ? (
        <Image
          src={host.avatarUrl}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Hosted by {host.name}</p>
        <p className="text-caption text-ink/60">
          {[host.location, since && `Hosting since ${since}`].filter(Boolean).join(', ')}
        </p>
        {host.bio ? <p className="mt-1 max-w-[60ch] text-ink/80">{host.bio}</p> : null}
        {host.badges.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {host.badges.map((badge) => (
              <li key={badge}>
                <Chip>
                  <BadgeCheck /> {badge}
                </Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

function GoodToKnow({ experience }: { experience: ExperienceDetail }) {
  const items = [
    experience.meetingPoint && {
      icon: MapPin,
      label: 'Meeting point',
      value: experience.meetingPoint,
    },
    experience.cancellationPolicy && {
      icon: CalendarX,
      label: 'Cancellation',
      value: experience.cancellationPolicy,
    },
    experience.accessibility && {
      icon: Accessibility,
      label: 'Accessibility',
      value: experience.accessibility,
    },
  ].filter((item): item is { icon: typeof MapPin; label: string; value: string } => Boolean(item))

  if (items.length === 0) return null
  return (
    <Section title="Good to know">
      <dl className="grid gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <Icon className="size-5 text-ink/60" aria-hidden />
            <dt className="font-semibold">{label}</dt>
            <dd className="text-ink/75">{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function Reviews({ experience }: { experience: ExperienceDetail }) {
  if (experience.reviews.length === 0) return null
  const month = new Intl.DateTimeFormat('en-ZA', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-24">
      <h2 id="reviews-heading" className="mb-6 flex items-center gap-2 text-title font-semibold">
        <Star className="size-5 fill-ink" aria-hidden />
        {experience.rating !== null ? `${experience.rating.toFixed(1)} · ` : ''}
        {experience.reviewCount ?? experience.reviews.length} reviews
      </h2>
      <ul className="grid gap-8 sm:grid-cols-2">
        {experience.reviews.map((review, index) => (
          <li key={index} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {review.avatarUrl ? (
                <Image
                  src={review.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-10 place-items-center rounded-full bg-raised font-semibold">
                  {review.author.charAt(0)}
                </span>
              )}
              <div>
                <p className="font-semibold">{review.author}</p>
                {review.createdAt ? (
                  <p className="text-caption text-ink/60">
                    {month.format(new Date(review.createdAt))}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="flex gap-0.5" aria-label={`Rated ${review.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, star) => (
                <Star
                  key={star}
                  aria-hidden
                  className={
                    star < review.rating ? 'size-3.5 fill-ink text-ink' : 'size-3.5 text-ink/25'
                  }
                />
              ))}
            </p>
            {review.comment ? <p className="text-ink/80">{review.comment}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-ink/80">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

function jsonLd(experience: ExperienceDetail) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: experience.title,
    description: experience.summary,
    image: experience.images,
    touristType: experience.category,
    offers: {
      '@type': 'Offer',
      price: experience.price,
      priceCurrency: 'ZAR',
    },
    ...(experience.rating !== null && experience.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: experience.rating,
            reviewCount: experience.reviewCount,
          },
        }
      : {}),
  }
  // Escape "<" so text from the database can never close the script tag.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
