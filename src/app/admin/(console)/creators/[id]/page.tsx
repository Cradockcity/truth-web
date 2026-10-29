import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CreatorForm } from '@/components/admin/creator-form'
import { CreatorPicksEditor } from '@/components/admin/creator-picks-editor'
import { DeleteSection } from '@/components/admin/delete-section'
import { Section } from '@/components/admin/save-status'
import { deleteCreator } from '@/lib/actions/admin-people'
import { getEditableCreator, listExperienceOptions } from '@/lib/admin/people'
import { isUuid } from '@/lib/data/experiences'

export const metadata = { title: 'Edit creator' }

export default async function EditCreatorPage({
  params,
  searchParams,
}: PageProps<'/admin/creators/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  if (!isUuid(id)) notFound()
  const [creator, experiences] = await Promise.all([
    getEditableCreator(id),
    listExperienceOptions(),
  ])
  if (!creator) notFound()

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/creators"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All creators
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-headline font-wide text-balance">{creator.name}</h1>
          <Link
            href={`/creators/${creator.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-caption font-semibold underline underline-offset-4"
          >
            View on site <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </div>
        {query.created ? (
          <p role="status" className="text-caption text-success">
            Created. Now choose the experiences they recommend.
          </p>
        ) : null}
      </div>

      <Section title="Details">
        <CreatorForm creator={creator} />
      </Section>

      <Section
        title="Recommended experiences"
        description="Shown on their page, and their name appears on these experiences."
      >
        <CreatorPicksEditor
          creatorId={creator.id}
          initial={creator.experienceIds}
          experiences={experiences}
        />
      </Section>

      <DeleteSection
        id={creator.id}
        title="Delete creator"
        description="This removes the creator and their page for good. Creators with bookings can't be deleted."
        confirmLabel={`I understand this deletes ${creator.name} and their page.`}
        action={deleteCreator}
      />
    </div>
  )
}
