import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { publicEnv } from '@/lib/env'

import type { Database } from './database.types'

// Session-less client for public, cacheable reads. Never use it for user-specific data.
export function createPublicClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
