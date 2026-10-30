import { Plus } from 'lucide-react'
import Link from 'next/link'

import { PersonRow } from '@/components/admin/person-row'
import { buttonVariants } from '@/components/ui/button'
import { listCreators } from '@/lib/admin/people'

export const instant = false

export const metadata = { title: 'Creators' }

export default async function AdminCreatorsPage() {
  const creators = await listCreators()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline font-wide">Creators</h1>
        <Link href="/admin/creators/new" className={buttonVariants()}>
          <Plus /> New creator
        </Link>
      </div>

      {creators.length === 0 ? (
        <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
          No creators yet. Add the first one.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-sheet border border-line bg-control">
          {creators.map((creator) => (
            <PersonRow
              key={creator.id}
              href={`/admin/creators/${creator.id}`}
              name={creator.name}
              avatarUrl={creator.avatarUrl}
              detail={[`/creators/${creator.slug}`, creator.location].filter(Boolean).join(' · ')}
              share={creator.revenueShare}
              shareLabel="share"
              count={creator.pickCount === 1 ? '1 pick' : `${creator.pickCount} picks`}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
