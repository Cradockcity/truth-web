// CSV for Excel: a UTF-8 BOM (so "R" and accents show), quoted fields and CRLF line endings.
// Cells starting with = + - @ get a leading ' so Excel never runs them as formulas.

type Cell = string | number | null | undefined

function cell(value: Cell) {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(headers: readonly string[], rows: readonly (readonly Cell[])[]) {
  const lines = [headers, ...rows].map((row) => row.map(cell).join(','))
  return `﻿${lines.join('\r\n')}\r\n`
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
