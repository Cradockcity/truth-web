const randFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

// en-ZA renders "R 1 800"; South African retail convention is "R1 800".
export function formatRand(amount: number) {
  return randFormatter.format(amount).replace(/^R\s/, 'R')
}
