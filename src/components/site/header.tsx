import Link from 'next/link'

import { SearchPill } from '@/components/search/search-pill'
import { getFilterOptions } from '@/lib/data/experiences'

import { HeaderShell } from './header-shell'
import { MenuButton } from './menu-button'

// `overlay` floats the header over a hero photo until the visitor scrolls past it.
export async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const options = await getFilterOptions()

  return (
    <HeaderShell overlay={overlay}>
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lead font-display tracking-[-0.02em] text-ink">
          TRUTH
        </Link>

        <SearchPill options={options} className="mx-auto" />

        <MenuButton className="ml-auto sm:ml-0" />
      </div>
    </HeaderShell>
  )
}
