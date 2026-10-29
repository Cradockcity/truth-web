export const REFUND_OPTIONS = ['full', 'minus-fee', 'none'] as const
export type RefundOption = (typeof REFUND_OPTIONS)[number]

// What the customer gets back for each choice. Paystack's own processing fee is never returned.
export function refundAmount(option: RefundOption, total: number, serviceFee: number) {
  switch (option) {
    case 'full':
      return round2(total)
    case 'minus-fee':
      return round2(Math.max(0, total - serviceFee))
    case 'none':
      return 0
  }
}

const round2 = (value: number) => Math.round(value * 100) / 100
