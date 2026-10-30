import { Plus } from 'lucide-react'
import Link from 'next/link'

import { PersonRow } from '@/components/admin/person-row'
import { buttonVariants } from '@/components/ui/button'
import { listHosts } from '@/lib/admin/people'

export const instant = false

export const metadata = { title: 'Hosts' }

export default async function AdminHostsPage() {
  const hosts = await listHosts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline font-wide">Hosts</h1>
        <Link href="/admin/hosts/new" className={buttonVariants()}>
          <Plus /> New host
        </Link>
      </div>

      {hosts.length === 0 ? (
        <p className="rounded-sheet border border-line px-6 py-10 text-center text-ink/60">
          No hosts yet. Add the first one.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-sheet border border-line bg-control">
          {hosts.map((host) => (
            <PersonRow
              key={host.id}
              href={`/admin/hosts/${host.id}`}
              name={host.name}
              avatarUrl={host.avatarUrl}
              detail={[host.email, host.location].filter(Boolean).join(' · ')}
              share={host.revenueShare}
              shareLabel="commission"
              count={
                host.experienceCount === 1 ? '1 experience' : `${host.experienceCount} experiences`
              }
            />
          ))}
        </ul>
      )}
    </div>
  )
}
