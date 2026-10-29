import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import type { ExperienceCardData } from '@/components/experience/experience-card'
import { type ExperienceFilters, parseGroupSize } from '@/lib/filters'
import type { Database } from '@/lib/supabase/database.types'
import { createPublicClient } from '@/lib/supabase/public'

type ExperienceRow = Database['public']['Tables']['experiences']['Row']

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (value: string) => UUID.test(value)

const CARD_COLUMNS =
  'id, title, location, category, duration, group_size, price, rating, review_count, main_image_url' as const

type CardRow = Pick<
  ExperienceRow,
  | 'id'
  | 'title'
  | 'location'
  | 'category'
  | 'duration'
  | 'group_size'
  | 'price'
  | 'rating'
  | 'review_count'
  | 'main_image_url'
>

function toCard(row: CardRow): ExperienceCardData | null {
  if (!row.main_image_url || row.price === null) return null
  return {
    id: row.id,
    title: row.title,
    location: row.location ?? 'South Africa',
    category: row.category ?? 'Experience',
    duration: row.duration ?? '',
    price: row.price,
    rating: row.rating,
    reviewCount: row.review_count,
    imageUrl: row.main_image_url,
  }
}

function fail(what: string, message: string): never {
  throw new Error(`Failed to load ${what}: ${message}`)
}

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

  if (error) fail('featured experiences', error.message)
  return data.flatMap((row) => toCard(row) ?? [])
}

export async function searchExperiences(filters: ExperienceFilters): Promise<ExperienceCardData[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('experiences')

  let query = createPublicClient().from('experiences').select(CARD_COLUMNS).eq('is_active', true)

  if (filters.location) query = query.eq('location', filters.location)
  if (filters.category) query = query.eq('category', filters.category)
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice)

  switch (filters.sort) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false, nullsFirst: false })
      break
    case 'recommended':
      query = query
        .order('review_count', { ascending: false, nullsFirst: false })
        .order('rating', { ascending: false, nullsFirst: false })
  }

  const { data, error } = await query.limit(60)
  if (error) fail('experiences', error.message)

  return data
    .filter((row) => {
      if (!filters.guests) return true
      const capacity = parseGroupSize(row.group_size)
      return capacity === null || capacity >= filters.guests
    })
    .flatMap((row) => toCard(row) ?? [])
}

export type FilterOptions = { locations: string[]; categories: string[]; highestPrice: number }

export async function getFilterOptions(): Promise<FilterOptions> {
  'use cache'
  cacheLife('hours')
  cacheTag('experiences')

  const { data, error } = await createPublicClient()
    .from('experiences')
    .select('location, category, price')
    .eq('is_active', true)

  if (error) fail('filter options', error.message)

  const unique = (values: (string | null)[]) =>
    [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
      a.localeCompare(b),
    )

  return {
    locations: unique(data.map((row) => row.location)),
    categories: unique(data.map((row) => row.category)),
    highestPrice: Math.max(0, ...data.map((row) => row.price ?? 0)),
  }
}

export async function getActiveExperienceIds(): Promise<string[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('experiences')

  const { data, error } = await createPublicClient()
    .from('experiences')
    .select('id')
    .eq('is_active', true)

  if (error) fail('experience ids', error.message)
  return data.map((row) => row.id)
}

export async function getExperiencesByIds(ids: string[]): Promise<ExperienceCardData[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('experiences')

  const valid = ids.filter(isUuid).slice(0, 100)
  if (valid.length === 0) return []

  const { data, error } = await createPublicClient()
    .from('experiences')
    .select(CARD_COLUMNS)
    .eq('is_active', true)
    .in('id', valid)

  if (error) fail('saved experiences', error.message)
  const byId = new Map(data.map((row) => [row.id, toCard(row)]))
  return valid.flatMap((id) => byId.get(id) ?? [])
}

export type ExperienceDetail = {
  id: string
  title: string
  summary: string
  description: string
  category: string
  location: string
  duration: string
  groupSize: string | null
  price: number
  rating: number | null
  reviewCount: number | null
  images: string[]
  highlights: string[]
  includes: string[]
  whatToBring: string[]
  meetingPoint: string | null
  cancellationPolicy: string | null
  accessibility: string | null
  host: {
    name: string
    avatarUrl: string | null
    bio: string | null
    location: string | null
    joinedDate: string | null
    languages: string[]
    badges: string[]
  } | null
  itinerary: { time: string | null; activity: string }[]
  reviews: {
    author: string
    avatarUrl: string | null
    rating: number
    comment: string | null
    createdAt: string | null
  }[]
  recommendedBy: { name: string; slug: string; avatarUrl: string | null }[]
}

// Only columns that are safe to show publicly: never host email or revenue share.
const DETAIL_SELECT = `
  id, title, description, long_description, category, location, duration, group_size, price,
  rating, review_count, main_image_url, gallery_images, highlights, includes, what_to_bring,
  meeting_point, cancellation_policy, accessibility,
  host:hosts ( name, avatar_url, bio, location, joined_date, languages, verification_badges ),
  itinerary:experience_itineraries ( time, activity, order_index ),
  reviews ( author_name, author_avatar_url, rating, comment, created_at ),
  referrals:creator_experience_referrals ( creator:creators ( name, slug, avatar_url ) )
` as const

export async function getExperience(id: string): Promise<ExperienceDetail | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('experiences', `experience:${id}`)

  if (!isUuid(id)) return null

  const { data: row, error } = await createPublicClient()
    .from('experiences')
    .select(DETAIL_SELECT)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) fail('experience', error.message)
  if (!row || row.price === null || !row.main_image_url) return null

  const images = [row.main_image_url, ...(row.gallery_images ?? [])].filter(
    (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index,
  )

  return {
    id: row.id,
    title: row.title,
    summary: row.description ?? '',
    description: row.long_description ?? row.description ?? '',
    category: row.category ?? 'Experience',
    location: row.location ?? 'South Africa',
    duration: row.duration ?? '',
    groupSize: row.group_size,
    price: row.price,
    rating: row.rating,
    reviewCount: row.review_count,
    images,
    highlights: row.highlights ?? [],
    includes: row.includes ?? [],
    whatToBring: row.what_to_bring ?? [],
    meetingPoint: row.meeting_point,
    cancellationPolicy: row.cancellation_policy,
    accessibility: row.accessibility,
    host: row.host
      ? {
          name: row.host.name,
          avatarUrl: row.host.avatar_url,
          bio: row.host.bio,
          location: row.host.location,
          joinedDate: row.host.joined_date,
          languages: row.host.languages ?? [],
          badges: row.host.verification_badges ?? [],
        }
      : null,
    itinerary: [...row.itinerary]
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .flatMap((step) => (step.activity ? [{ time: step.time, activity: step.activity }] : [])),
    reviews: [...row.reviews]
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .map((review) => ({
        author: review.author_name ?? 'Guest',
        avatarUrl: review.author_avatar_url,
        rating: review.rating ?? 5,
        comment: review.comment,
        createdAt: review.created_at,
      })),
    recommendedBy: row.referrals.flatMap((referral) =>
      referral.creator
        ? [
            {
              name: referral.creator.name,
              slug: referral.creator.slug,
              avatarUrl: referral.creator.avatar_url,
            },
          ]
        : [],
    ),
  }
}
