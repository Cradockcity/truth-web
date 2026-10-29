'use client'

import { useEffect, useRef } from 'react'

import { replaceSaved, useSavedIds } from '@/lib/saved'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/use-user'

// Device storage stays the source of truth for the UI; this mirrors it to the signed-in account.
export function SavedSync() {
  const user = useUser()
  const ids = useSavedIds()
  const synced = useRef<{ userId: string; ids: Set<string> } | null>(null)
  const latestIds = useRef(ids)

  useEffect(() => {
    latestIds.current = ids
  }, [ids])

  // On sign-in: merge device and account saves in both directions.
  useEffect(() => {
    if (!user) {
      synced.current = null
      return
    }
    if (synced.current?.userId === user.id) return

    let cancelled = false
    const supabase = createClient()
    supabase
      .from('saved_experiences')
      .select('experience_id')
      .then(async ({ data, error }) => {
        if (cancelled || error) return
        const remote = new Set(data.map((row) => row.experience_id))
        const local = new Set(latestIds.current)
        const missingRemotely = [...local].filter((id) => !remote.has(id))
        if (missingRemotely.length > 0) {
          await supabase.from('saved_experiences').upsert(
            missingRemotely.map((experience_id) => ({ experience_id })),
            {
              onConflict: 'user_id,experience_id',
              ignoreDuplicates: true,
            },
          )
        }
        const union = new Set([...local, ...remote])
        synced.current = { userId: user.id, ids: union }
        replaceSaved([...union])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  // After the merge: push each add or remove.
  useEffect(() => {
    const state = synced.current
    if (!user || !state || state.userId !== user.id) return

    const current = new Set(ids)
    const added = [...current].filter((id) => !state.ids.has(id))
    const removed = [...state.ids].filter((id) => !current.has(id))
    if (added.length === 0 && removed.length === 0) return
    state.ids = current

    const supabase = createClient()
    if (added.length > 0) {
      void supabase.from('saved_experiences').upsert(
        added.map((experience_id) => ({ experience_id })),
        {
          onConflict: 'user_id,experience_id',
          ignoreDuplicates: true,
        },
      )
    }
    if (removed.length > 0) {
      void supabase.from('saved_experiences').delete().in('experience_id', removed)
    }
  }, [ids, user])

  return null
}
