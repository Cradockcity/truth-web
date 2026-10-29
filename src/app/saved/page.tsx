import type { Metadata } from 'next'

import { SiteHeader } from '@/components/site/header'

import { SavedList } from './saved-list'

export const metadata: Metadata = {
  title: 'Saved experiences',
  robots: { index: false },
}

export default function SavedPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-headline font-wide">Saved</h1>
        <SavedList />
      </main>
    </>
  )
}
