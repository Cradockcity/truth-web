import type { Recipient } from '@/lib/payouts'

export function RecipientChip({ recipient }: { recipient: Recipient }) {
  return (
    <span className="shrink-0 rounded-full bg-raised px-2 py-0.5 text-caption font-medium text-ink/70">
      {recipient === 'host' ? 'Host' : 'Creator'}
    </span>
  )
}
