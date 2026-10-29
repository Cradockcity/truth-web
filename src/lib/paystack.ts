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
  status: z.string(),
  reference: z.string(),
  amount: z.number().int(),
  currency: z.string(),
})

export async function verifyTransaction(reference: string) {
  return paystack(`/transaction/verify/${encodeURIComponent(reference)}`, verified)
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
