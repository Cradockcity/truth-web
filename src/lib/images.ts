import { publicEnv } from '@/lib/env'

// Matches the "images" storage bucket's rules.
export const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export const STORAGE_PREFIX = `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

// Our own uploads, plus the Pexels photos the seed data uses.
export const isAllowedImageUrl = (url: string) =>
  url.startsWith(STORAGE_PREFIX) || url.startsWith('https://images.pexels.com/photos/')

// The storage path of one of our uploads, or null for anything else.
export const storagePath = (url: string) =>
  url.startsWith(STORAGE_PREFIX) ? url.slice(STORAGE_PREFIX.length) : null
