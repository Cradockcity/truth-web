import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DeleteSection } from '@/components/admin/delete-section'
import { HostForm } from '@/components/admin/host-form'
import { Section } from '@/components/admin/save-status'
import { deleteHost } from '@/lib/actions/admin-people'
import { getEditableHost } from '@/lib/admin/people'
import { isUuid } from '@/lib/data/experiences'

export const metadata = { title: 'Edit host' }

export default async function EditHostPage({
  params,
  searchParams,
}: PageProps<'/admin/hosts/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const host = isUuid(id) ? await getEditableHost(id) : null
  if (!host) notFound()

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/hosts"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All hosts
        </Link>
        <h1 className="text-headline font-wide text-balance">{host.name}</h1>
        {query.created ? (
          <p role="status" className="text-caption text-success">
            Created. Choose this host on their experiences (Experiences, Details, Host).
          </p>
        ) : null}
      </div>

      <Section title="Details">
        <HostForm host={host} />
      </Section>

      <Section title="Experiences" description="Change an experience's host on its Details form.">
        {host.experiences.length === 0 ? (
          <p className="text-caption text-ink/60">No experiences use this host yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {host.experiences.map((experience) => (
              <li key={experience.id} className="flex items-center justify-between gap-4">
                <Link
                  href={`/admin/experiences/${experience.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {experience.title}
                </Link>
                <span className="text-caption text-ink/60">
                  {experience.isActive ? 'Live' : 'Hidden'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <DeleteSection
        id={host.id}
        title="Delete host"
        description={
          host.experiences.length > 0
            ? 'Choose another host for their experiences first.'
            : 'This removes the host for good.'
        }
        confirmLabel={`I understand this deletes ${host.name}.`}
        action={deleteHost}
      />
    </div>
  )
}
