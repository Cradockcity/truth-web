const wholeRand = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

const randAndCents = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// en-ZA renders "R 1 800"; South African retail convention is "R1 800". Cents show only when
// present, so fees and totals are exact (R178,50) while list prices stay clean (R85).
export function formatRand(amount: number) {
  const cents = Math.round(amount * 100) % 100 !== 0
  return (cents ? randAndCents : wholeRand).format(amount).replace(/^R\s/, 'R')
}
