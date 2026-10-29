import { type NextRequest, NextResponse } from 'next/server'

import { safeNext } from '@/lib/safe-next'
import { createClient } from '@/lib/supabase/server'

// Google (OAuth) sign-in returns here with ?code=… to exchange for a session.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const code = params.get('code')
  const next = safeNext(params.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      await supabase.rpc('claim_my_bookings')
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  return NextResponse.redirect(
    new URL(`/signin?error=google&next=${encodeURIComponent(next)}`, request.url),
  )
}
