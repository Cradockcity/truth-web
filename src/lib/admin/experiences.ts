import 'server-only'

import { requireAdmin } from '@/lib/admin/guard'

export async function listAdminExperiences() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('experiences')
    .select('id, title, location, category, price, is_active, main_image_url, updated_at')
    .order('updated_at', { ascending: false, nullsFirst: false })
  if (error) throw new Error(`Failed to load experiences: ${error.message}`)
  return data
}

export type EditableExperience = {
  id: string
  title: string
  category: string
  location: string
  hostId: string | null
  price: number | null
  duration: string
  groupSize: string
  description: string
  longDescription: string
  highlights: string[]
  includes: string[]
  whatToBring: string[]
  meetingPoint: string
  cancellationPolicy: string
  accessibility: string
  googlePlaceId: string
  isActive: boolean
  images: string[]
  itinerary: { time: string; activity: string }[]
  schedule: { weekday: number; time: string; capacity: number }[]
  blackouts: { date: string; reason: string | null }[]
}

export async function getEditableExperience(id: string): Promise<EditableExperience | null> {
  const { supabase } = await requireAdmin()
  const { data: row, error } = await supabase
    .from('experiences')
    .select(
      `*,
      itinerary:experience_itineraries ( time, activity, order_index ),
      schedule:experience_schedules ( weekday, start_time, capacity ),
      blackouts:experience_blackouts ( date, reason )`,
    )
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load experience: ${error.message}`)
  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    category: row.category ?? '',
    location: row.location ?? '',
    hostId: row.host_id,
    price: row.price,
    duration: row.duration ?? '',
    groupSize: row.group_size ?? '',
    description: row.description ?? '',
    longDescription: row.long_description ?? '',
    highlights: row.highlights ?? [],
    includes: row.includes ?? [],
    whatToBring: row.what_to_bring ?? [],
    meetingPoint: row.meeting_point ?? '',
    cancellationPolicy: row.cancellation_policy ?? '',
    accessibility: row.accessibility ?? '',
    googlePlaceId: row.google_place_id ?? '',
    isActive: row.is_active ?? false,
    images: [row.main_image_url, ...(row.gallery_images ?? [])].filter(
      (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index,
    ),
    itinerary: [...row.itinerary]
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((step) => ({ time: step.time ?? '', activity: step.activity ?? '' })),
    schedule: row.schedule
      .map((slot) => ({
        weekday: slot.weekday,
        time: slot.start_time.slice(0, 5),
        capacity: slot.capacity,
      }))
      .sort((a, b) => a.time.localeCompare(b.time) || a.weekday - b.weekday),
    blackouts: [...row.blackouts].sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export async function listHostOptions() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('hosts').select('id, name').order('name')
  if (error) throw new Error(`Failed to load hosts: ${error.message}`)
  return data
}

export async function listCategoryOptions() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('experiences').select('category')
  if (error) throw new Error(`Failed to load categories: ${error.message}`)
  return [...new Set(data.map((row) => row.category).filter((c): c is string => Boolean(c)))].sort()
}
