import { type NextRequest, NextResponse } from 'next/server'

import { confirmPayment } from '@/lib/payments'

// Paystack sends the customer back here with ?reference=…. We verify, then show their booking.
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  const home = new URL('/', request.url)

  if (!reference || !/^[A-Za-z0-9-]{8,64}$/.test(reference)) return NextResponse.redirect(home)

  try {
    const { outcome, bookingId, accessToken } = await confirmPayment(reference)
    if (!bookingId || !accessToken) return NextResponse.redirect(home)

    const target = new URL(`/bookings/${bookingId}`, request.url)
    target.searchParams.set('token', accessToken)
    if (outcome !== 'paid' && outcome !== 'already_paid')
      target.searchParams.set('payment', outcome)
    return NextResponse.redirect(target)
  } catch (error) {
    console.error('Paystack callback failed', error)
    return NextResponse.redirect(home)
  }
}
