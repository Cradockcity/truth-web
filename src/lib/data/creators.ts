import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import type { ExperienceCardData } from '@/components/experience/experience-card'
import { createPublicClient } from '@/lib/supabase/public'

export type Creator = {
  name: string
  slug: string
  location: string | null
  bio: string | null
  quote: string | null
  avatarUrl: string | null
  coverUrl: string | null
  followers: string | null
  tags: string[]
  featuredIn: string[]
  socials: { label: string; href: string }[]
  experiences: ExperienceCardData[]
}

const SLUG = /^[a-z0-9-]{1,80}$/

// Public-safe columns only: never revenue share.
const CREATOR_SELECT = `
  name, slug, location, bio, signature_quote, avatar_url, cover_image_url, follower_count,
  personal_tags, featured_in, social_instagram, social_tiktok, social_youtube, social_website,
  referrals:creator_experience_referrals (
    experience:experiences (
      id, title, location, category, duration, price, rating, review_count, main_image_url, is_active
    )
  )
` as const

export async function getCreator(slug: string): Promise<Creator | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('creators', `creator:${slug}`)

  if (!SLUG.test(slug)) return null

  const { data: row, error } = await createPublicClient()
    .from('creators')
    .select(CREATOR_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`Failed to load creator: ${error.message}`)
  if (!row) return null

  const socials = [
    { label: 'Instagram', href: row.social_instagram },
    { label: 'TikTok', href: row.social_tiktok },
    { label: 'YouTube', href: row.social_youtube },
    { label: 'Website', href: row.social_website },
  ].flatMap((social) =>
    social.href?.startsWith('https://') ? [{ label: social.label, href: social.href }] : [],
  )

  return {
    name: row.name,
    slug: row.slug,
    location: row.location,
    bio: row.bio,
    quote: row.signature_quote,
    avatarUrl: row.avatar_url,
    coverUrl: row.cover_image_url,
    followers: row.follower_count,
    tags: row.personal_tags ?? [],
    featuredIn: row.featured_in ?? [],
    socials,
    experiences: row.referrals.flatMap(({ experience: e }) =>
      e && e.is_active && e.main_image_url && e.price !== null
        ? [
            {
              id: e.id,
              title: e.title,
              location: e.location ?? 'South Africa',
              category: e.category ?? 'Experience',
              duration: e.duration ?? '',
              price: e.price,
              rating: e.rating,
              reviewCount: e.review_count,
              imageUrl: e.main_image_url,
            },
          ]
        : [],
    ),
  }
}

export async function getCreatorSlugs(): Promise<string[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('creators')

  const { data, error } = await createPublicClient().from('creators').select('slug')
  if (error) throw new Error(`Failed to load creator slugs: ${error.message}`)
  return data.map((row) => row.slug)
}
