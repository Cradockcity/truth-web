'use server'

import { z } from 'zod'

import { getExperiencesByIds } from '@/lib/data/experiences'

// z.guid() rather than z.uuid(): the seeded ids (e1000000-…) aren't RFC version-valid.
const savedIds = z.array(z.guid()).max(100)

export async function loadSavedExperiences(ids: unknown) {
  const parsed = savedIds.safeParse(ids)
  if (!parsed.success) return []
  return getExperiencesByIds(parsed.data)
}
