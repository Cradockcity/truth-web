import Link from 'next/link'

import { CreatorForm } from '@/components/admin/creator-form'
import { Section } from '@/components/admin/save-status'

export const instant = false

export const metadata = { title: 'New creator' }

export default function NewCreatorPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/creators"
          className="text-caption text-ink/60 hover:text-ink hover:underline"
        >
          All creators
        </Link>
        <h1 className="text-headline font-wide">New creator</h1>
      </div>
      <Section title="Details" description="You can choose their recommended experiences next.">
        <CreatorForm creator={null} />
      </Section>
    </div>
  )
}
