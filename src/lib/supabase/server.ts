import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

import { publicEnv } from '@/lib/env'

import type { Database } from './database.types'

// Create one per request; never share a server client between requests.
// `connection()` marks the caller dynamic, so Next doesn't try to prerender
// through Supabase's session-expiry Date.now() check (public reads use
// createPublicClient instead).
export async function createClient() {
  await connection()
  const cookieStore = await cookies()

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Server Components can't write cookies; the proxy refreshes the session instead.
          }
        },
      },
    },
  )
}
