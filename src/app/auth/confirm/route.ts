import type { EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { safeNext } from '@/lib/safe-next'
import { createClient } from '@/lib/supabase/server'

const EMAIL_TYPES = new Set<EmailOtpType>([
  'email',
  'signup',
  'magiclink',
  'invite',
  'email_change',
])

// Target of the email sign-in link: {{ .SiteURL }}/auth/confirm?token_hash=…&type=email&next=…
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tokenHash = params.get('token_hash')
  const type = params.get('type') as EmailOtpType | null
  const next = safeNext(params.get('next'))

  if (tokenHash && type && EMAIL_TYPES.has(type)) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      await supabase.rpc('claim_my_bookings')
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  return NextResponse.redirect(
    new URL(`/signin?error=link&next=${encodeURIComponent(next)}`, request.url),
  )
}
