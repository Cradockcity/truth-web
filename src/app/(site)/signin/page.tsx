import type { Metadata } from 'next'
import { Suspense } from 'react'

import { SignInForm } from '@/components/auth/sign-in-form'
import { SiteHeader } from '@/components/site/header'
import { safeNext } from '@/lib/safe-next'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false },
}

const ERRORS: Record<string, string> = {
  link: 'That sign-in link has expired or was already used. Request a new one below.',
  google: 'Google sign-in didn’t complete. Try again, or use an email link instead.',
}

export default function SignInPage({ searchParams }: PageProps<'/signin'>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
        <div className="flex flex-col gap-8 rounded-sheet border border-line bg-control p-6 shadow-float sm:p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-headline font-wide">Sign in</h1>
            <p className="text-ink/70">
              See your bookings and keep saved experiences on every device. You don&apos;t need an
              account to book.
            </p>
          </div>
          <Suspense
            fallback={<div aria-busy className="h-56 animate-pulse rounded-control bg-surface" />}
          >
            {searchParams.then((query) => {
              const error = typeof query.error === 'string' ? ERRORS[query.error] : undefined
              return (
                <>
                  {error ? (
                    <p
                      role="alert"
                      className="rounded-control bg-surface px-4 py-3 text-caption text-danger"
                    >
                      {error}
                    </p>
                  ) : null}
                  <SignInForm next={safeNext(query.next)} />
                </>
              )
            })}
          </Suspense>
        </div>
      </main>
    </>
  )
}
