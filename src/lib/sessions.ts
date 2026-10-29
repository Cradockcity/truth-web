export type Session = {
  date: string // YYYY-MM-DD, South African time
  time: string // HH:MM
  capacity: number
  remaining: number
}

export const SA_TIME_ZONE = 'Africa/Johannesburg'

export function todayInSouthAfrica(now = new Date()) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: SA_TIME_ZONE }).format(now)
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const shortDayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

// en-GB gives "Sunday 1 November"; en-ZA pads the day ("01").
// Dates are calendar days, so format them as UTC midnight to avoid shifting a day.
export function formatSessionDate(date: string, style: 'long' | 'short' = 'long') {
  const value = new Date(`${date}T00:00:00Z`)
  return (style === 'long' ? dayFormat : shortDayFormat).format(value)
}

export const toHourMinute = (time: string) => time.slice(0, 5)
