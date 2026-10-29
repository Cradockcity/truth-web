import type { MetadataRoute } from 'next'

import { getCreatorSlugs } from '@/lib/data/creators'
import { getActiveExperienceIds } from '@/lib/data/experiences'
import { publicEnv } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL
  const [experienceIds, creatorSlugs] = await Promise.all([
    getActiveExperienceIds(),
    getCreatorSlugs(),
  ])

  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/experiences`, changeFrequency: 'daily', priority: 0.9 },
    ...experienceIds.map((id) => ({
      url: `${base}/experiences/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...creatorSlugs.map((slug) => ({
      url: `${base}/creators/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
