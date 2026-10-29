'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { ExperienceCard, type ExperienceCardData } from '@/components/experience/experience-card'
import { CardGridSkeleton, ExperienceGrid } from '@/components/experience/experience-grid'
import { buttonVariants } from '@/components/ui/button'
import { useSavedIds } from '@/lib/saved'

import { loadSavedExperiences } from './actions'

const noop = () => () => {}

export function SavedList() {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
  const ids = useSavedIds()
  const key = ids.join(',')
  const [loaded, setLoaded] = useState<{ key: string; items: ExperienceCardData[] } | null>(null)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    loadSavedExperiences(key.split(',')).then((items) => {
      if (!cancelled) setLoaded({ key, items })
    })
    return () => {
      cancelled = true
    }
  }, [key])

  if (!hydrated) return <CardGridSkeleton />

  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sheet border border-line px-6 py-12 sm:px-10">
        <Heart className="size-8 text-ink/40" aria-hidden />
        <h2 className="text-title font-semibold">Nothing saved yet</h2>
        <p className="max-w-[52ch] text-ink/65">
          Tap the heart on any experience to keep it here. Saved experiences stay on this device.
        </p>
        <Link href="/experiences" className={buttonVariants()}>
          Browse experiences
        </Link>
      </div>
    )
  }

  // Keep showing the previous list while a removal re-fetches, filtered to what's still saved.
  if (!loaded) return <CardGridSkeleton count={Math.min(ids.length, 8)} />
  const visible = loaded.items.filter((item) => ids.includes(item.id))

  return (
    <ExperienceGrid>
      {visible.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </ExperienceGrid>
  )
}
