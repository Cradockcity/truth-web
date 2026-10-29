import Image from 'next/image'
import Link from 'next/link'

// One host or creator in an admin list; the whole row links to the editor.
export function PersonRow({
  href,
  name,
  avatarUrl,
  detail,
  share,
  count,
}: {
  href: string
  name: string
  avatarUrl: string | null
  detail: string
  share: number | null
  count: string
}) {
  return (
    <li className="relative flex items-center gap-4 p-4 transition-colors hover:bg-surface">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" fill sizes="3rem" className="object-cover" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link href={href} className="truncate font-medium after:absolute after:inset-0">
          {name}
        </Link>
        <span className="truncate text-caption text-ink/60">{detail}</span>
      </div>
      <span className="hidden text-caption text-ink/60 sm:block">{count}</span>
      <span className="w-14 text-right text-caption tabular-nums" title="Revenue share">
        {share !== null ? `${share}%` : '—'}
      </span>
    </li>
  )
}
