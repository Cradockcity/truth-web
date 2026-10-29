import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlackoutEditor } from '@/components/admin/blackout-editor'
import { ExperienceDetailsForm } from '@/components/admin/experience-details-form'
import { ItineraryEditor } from '@/components/admin/itinerary-editor'
import { PhotoManager } from '@/components/admin/photo-manager'
import { Section } from '@/components/admin/save-status'
import { ScheduleEditor } from '@/components/admin/schedule-editor'
import {
  getEditableExperience,
  listCategoryOptions,
  listHostOptions,
} from '@/lib/admin/experiences'
import { isUuid } from '@/lib/data/experiences'
import { parseGroupSize } from '@/lib/filters'
import { todayInSouthAfrica } from '@/lib/sessions'

export const metadata = { title: 'Edit experience' }

const SECTIONS = [
  ['details', 'Details'],
  ['photos', 'Photos'],
  ['itinerary', 'Itinerary'],
  ['schedule', 'Schedule'],
  ['blocked', 'Blocked dates'],
] as const

export default async function EditExperiencePage({
  params,
  searchParams,
}: PageProps<'/admin/experiences/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  if (!isUuid(id)) notFound()

  const [experience, hosts, categories] = await Promise.all([
    getEditableExperience(id),
    listHostOptions(),
    listCategoryOptions(),
  ])
  if (!experience) notFound()

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/experiences"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All experiences
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-headline font-wide text-balance">{experience.title}</h1>
          {experience.isActive ? (
            <Link
              href={`/experiences/${experience.id}`}
              target="_blank"
              className="flex items-center gap-1.5 text-caption font-semibold underline underline-offset-4"
            >
              View on site <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          ) : (
            <span className="rounded-full bg-raised px-2.5 py-0.5 text-caption font-medium text-ink/60">
              Hidden from the site
            </span>
          )}
        </div>
        {query.created ? (
          <p role="status" className="text-caption text-success">
            Created. Add photos and a schedule, then switch on “Show on the site”.
          </p>
        ) : null}
      </div>

      <nav aria-label="Sections" className="no-scrollbar flex gap-2 overflow-x-auto">
        {SECTIONS.map(([anchor, label]) => (
          <a
            key={anchor}
            href={`#${anchor}`}
            className="flex h-9 shrink-0 items-center rounded-full border border-line bg-control px-3.5 text-caption font-medium hover:border-ink/40"
          >
            {label}
          </a>
        ))}
      </nav>

      <div id="details" className="scroll-mt-6">
        <Section title="Details">
          <ExperienceDetailsForm experience={experience} hosts={hosts} categories={categories} />
        </Section>
      </div>
      <div id="photos" className="scroll-mt-6">
        <Section title="Photos">
          <PhotoManager experienceId={experience.id} initial={experience.images} />
        </Section>
      </div>
      <div id="itinerary" className="scroll-mt-6">
        <Section title="Itinerary" description="The steps of the day, shown as a timeline.">
          <ItineraryEditor experienceId={experience.id} initial={experience.itinerary} />
        </Section>
      </div>
      <div id="schedule" className="scroll-mt-6">
        <Section
          title="Weekly schedule"
          description="When this experience runs and how many guests each session takes. Times are South African."
        >
          <ScheduleEditor
            experienceId={experience.id}
            initial={experience.schedule}
            defaultCapacity={parseGroupSize(experience.groupSize) ?? 10}
          />
        </Section>
      </div>
      <div id="blocked" className="scroll-mt-6">
        <Section
          title="Blocked dates"
          description="No sessions run on these days, whatever the schedule says."
        >
          <BlackoutEditor
            experienceId={experience.id}
            blackouts={experience.blackouts}
            today={todayInSouthAfrica()}
          />
        </Section>
      </div>
    </div>
  )
}
