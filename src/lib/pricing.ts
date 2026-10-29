// Display only. The authoritative price is computed in the create_booking() database function,
// which must use the same rate.
export const SERVICE_FEE_RATE = 0.05

export function quote(pricePerPerson: number, guests: number) {
  const subtotal = round2(pricePerPerson * guests)
  const fee = round2(subtotal * SERVICE_FEE_RATE)
  return { subtotal, fee, total: round2(subtotal + fee) }
}

const round2 = (value: number) => Math.round(value * 100) / 100
