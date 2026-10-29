import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Truth — Unforgettable experiences in South Africa',
    template: '%s · Truth',
  },
  description:
    'Discover unique activities hosted by local experts, from cultural tours to adventure experiences across South Africa.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-ZA" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  )
}
