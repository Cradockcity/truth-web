'use server'

import { refresh, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  type FormState,
  imageUrl,
  link,
  percent,
  SOCIAL_PROFILES,
  socialLink,
  tags,
  text,
} from '@/lib/admin/form'
import { requireAdmin } from '@/lib/admin/guard'
import { storagePath } from '@/lib/images'
import type { createClient } from '@/lib/supabase/server'

type Supabase = Awaited<ReturnType<typeof createClient>>

// Hosts appear on experience pages; creators on their own pages and on experience pages.
function refreshPages() {
  updateTag('experiences')
  updateTag('creators')
  refresh()
}

// Deletes our uploaded files that a save replaced or removed.
async function removeReplacedImages(
  supabase: Supabase,
  before: (string | null)[],
  after: (string | null)[],
) {
  const paths = before
    .filter((url): url is string => Boolean(url) && !after.includes(url))
    .flatMap((url) => storagePath(url) ?? [])
  if (paths.length > 0) await supabase.storage.from('images').remove(paths)
}

const confirmed = z.object({ id: z.guid(), confirm: z.literal('yes') })

// Hosts

const host = z.object({
  id: z.guid().optional(),
  name: z.string().trim().min(2, 'Add the host’s name.').max(80),
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.').max(200)),
  location: text(80),
  bio: text(1000),
  avatarUrl: imageUrl,
  joinedDate: z.union([z.iso.date(), z.literal('')]).transform((v) => v || null),
  languages: tags(10),
  specialties: tags(10),
  verificationBadges: tags(10),
  revenueShare: percent.refine((v) => v !== null, 'Add Truth’s commission for this host.'),
  socialInstagram: socialLink(SOCIAL_PROFILES.instagram),
  socialTwitter: socialLink(SOCIAL_PROFILES.x),
  socialWebsite: link,
})

export async function saveHost(_previous: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = host.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' }
  const form = parsed.data

  const values = {
    name: form.name,
    email: form.email,
    location: form.location,
    bio: form.bio,
    avatar_url: form.avatarUrl,
    joined_date: form.joinedDate,
    languages: form.languages,
    specialties: form.specialties,
    verification_badges: form.verificationBadges,
    revenue_share_percentage: form.revenueShare,
    social_instagram: form.socialInstagram,
    social_twitter: form.socialTwitter,
    social_website: form.socialWebsite,
    updated_at: new Date().toISOString(),
  }
  const failed = (message: string, code?: string) => ({
    error: code === '23505' ? 'Another host already uses that email.' : `Couldn’t save: ${message}`,
  })

  if (!form.id) {
    const { data, error } = await supabase.from('hosts').insert(values).select('id').single()
    if (error) return failed(error.message, error.code)
    refreshPages()
    redirect(`/admin/hosts/${data.id}?created=1`)
  }

  const { data: before } = await supabase
    .from('hosts')
    .select('avatar_url')
    .eq('id', form.id)
    .single()
  const { error } = await supabase.from('hosts').update(values).eq('id', form.id)
  if (error) return failed(error.message, error.code)
  await removeReplacedImages(supabase, [before?.avatar_url ?? null], [form.avatarUrl])

  refreshPages()
  return { saved: 'Saved. Experience pages show the changes now.' }
}

export async function deleteHost(_previous: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = confirmed.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Tick the box to confirm.' }
  const { id } = parsed.data

  const { count } = await supabase
    .from('experiences')
    .select('id', { count: 'exact', head: true })
    .eq('host_id', id)
  if (count) {
    return {
      error: `This host runs ${count === 1 ? '1 experience' : `${count} experiences`}. Choose another host for ${count === 1 ? 'it' : 'them'} first.`,
    }
  }

  const { data: before } = await supabase.from('hosts').select('avatar_url').eq('id', id).single()
  const { error } = await supabase.from('hosts').delete().eq('id', id)
  if (error) return { error: `Couldn’t delete: ${error.message}` }
  await removeReplacedImages(supabase, [before?.avatar_url ?? null], [])

  refreshPages()
  redirect('/admin/hosts')
}

// Creators

const creator = z.object({
  id: z.guid().optional(),
  name: z.string().trim().min(2, 'Add the creator’s name.').max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(80)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Use lowercase letters, numbers and dashes for the web address, like jane-doe.',
    ),
  location: text(80),
  bio: text(1000),
  quote: text(300),
  avatarUrl: imageUrl,
  coverUrl: imageUrl,
  followers: text(20),
  tags: tags(10),
  featuredIn: tags(10),
  revenueShare: percent.refine((v) => v !== null, 'Add the creator’s share.'),
  socialInstagram: socialLink(SOCIAL_PROFILES.instagram),
  socialTiktok: socialLink(SOCIAL_PROFILES.tiktok),
  socialYoutube: socialLink(SOCIAL_PROFILES.youtube),
  socialWebsite: link,
})

export async function saveCreator(_previous: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = creator.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' }
  const form = parsed.data

  const values = {
    name: form.name,
    slug: form.slug,
    location: form.location,
    bio: form.bio,
    signature_quote: form.quote,
    avatar_url: form.avatarUrl,
    cover_image_url: form.coverUrl,
    follower_count: form.followers,
    personal_tags: form.tags,
    featured_in: form.featuredIn,
    revenue_share_percentage: form.revenueShare,
    social_instagram: form.socialInstagram,
    social_tiktok: form.socialTiktok,
    social_youtube: form.socialYoutube,
    social_website: form.socialWebsite,
    updated_at: new Date().toISOString(),
  }
  const failed = (message: string, code?: string) => ({
    error:
      code === '23505'
        ? 'Another creator already uses that web address. Choose a different one.'
        : `Couldn’t save: ${message}`,
  })

  if (!form.id) {
    const { data, error } = await supabase.from('creators').insert(values).select('id').single()
    if (error) return failed(error.message, error.code)
    refreshPages()
    redirect(`/admin/creators/${data.id}?created=1`)
  }

  const { data: before } = await supabase
    .from('creators')
    .select('avatar_url, cover_image_url')
    .eq('id', form.id)
    .single()
  const { error } = await supabase.from('creators').update(values).eq('id', form.id)
  if (error) return failed(error.message, error.code)
  await removeReplacedImages(
    supabase,
    [before?.avatar_url ?? null, before?.cover_image_url ?? null],
    [form.avatarUrl, form.coverUrl],
  )

  refreshPages()
  return { saved: `Saved. Their page is at /creators/${form.slug}.` }
}

const picks = z.object({
  id: z.guid(),
  experienceIds: z.array(z.guid()).max(100, 'Choose at most 100 experiences.'),
})

export async function saveCreatorPicks(input: z.input<typeof picks>): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = picks.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the list.' }

  const { error } = await supabase.rpc('admin_replace_creator_experiences', {
    p_creator_id: parsed.data.id,
    p_experience_ids: parsed.data.experienceIds,
  })
  if (error) return { error: `Couldn’t save the picks: ${error.message}` }
  refreshPages()
  return { saved: 'Picks saved. Only live experiences show on their page.' }
}

export async function deleteCreator(_previous: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = confirmed.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Tick the box to confirm.' }
  const { id } = parsed.data

  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', id)
  if (count) {
    return {
      error:
        'Guests have booked through this creator, so they stay on record. Remove their picks instead.',
    }
  }

  const { data: before } = await supabase
    .from('creators')
    .select('avatar_url, cover_image_url')
    .eq('id', id)
    .single()
  const { error: picksError } = await supabase.rpc('admin_replace_creator_experiences', {
    p_creator_id: id,
    p_experience_ids: [],
  })
  if (picksError) return { error: `Couldn’t delete: ${picksError.message}` }
  const { error } = await supabase.from('creators').delete().eq('id', id)
  if (error) return { error: `Couldn’t delete: ${error.message}` }
  await removeReplacedImages(
    supabase,
    [before?.avatar_url ?? null, before?.cover_image_url ?? null],
    [],
  )

  refreshPages()
  redirect('/admin/creators')
}
