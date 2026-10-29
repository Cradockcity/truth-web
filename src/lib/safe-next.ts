// Only same-site paths: blocks open redirects like "//evil.com" or "https://evil.com".
export function safeNext(value: unknown, fallback = '/account/bookings') {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
