import Link from 'next/link'

import { HostForm } from '@/components/admin/host-form'
import { Section } from '@/components/admin/save-status'

export const metadata = { title: 'New host' }

export default function NewHostPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/hosts"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All hosts
        </Link>
        <h1 className="text-headline font-wide">New host</h1>
      </div>
      <Section title="Details" description="Then choose this host on their experiences.">
        <HostForm host={null} />
      </Section>
    </div>
  )
}
