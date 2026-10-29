import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'

import { SiteFooter } from '@/components/site/footer'
import { InlineScript } from '@/components/site/inline-script'
import { THEME_INIT_SCRIPT } from '@/lib/theme'

import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
})

export const metadata: Metadata = {
  title: {
    default: 'Truth — Unforgettable experiences in South Africa',
    template: '%s · Truth',
  },
  description:
    'Discover unique activities hosted by local experts, from cultural tours to adventure experiences across South Africa.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0f0c' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // The head script may set data-theme before hydration, so the attribute can differ.
    <html
      lang="en-ZA"
      className={`${archivo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
