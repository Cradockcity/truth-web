'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

export type AdminSignInState = { step: 'password' | 'code'; error?: string; email?: string }

const credentials = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
})

export async function adminSignIn(
  _previous: AdminSignInState,
  formData: FormData,
): Promise<AdminSignInState> {
  const parsed = credentials.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  })
  if (!parsed.success) {
    return {
      step: 'password',
      error: 'Enter your email and password.',
      email: String(formData.get('email') ?? ''),
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    return {
      step: 'password',
      error: 'That email and password don’t match.',
      email: parsed.data.email,
    }
  }
  return { step: 'code' }
}

const code = z.string().regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app.')

export async function adminVerifyCode(
  _previous: AdminSignInState,
  formData: FormData,
): Promise<AdminSignInState> {
  const parsed = code.safeParse(String(formData.get('code') ?? '').replace(/\s/g, ''))
  if (!parsed.success) return { step: 'code', error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  // getUser() first: the assurance-level helpers misbehave without a freshly loaded user.
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { step: 'password', error: 'Your session ended. Sign in again.' }

  const { data: factors } = await supabase.auth.mfa.listFactors()
  const factor = factors?.totp.find((item) => item.status === 'verified')
  if (!factor) {
    return {
      step: 'code',
      error: 'This account has no authenticator set up. Ask the site owner to enable it.',
    }
  }

  // Separate challenge and verify calls (challengeAndVerify has been unreliable).
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: factor.id,
  })
  if (challengeError || !challenge)
    return { step: 'code', error: 'Couldn’t start verification. Try again.' }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challenge.id,
    code: parsed.data,
  })
  if (verifyError)
    return { step: 'code', error: 'That code isn’t right or has expired. Try the current one.' }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    await supabase.auth.signOut()
    return { step: 'password', error: 'This account doesn’t have admin access.' }
  }

  redirect('/admin')
}

// One entry point so the form has a single state: the hidden "intent" field picks the step.
export async function adminAuth(
  previous: AdminSignInState,
  formData: FormData,
): Promise<AdminSignInState> {
  return formData.get('intent') === 'code'
    ? adminVerifyCode(previous, formData)
    : adminSignIn(previous, formData)
}

export async function adminSignOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/signin')
}
