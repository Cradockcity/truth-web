'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { publicEnv } from '@/lib/env'
import { safeNext } from '@/lib/safe-next'
import { createClient } from '@/lib/supabase/server'

export type SignInState = { sentTo?: string; error?: string; email?: string }

const emailSchema = z.email('Enter an email address like name@example.com').max(254)

export async function sendSignInLink(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim()
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, email }

  const next = safeNext(formData.get('next'))
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    const limited = error.status === 429 || /rate limit/i.test(error.message)
    return {
      email,
      error: limited
        ? 'Too many sign-in emails were sent. Wait a few minutes and try again.'
        : 'We couldn’t send the sign-in email. Check the address and try again.',
    }
  }
  return { sentTo: parsed.data }
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get('next'))
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error || !data.url) redirect(`/signin?error=google&next=${encodeURIComponent(next)}`)
  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
