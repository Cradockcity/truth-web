import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { AdminSignInForm } from '@/components/admin/admin-sign-in-form'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false } }

const NOTICES: Record<string, string> = {
  'not-admin': 'That account doesn’t have admin access.',
}

export default function AdminSignInPage({ searchParams }: PageProps<'/admin/signin'>) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col gap-8 rounded-sheet border border-line bg-control p-6 shadow-float sm:p-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-lead font-display tracking-[-0.02em]">
            TRUTH
          </Link>
          <h1 className="text-title font-semibold">Admin sign in</h1>
        </div>
        <Suspense
          fallback={<div aria-busy className="h-56 animate-pulse rounded-control bg-surface" />}
        >
          {searchParams.then((query) => (
            <SignInStep
              notice={typeof query.error === 'string' ? NOTICES[query.error] : undefined}
            />
          ))}
        </Suspense>
      </div>
    </main>
  )
}

async function SignInStep({ notice }: { notice?: string }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (claims?.sub && claims.aal === 'aal2' && !notice) {
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (isAdmin) redirect('/admin')
  }

  // Already signed in with a password or email link: only the authenticator step remains.
  const initialStep = claims?.sub && claims.aal === 'aal1' ? 'code' : 'password'
  return <AdminSignInForm initialStep={initialStep} notice={notice} />
}
