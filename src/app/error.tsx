'use client'

import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-5 px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-headline font-wide">Something went wrong loading this page</h1>
      <p className="max-w-[52ch] text-ink/65">
        This is usually temporary. Try again, and if it keeps happening, come back in a few minutes.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          Go home
        </Link>
      </div>
    </main>
  )
}
