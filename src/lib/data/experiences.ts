import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import type { ExperienceCardData } from '@/components/experience/experience-card'
import { createPublicClient } from '@/lib/supabase/public'

const CARD_COLUMNS =
  'id, title, location, category, duration, price, rating, review_count, main_image_url' as const

export async function getFeaturedExperiences(limit = 4): Promise<ExperienceCardData[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('experiences')

  const { data, error } = await createPublicClient()
    .from('experiences')
    .select(CARD_COLUMNS)
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw new Error(`Failed to load featured experiences: ${error.message}`)

  return data.flatMap((row) =>
    row.main_image_url && row.price !== null
      ? [
          {
            id: row.id,
            title: row.title,
            location: row.location ?? 'South Africa',
            category: row.category ?? 'Experience',
            duration: row.duration ?? '',
            price: row.price,
            rating: row.rating,
            reviewCount: row.review_count,
            imageUrl: row.main_image_url,
          },
        ]
      : [],
  )
}
