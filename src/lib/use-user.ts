'use client'

import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

// undefined while checking, null when signed out. Read in the browser so pages stay cacheable.
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return user
}
