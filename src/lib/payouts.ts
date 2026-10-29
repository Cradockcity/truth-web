// Payouts: what Truth owes hosts and creators (earnings) and what it has sent (payouts).
// The amounts are worked out in the database when a booking is paid (record_booking_earnings).

export const RECIPIENTS = ['host', 'creator'] as const
export type Recipient = (typeof RECIPIENTS)[number]

export type EarningStatus = 'upcoming' | 'due' | 'paid' | 'cancelled'

export function earningStatus(
  earning: { payoutId: string | null; voidedAt: string | null; dueOn: string },
  today: string,
): EarningStatus {
  if (earning.payoutId) return 'paid'
  if (earning.voidedAt) return 'cancelled'
  return earning.dueOn <= today ? 'due' : 'upcoming'
}

// Adds in cents so R0,10 + R0,20 is R0,30, not 0.30000000000000004.
export function sumAmounts(items: readonly { amount: number }[]) {
  return items.reduce((cents, item) => cents + Math.round(item.amount * 100), 0) / 100
}

export type Owed = {
  recipient: Recipient
  personId: string
  name: string
  due: { count: number; total: number }
  upcoming: { count: number; total: number; next: string | null }
}

// One line per person for the open earnings (not paid, not cancelled), most owed first.
export function groupOwed(
  earnings: readonly {
    recipient: Recipient
    personId: string
    name: string
    amount: number
    dueOn: string
    status: EarningStatus
  }[],
) {
  const people = new Map<
    string,
    Owed & { dueItems: { amount: number }[]; upcomingItems: { amount: number }[] }
  >()
  for (const earning of earnings) {
    if (earning.status !== 'due' && earning.status !== 'upcoming') continue
    const key = `${earning.recipient}:${earning.personId}`
    const person = people.get(key) ?? {
      recipient: earning.recipient,
      personId: earning.personId,
      name: earning.name,
      due: { count: 0, total: 0 },
      upcoming: { count: 0, total: 0, next: null },
      dueItems: [],
      upcomingItems: [],
    }
    if (earning.status === 'due') person.dueItems.push(earning)
    else {
      person.upcomingItems.push(earning)
      if (!person.upcoming.next || earning.dueOn < person.upcoming.next) {
        person.upcoming.next = earning.dueOn
      }
    }
    people.set(key, person)
  }

  return [...people.values()]
    .map(({ dueItems, upcomingItems, ...person }): Owed => ({
      ...person,
      due: { count: dueItems.length, total: sumAmounts(dueItems) },
      upcoming: {
        ...person.upcoming,
        count: upcomingItems.length,
        total: sumAmounts(upcomingItems),
      },
    }))
    .sort((a, b) => b.due.total - a.due.total || b.upcoming.total - a.upcoming.total)
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// "12 Mar 2026". Dates are calendar days, so format them as UTC midnight.
export function formatDay(date: string) {
  return dayFormat.format(new Date(`${date}T00:00:00Z`))
}
