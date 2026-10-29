import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { publicEnv } from '@/lib/env'
import { serverEnv } from '@/lib/env.server'

import type { Database } from './database.types'

// Bypasses row-level security. Use only for server-verified work such as confirming payments.
export function createAdminClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv('SUPABASE_SECRET_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
