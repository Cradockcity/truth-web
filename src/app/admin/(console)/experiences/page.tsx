import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { listAdminExperiences } from '@/lib/admin/experiences'
import { formatRand } from '@/lib/format'

export const metadata = { title: 'Experiences' }

export default async function AdminExperiencesPage() {
  const experiences = await listAdminExperiences()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline font-wide">Experiences</h1>
        <Link href="/admin/experiences/new" className={buttonVariants()}>
          <Plus /> New experience
        </Link>
      </div>

      {experiences.length === 0 ? (
        <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
          No experiences yet. Create the first one.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-sheet border border-line bg-control">
          {experiences.map((experience) => (
            <li
              key={experience.id}
              className="relative flex items-center gap-4 p-4 transition-colors hover:bg-surface"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-control bg-surface">
                {experience.main_image_url ? (
                  <Image
                    src={experience.main_image_url}
                    alt=""
                    fill
                    sizes="4rem"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Link
                  href={`/admin/experiences/${experience.id}`}
                  className="truncate font-medium after:absolute after:inset-0"
                >
                  {experience.title}
                </Link>
                <span className="truncate text-caption text-ink/60">
                  {[experience.location, experience.category].filter(Boolean).join(' · ')}
                </span>
              </div>
              <span className="hidden text-caption tabular-nums sm:block">
                {experience.price !== null ? formatRand(experience.price) : '—'}
              </span>
              <span
                className={
                  experience.is_active
                    ? 'rounded-full bg-success/15 px-2.5 py-0.5 text-caption font-medium'
                    : 'rounded-full bg-raised px-2.5 py-0.5 text-caption font-medium text-ink/60'
                }
              >
                {experience.is_active ? 'Live' : 'Hidden'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
