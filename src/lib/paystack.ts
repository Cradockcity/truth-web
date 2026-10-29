import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

import { z } from 'zod'

import { serverEnv } from '@/lib/env.server'

const API = 'https://api.paystack.co'

async function paystack<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serverEnv('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })
  const body: unknown = await response.json().catch(() => null)
  const parsed = z
    .object({ status: z.boolean(), message: z.string(), data: schema })
    .safeParse(body)
  if (!response.ok || !parsed.success || !parsed.data.status) {
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String(body.message)
        : response.statusText
    throw new Error(`Paystack ${path} failed: ${message}`)
  }
  return parsed.data.data
}

export async function initializeTransaction(input: {
  email: string
  amountCents: number
  currency: string
  reference: string
  callbackUrl: string
  bookingId: string
}) {
  return paystack('/transaction/initialize', z.object({ authorization_url: z.url() }), {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      amount: input.amountCents,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: { booking_id: input.bookingId },
    }),
  })
}

const verified = z.object({
  id: z.number().int(),
  status: z.string(),
  reference: z.string(),
  amount: z.number().int(),
  currency: z.string(),
})

export async function verifyTransaction(reference: string) {
  return paystack(`/transaction/verify/${encodeURIComponent(reference)}`, verified)
}

// Refunds settle asynchronously; Paystack reports the final state through refund.* webhooks.
export async function refundTransaction(input: {
  reference: string
  amountCents: number
  note: string
}) {
  return paystack('/refund', z.object({ status: z.string().optional() }).loose(), {
    method: 'POST',
    body: JSON.stringify({
      transaction: input.reference,
      amount: input.amountCents,
      merchant_note: input.note.slice(0, 200),
    }),
  })
}

export type RefundState = 'pending' | 'processed' | 'failed'

// Latest refund on a payment, mapped to our three states. Used when webhooks can't reach us.
export async function getRefundState(reference: string): Promise<RefundState | null> {
  const transaction = await verifyTransaction(reference)
  const refunds = await paystack(
    `/refund?transaction=${transaction.id}`,
    z.array(z.object({ status: z.string(), created_at: z.string().optional() }).loose()),
  )
  const latest = [...refunds].sort((a, b) =>
    (b.created_at ?? '').localeCompare(a.created_at ?? ''),
  )[0]
  if (!latest) return null
  if (latest.status === 'processed') return 'processed'
  if (latest.status === 'failed' || latest.status === 'reversed') return 'failed'
  return 'pending'
}

// Paystack signs webhook bodies with HMAC-SHA512 using the secret key.
export function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature) return false
  const expected = createHmac('sha512', serverEnv('PAYSTACK_SECRET_KEY'))
    .update(rawBody)
    .digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  return a.length === b.length && timingSafeEqual(a, b)
}
