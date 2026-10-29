import { cn } from '@/lib/cn'

const STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-success/15 text-ink' },
  pending: { label: 'Awaiting payment', className: 'bg-raised text-ink/80' },
  expired: { label: 'Hold expired', className: 'bg-raised text-ink/55' },
  failed: { label: 'Payment failed', className: 'bg-danger/12 text-danger' },
  cancelled: { label: 'Cancelled', className: 'bg-raised text-ink/55' },
  // Payout earnings
  due: { label: 'Due', className: 'bg-accent-soft text-ink' },
  upcoming: { label: 'Upcoming', className: 'bg-raised text-ink/80' },
}

export function StatusChip({ status, className }: { status: string; className?: string }) {
  const { label, className: tone } = STATUS[status] ?? { label: status, className: 'bg-raised' }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-caption font-medium',
        tone,
        className,
      )}
    >
      {label}
    </span>
  )
}
