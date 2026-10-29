import 'server-only'

import { requireAdmin } from '@/lib/admin/guard'
import { createAdminClient } from '@/lib/supabase/admin'

// Host emails and revenue shares are hidden from the public API (anon and authenticated),
// so admin reads of hosts and creators use the service role, always after requireAdmin().

export type EditableHost = {
  id: string
  name: string
  email: string
  location: string
  bio: string
  avatarUrl: string | null
  joinedDate: string
  languages: string[]
  specialties: string[]
  verificationBadges: string[]
  revenueShare: number | null
  socialInstagram: string
  socialTwitter: string
  socialWebsite: string
  experiences: { id: string; title: string; isActive: boolean }[]
}

export async function listHosts() {
  await requireAdmin()
  const { data, error } = await createAdminClient()
    .from('hosts')
    .select(
      'id, name, email, location, avatar_url, revenue_share_percentage, experiences ( count )',
    )
    .order('name')
  if (error) throw new Error(`Failed to load hosts: ${error.message}`)
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    location: row.location,
    avatarUrl: row.avatar_url,
    revenueShare: row.revenue_share_percentage,
    experienceCount: row.experiences[0]?.count ?? 0,
  }))
}

export async function getEditableHost(id: string): Promise<EditableHost | null> {
  await requireAdmin()
  const { data: row, error } = await createAdminClient()
    .from('hosts')
    .select('*, experiences ( id, title, is_active )')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`Failed to load host: ${error.message}`)
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    location: row.location ?? '',
    bio: row.bio ?? '',
    avatarUrl: row.avatar_url,
    joinedDate: row.joined_date ?? '',
    languages: row.languages ?? [],
    specialties: row.specialties ?? [],
    verificationBadges: row.verification_badges ?? [],
    revenueShare: row.revenue_share_percentage,
    socialInstagram: row.social_instagram ?? '',
    socialTwitter: row.social_twitter ?? '',
    socialWebsite: row.social_website ?? '',
    experiences: row.experiences
      .map((e) => ({ id: e.id, title: e.title, isActive: e.is_active ?? false }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  }
}

export type EditableCreator = {
  id: string
  name: string
  slug: string
  location: string
  bio: string
  quote: string
  avatarUrl: string | null
  coverUrl: string | null
  followers: string
  tags: string[]
  featuredIn: string[]
  revenueShare: number | null
  socialInstagram: string
  socialTiktok: string
  socialYoutube: string
  socialWebsite: string
  experienceIds: string[]
}

export async function listCreators() {
  await requireAdmin()
  const { data, error } = await createAdminClient()
    .from('creators')
    .select(
      'id, name, slug, location, avatar_url, revenue_share_percentage, creator_experience_referrals ( count )',
    )
    .order('name')
  if (error) throw new Error(`Failed to load creators: ${error.message}`)
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location,
    avatarUrl: row.avatar_url,
    revenueShare: row.revenue_share_percentage,
    pickCount: row.creator_experience_referrals[0]?.count ?? 0,
  }))
}

export async function getEditableCreator(id: string): Promise<EditableCreator | null> {
  await requireAdmin()
  const { data: row, error } = await createAdminClient()
    .from('creators')
    .select('*, creator_experience_referrals ( experience_id )')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`Failed to load creator: ${error.message}`)
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location ?? '',
    bio: row.bio ?? '',
    quote: row.signature_quote ?? '',
    avatarUrl: row.avatar_url,
    coverUrl: row.cover_image_url,
    followers: row.follower_count ?? '',
    tags: row.personal_tags ?? [],
    featuredIn: row.featured_in ?? [],
    revenueShare: row.revenue_share_percentage,
    socialInstagram: row.social_instagram ?? '',
    socialTiktok: row.social_tiktok ?? '',
    socialYoutube: row.social_youtube ?? '',
    socialWebsite: row.social_website ?? '',
    experienceIds: row.creator_experience_referrals.map((r) => r.experience_id),
  }
}

// Every experience, live or hidden, for choosing a creator's picks.
export async function listExperienceOptions() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('experiences')
    .select('id, title, location, is_active')
    .order('title')
  if (error) throw new Error(`Failed to load experiences: ${error.message}`)
  return data.map((e) => ({
    id: e.id,
    title: e.title,
    location: e.location,
    isActive: e.is_active ?? false,
  }))
}
