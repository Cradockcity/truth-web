'use server'

import { refresh, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { requireAdmin } from '@/lib/admin/guard'
import { publicEnv } from '@/lib/env'

export type FormState = { error?: string; saved?: string }

const STORAGE_PREFIX = `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

// Refreshes the cached public pages, then the admin page the action came from.
function refreshPublicPages(id: string) {
  updateTag('experiences')
  updateTag(`experience:${id}`)
  updateTag('creators')
  refresh()
}

const lines = (max: number) =>
  z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, max),
    )
    .pipe(z.array(z.string().max(200, 'Keep each line under 200 characters.')))

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null)

const details = z.object({
  id: z.guid().optional(),
  title: z.string().trim().min(3, 'Add a title of at least 3 characters.').max(140),
  category: z.string().trim().min(1, 'Choose or type a category.').max(60),
  location: z.string().trim().min(1, 'Add a location.').max(80),
  hostId: z.union([z.guid(), z.literal('')]).transform((v) => v || null),
  price: z.coerce
    .number({ error: 'Enter a price in rand.' })
    .positive('The price must be more than R0.')
    .max(100_000)
    .transform((v) => Math.round(v * 100) / 100),
  duration: text(40),
  groupSize: text(40),
  description: text(300),
  longDescription: text(5000),
  highlights: lines(20),
  includes: lines(20),
  whatToBring: lines(20),
  meetingPoint: text(300),
  cancellationPolicy: text(300),
  accessibility: text(300),
  googlePlaceId: text(200),
  isActive: z.literal('on').optional().transform(Boolean),
})

export async function saveExperienceDetails(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = details.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form.' }
  const form = parsed.data

  const values = {
    title: form.title,
    category: form.category,
    location: form.location,
    host_id: form.hostId,
    price: form.price,
    duration: form.duration,
    group_size: form.groupSize,
    description: form.description,
    long_description: form.longDescription,
    highlights: form.highlights,
    includes: form.includes,
    what_to_bring: form.whatToBring,
    meeting_point: form.meetingPoint,
    cancellation_policy: form.cancellationPolicy,
    accessibility: form.accessibility,
    google_place_id: form.googlePlaceId,
    is_active: form.isActive,
    updated_at: new Date().toISOString(),
  }

  if (!form.id) {
    // New experiences start hidden: they need photos and a schedule before guests can book.
    const { data, error } = await supabase
      .from('experiences')
      .insert({ ...values, is_active: false })
      .select('id')
      .single()
    if (error) return { error: `Couldn’t create the experience: ${error.message}` }
    refreshPublicPages(data.id)
    redirect(`/admin/experiences/${data.id}?created=1`)
  }

  if (form.isActive) {
    const { data: current } = await supabase
      .from('experiences')
      .select('main_image_url')
      .eq('id', form.id)
      .single()
    if (!current?.main_image_url)
      return { error: 'Add at least one photo before showing it on the site.' }
  }

  const { error } = await supabase.from('experiences').update(values).eq('id', form.id)
  if (error) return { error: `Couldn’t save: ${error.message}` }
  refreshPublicPages(form.id)
  return {
    saved: form.isActive
      ? 'Saved. Changes are live on the site.'
      : 'Saved. This experience is hidden from the site.',
  }
}

const photos = z.object({
  id: z.guid(),
  urls: z
    .array(
      z
        .url()
        .refine(
          (url) =>
            url.startsWith(STORAGE_PREFIX) || url.startsWith('https://images.pexels.com/photos/'),
          'Photos must be uploaded here.',
        ),
    )
    .max(12, 'Use at most 12 photos.'),
})

export async function savePhotos(input: { id: string; urls: string[] }): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = photos.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the photos.' }
  const { id, urls } = parsed.data

  const { data: before } = await supabase
    .from('experiences')
    .select('main_image_url, gallery_images')
    .eq('id', id)
    .single()

  const [main = null, ...gallery] = urls
  const { error } = await supabase
    .from('experiences')
    .update({
      main_image_url: main,
      gallery_images: gallery,
      ...(main ? {} : { is_active: false }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { error: `Couldn’t save photos: ${error.message}` }

  // Remove files that are no longer used, so storage doesn't fill with orphans.
  const previous = [before?.main_image_url, ...(before?.gallery_images ?? [])].filter(
    (url): url is string => Boolean(url),
  )
  const removed = previous
    .filter((url) => !urls.includes(url) && url.startsWith(STORAGE_PREFIX))
    .map((url) => url.slice(STORAGE_PREFIX.length))
  if (removed.length > 0) await supabase.storage.from('images').remove(removed)

  refreshPublicPages(id)
  return {
    saved: main ? 'Photos saved.' : 'Photos saved. With no photos, the experience is now hidden.',
  }
}

const steps = z.object({
  id: z.guid(),
  steps: z
    .array(
      z.object({
        time: z.string().trim().max(20),
        activity: z.string().trim().min(1, 'Every step needs a description.').max(500),
      }),
    )
    .max(50),
})

export async function saveItinerary(input: z.input<typeof steps>): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = steps.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the itinerary.' }

  const { error } = await supabase.rpc('admin_replace_itinerary', {
    p_experience_id: parsed.data.id,
    p_steps: parsed.data.steps,
  })
  if (error) return { error: `Couldn’t save the itinerary: ${error.message}` }
  refreshPublicPages(parsed.data.id)
  return { saved: 'Itinerary saved.' }
}

const schedule = z.object({
  id: z.guid(),
  slots: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        time: z.string().regex(/^\d{2}:\d{2}$/, 'Use a time like 09:00.'),
        capacity: z.number().int().min(1, 'Seats must be at least 1.').max(500),
      }),
    )
    .max(200),
})

export async function saveSchedule(input: z.input<typeof schedule>): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = schedule.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the schedule.' }

  const { error } = await supabase.rpc('admin_replace_schedule', {
    p_experience_id: parsed.data.id,
    p_slots: parsed.data.slots,
  })
  if (error) return { error: `Couldn’t save the schedule: ${error.message}` }
  refreshPublicPages(parsed.data.id)
  return { saved: 'Schedule saved. New sessions are bookable straight away.' }
}

const blackout = z.object({
  id: z.guid(),
  date: z.iso.date('Choose a date.'),
  reason: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => v || null),
})

export async function addBlackout(_previous: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const parsed = blackout.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the date.' }

  const { error } = await supabase.from('experience_blackouts').upsert({
    experience_id: parsed.data.id,
    date: parsed.data.date,
    reason: parsed.data.reason,
  })
  if (error) return { error: `Couldn’t block that date: ${error.message}` }
  refreshPublicPages(parsed.data.id)
  return { saved: 'Date blocked.' }
}

export async function removeBlackout(formData: FormData) {
  const { supabase } = await requireAdmin()
  const parsed = blackout.pick({ id: true, date: true }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return
  await supabase
    .from('experience_blackouts')
    .delete()
    .eq('experience_id', parsed.data.id)
    .eq('date', parsed.data.date)
  refreshPublicPages(parsed.data.id)
}
