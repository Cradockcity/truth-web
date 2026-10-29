import 'server-only'

import { z } from 'zod'

// Server-only secrets. Read lazily so the site still runs (browsing, booking) without payments set up.
const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
  PAYSTACK_SECRET_KEY: z.string().regex(/^sk_(test|live)_/),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

export function serverEnv<K extends keyof ServerEnv>(key: K): ServerEnv[K] {
  const result = serverEnvSchema.shape[key].safeParse(process.env[key])
  if (!result.success) {
    throw new Error(`${key} is missing or malformed. Add it to .env.local (see .env.example).`)
  }
  return result.data as ServerEnv[K]
}
