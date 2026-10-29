import 'server-only'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

// Every admin page and action calls this. It re-checks on the server, every time:
// a signed-in session, verified with the authenticator (aal2), and a row in public.admins.
export async function requireAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims?.sub) redirect('/admin/signin')
  if (claims.aal !== 'aal2') redirect('/admin/signin')

  const { data: isAdmin, error } = await supabase.rpc('is_admin')
  if (error || !isAdmin) redirect('/admin/signin?error=not-admin')

  return {
    supabase,
    userId: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
  }
}
