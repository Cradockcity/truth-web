import { expect, test, vi } from 'vitest'

import { imageUrl, link, percent, SOCIAL_PROFILES, socialLink, tags } from './form'

// form.ts reads the public env (for the storage address) when it loads.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'https://project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= 'test-key'
})

test('tags split on commas and new lines, trimmed and without repeats', () => {
  expect(tags(10).parse(' English, Afrikaans,\nEnglish ,, isiXhosa ')).toEqual([
    'English',
    'Afrikaans',
    'isiXhosa',
  ])
  expect(tags(10).parse(undefined)).toEqual([])
})

test('percent accepts 0 to 100 with a comma or dot, and empty as none', () => {
  expect(percent.parse('15')).toBe(15)
  expect(percent.parse('12,5')).toBe(12.5)
  expect(percent.parse('')).toBeNull()
  expect(percent.safeParse('101').success).toBe(false)
  expect(percent.safeParse('ten').success).toBe(false)
})

test('websites are stored as https links', () => {
  expect(link.parse('')).toBeNull()
  expect(link.parse('example.co.za')).toBe('https://example.co.za/')
  expect(link.parse('http://example.com/tours')).toBe('https://example.com/tours')
  expect(link.parse('https://example.com/a?b=1')).toBe('https://example.com/a?b=1')
  expect(link.safeParse('javascript:alert(1)').success).toBe(false)
  expect(link.safeParse('ftp://example.com').success).toBe(false)
  expect(link.safeParse('hello').success).toBe(false)
})

test('social fields accept a handle or the full link', () => {
  const instagram = socialLink(SOCIAL_PROFILES.instagram)
  const tiktok = socialLink(SOCIAL_PROFILES.tiktok)
  expect(instagram.parse('')).toBeNull()
  expect(instagram.parse('@jane.doe')).toBe('https://www.instagram.com/jane.doe')
  expect(instagram.parse('jane_doe')).toBe('https://www.instagram.com/jane_doe')
  expect(tiktok.parse('@jane')).toBe('https://www.tiktok.com/@jane')
  expect(instagram.parse('instagram.com/jane')).toBe('https://instagram.com/jane')
  expect(instagram.parse('https://www.instagram.com/jane/')).toBe('https://www.instagram.com/jane/')
  expect(instagram.safeParse('jane doe').success).toBe(false)
  expect(instagram.safeParse('javascript:alert(1)').success).toBe(false)
})

test('photos must come from our storage or Pexels', () => {
  expect(imageUrl.safeParse('https://evil.example/photo.jpg').success).toBe(false)
  expect(imageUrl.parse('https://images.pexels.com/photos/1/a.jpeg')).toBe(
    'https://images.pexels.com/photos/1/a.jpeg',
  )
  const upload = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/hosts/a.jpg`
  expect(imageUrl.parse(upload)).toBe(upload)
})
