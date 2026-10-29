'use client'

import { useEffect } from 'react'

import { rememberCreator } from '@/lib/creator-credit'

// On a creator's page: credits them for this guest's bookings (see creator-credit.ts).
export function RememberCreator({ slug }: { slug: string }) {
  useEffect(() => rememberCreator(slug), [slug])
  return null
}
