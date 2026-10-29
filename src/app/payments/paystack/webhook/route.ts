import { type NextRequest, NextResponse } from 'next/server'

import { confirmPayment } from '@/lib/payments'
import { isValidSignature } from '@/lib/paystack'
import { createAdminClient } from '@/lib/supabase/admin'

// Backup to the redirect: confirms payments even if the customer closes the tab after paying.
// Only reachable once the site has a public URL registered in the Paystack dashboard.
export async function POST(request: NextRequest) {
  const raw = await request.text()
  if (!isValidSignature(raw, request.headers.get('x-paystack-signature'))) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  let event: {
    event?: string
    data?: {
      reference?: string
      transaction_reference?: string
      transaction?: { reference?: string }
    }
  }
  try {
    event = JSON.parse(raw)
  } catch {
    return new NextResponse('Bad payload', { status: 400 })
  }

  try {
    if (event.event === 'charge.success' && typeof event.data?.reference === 'string') {
      await confirmPayment(event.data.reference)
    }

    if (event.event === 'refund.processed' || event.event === 'refund.failed') {
      const reference = event.data?.transaction_reference ?? event.data?.transaction?.reference
      if (typeof reference === 'string') {
        const processed = event.event === 'refund.processed'
        await createAdminClient()
          .from('bookings')
          .update({
            refund_status: processed ? 'processed' : 'failed',
            refunded_at: processed ? new Date().toISOString() : null,
          })
          .eq('payment_reference', reference)
      }
    }
  } catch (error) {
    // A non-200 makes Paystack retry later, which is what we want for transient failures.
    console.error('Paystack webhook handling failed', error)
    return new NextResponse('Retry later', { status: 500 })
  }

  return new NextResponse('ok', { status: 200 })
}
