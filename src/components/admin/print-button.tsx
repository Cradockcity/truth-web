'use client'

import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Opens the browser's print window, where "Save as PDF" is one of the printers.
export function PrintButton({ label = 'Print or save as PDF' }: { label?: string }) {
  return (
    <Button variant="secondary" onClick={() => window.print()} className="print:hidden">
      <Printer /> {label}
    </Button>
  )
}
