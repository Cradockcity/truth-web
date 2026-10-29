import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'

import { SiteFooter } from '@/components/site/footer'
import { InlineScript } from '@/components/site/inline-script'
import { SavedSync } from '@/components/site/saved-sync'
import { publicEnv } from '@/lib/env'
import { THEME_INIT_SCRIPT } from '@/lib/theme'

import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
})

const DESCRIPTION =
  'Discover unique activities hosted by local experts, from cultural tours to adventure experiences across South Africa.'

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Truth — Unforgettable experiences in South Africa',
    template: '%s · Truth',
  },
  description: DESCRIPTION,
  openGraph: {
    siteName: 'Truth',
    locale: 'en_ZA',
    type: 'website',
    description: DESCRIPTION,
    images: [
      'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  twitter: { card: 'summary_large_image' },
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
        <SavedSync />
      </body>
    </html>
  )
}
