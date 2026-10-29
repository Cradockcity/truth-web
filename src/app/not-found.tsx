import Link from 'next/link'

import { SiteHeader } from '@/components/site/header'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-5 px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-display font-display text-ink/15">404</p>
        <h1 className="text-headline font-wide">We couldn&apos;t find that page</h1>
        <p className="max-w-[52ch] text-ink/65">
          The link may be old, or the experience may no longer be available.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/experiences" className={buttonVariants()}>
            Browse experiences
          </Link>
          <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
            Go home
          </Link>
        </div>
      </main>
    </>
  )
}
