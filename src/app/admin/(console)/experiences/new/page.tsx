import Link from 'next/link'

import { ExperienceDetailsForm } from '@/components/admin/experience-details-form'
import { Section } from '@/components/admin/save-status'
import { listCategoryOptions, listHostOptions } from '@/lib/admin/experiences'

export const metadata = { title: 'New experience' }

export default async function NewExperiencePage() {
  const [hosts, categories] = await Promise.all([listHostOptions(), listCategoryOptions()])

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/experiences"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All experiences
        </Link>
        <h1 className="text-headline font-wide">New experience</h1>
      </div>
      <Section
        title="Details"
        description="You can add photos, the itinerary and the schedule after creating it."
      >
        <ExperienceDetailsForm experience={null} hosts={hosts} categories={categories} />
      </Section>
    </div>
  )
}
