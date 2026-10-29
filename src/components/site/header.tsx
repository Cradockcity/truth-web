import Link from 'next/link'

import { SearchPill } from '@/components/search/search-pill'
import { cn } from '@/lib/cn'
import { getFilterOptions } from '@/lib/data/experiences'

import { MenuButton } from './menu-button'

// `overlay` floats the header over a hero photo, so it always uses the dark scheme.
export async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const options = await getFilterOptions()

  return (
    <header
      className={cn(
        'z-40',
        overlay
          ? 'absolute inset-x-0 top-0 scheme-dark light:inset-x-3 light:top-3'
          : 'sticky top-0 w-full border-b border-line bg-canvas/85 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lead font-display tracking-[-0.02em] text-ink">
          TRUTH
        </Link>

        <SearchPill options={options} overlay={overlay} className="mx-auto" />

        <MenuButton overlay={overlay} className="ml-auto sm:ml-0" />
      </div>
    </header>
  )
}
