// A guest who visits a creator's page credits that creator for bookings on this device for
// 30 days; the last creator visited wins. create_booking only credits a creator who recommends
// the experience being booked, so a stale or wrong slug costs nothing.
export const CREATOR_CREDIT_KEY = 'truth-creator'
export const CREATOR_CREDIT_DAYS = 30

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DAY_MS = 24 * 60 * 60 * 1000

type Store = Pick<Storage, 'getItem' | 'setItem'>

export function rememberCreator(slug: string, now = Date.now(), storage?: Store) {
  if (!SLUG.test(slug)) return
  try {
    ;(storage ?? localStorage).setItem(
      CREATOR_CREDIT_KEY,
      JSON.stringify({ slug, until: now + CREATOR_CREDIT_DAYS * DAY_MS }),
    )
  } catch {
    // Storage blocked: this visit just isn't credited.
  }
}

export function creditedCreator(now = Date.now(), storage?: Store): string | null {
  try {
    const value: unknown = JSON.parse(
      (storage ?? localStorage).getItem(CREATOR_CREDIT_KEY) ?? 'null',
    )
    if (
      value &&
      typeof value === 'object' &&
      'slug' in value &&
      'until' in value &&
      typeof value.slug === 'string' &&
      SLUG.test(value.slug) &&
      typeof value.until === 'number' &&
      value.until > now
    ) {
      return value.slug
    }
  } catch {
    // Blocked storage or a damaged value: no credit.
  }
  return null
}
