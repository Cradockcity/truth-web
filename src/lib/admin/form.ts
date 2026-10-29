import { z } from 'zod'

import { isAllowedImageUrl } from '@/lib/images'

// What admin forms show after a save.
export type FormState = { error?: string; saved?: string }

// Optional text: trimmed, and empty becomes null.
export const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null)

// One item per line.
export const lines = (max: number) =>
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

// Short labels separated by commas, like "English, Afrikaans".
export const tags = (max: number) =>
  z
    .string()
    .optional()
    .transform((value) =>
      [
        ...new Set(
          (value ?? '')
            .split(/[,\n]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ].slice(0, max),
    )
    .pipe(z.array(z.string().max(60, 'Keep each item under 60 characters.')))

// "example.co.za" or "http://…" become https (the public pages only show https links).
// Anything that isn't a web address, like "javascript:…", gives null.
function toHttps(value: string) {
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withScheme.replace(/^http:/i, 'https:'))
    return url.protocol === 'https:' && url.hostname.includes('.') ? url.href : null
  } catch {
    return null
  }
}

// Optional website.
export const link = text(300).transform((v, context) => {
  if (v === null) return null
  const url = toHttps(v)
  if (url) return url
  context.addIssue({ code: 'custom', message: 'Enter a web address, like example.co.za.' })
  return z.NEVER
})

// Optional social profile: a handle (@name or name) or the full link.
// `profile` is the address a handle goes after, like "https://www.instagram.com/".
export const socialLink = (profile: string) =>
  text(300).transform((v, context) => {
    if (v === null) return null
    if (!/[/:]/.test(v)) {
      const handle = v.replace(/^@/, '')
      if (/^[\w.-]{1,60}$/.test(handle)) return `${profile}${handle}`
    } else {
      const url = toHttps(v)
      if (url) return url
    }
    context.addIssue({
      code: 'custom',
      message: 'Enter their handle, like @name, or the full link.',
    })
    return z.NEVER
  })

export const SOCIAL_PROFILES = {
  instagram: 'https://www.instagram.com/',
  x: 'https://x.com/',
  tiktok: 'https://www.tiktok.com/@',
  youtube: 'https://www.youtube.com/@',
}

// Optional photo: one uploaded here (or an existing seed photo).
export const imageUrl = text(500).refine(
  (v) => v === null || isAllowedImageUrl(v),
  'Upload the photo here.',
)

// Optional percentage from 0 to 100, with up to 2 decimals.
export const percent = z
  .string()
  .trim()
  .optional()
  .transform((v, context) => {
    if (!v) return null
    const value = Number(v.replace(',', '.'))
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      context.addIssue({ code: 'custom', message: 'Enter a percentage from 0 to 100.' })
      return z.NEVER
    }
    return Math.round(value * 100) / 100
  })
