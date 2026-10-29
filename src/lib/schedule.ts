export type ScheduleSlot = { weekday: number; time: string; capacity: number }
export type Session = { time: string; capacity: number; days: number[] }

// Monday-first for display; values are JavaScript/Postgres weekdays (0 = Sunday).
export const WEEKDAYS = [
  { value: 1, short: 'Mon' },
  { value: 2, short: 'Tue' },
  { value: 3, short: 'Wed' },
  { value: 4, short: 'Thu' },
  { value: 5, short: 'Fri' },
  { value: 6, short: 'Sat' },
  { value: 0, short: 'Sun' },
] as const

// Database rows (one per weekday) → sessions (one per start time and seat count).
export function toSessions(slots: ScheduleSlot[]): Session[] {
  const groups = new Map<string, Session>()
  for (const slot of slots) {
    const key = `${slot.time}|${slot.capacity}`
    const session = groups.get(key) ?? { time: slot.time, capacity: slot.capacity, days: [] }
    session.days.push(slot.weekday)
    groups.set(key, session)
  }
  return [...groups.values()]
    .map((session) => ({ ...session, days: [...new Set(session.days)].sort() }))
    .sort((a, b) => a.time.localeCompare(b.time))
}

// Sessions → rows. If two sessions share a day and time, the later one wins.
export function toSlots(sessions: Session[]): ScheduleSlot[] {
  const byKey = new Map<string, ScheduleSlot>()
  for (const session of sessions) {
    for (const weekday of session.days) {
      byKey.set(`${weekday}|${session.time}`, {
        weekday,
        time: session.time,
        capacity: session.capacity,
      })
    }
  }
  return [...byKey.values()]
}
