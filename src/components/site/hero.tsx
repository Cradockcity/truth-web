import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const HERO_IMAGE =
  'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=2400'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden scheme-dark light:m-3 light:min-h-[calc(100svh-1.5rem)] light:rounded-sheet">
      <Image
        src={HERO_IMAGE}
        alt="Table Mountain above the V&A Waterfront in Cape Town"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_40%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-night)_2%,rgb(13_15_12/0.72)_32%,rgb(13_15_12/0.15)_65%,rgb(13_15_12/0.45)_100%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-40 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <h1 className="max-w-[14ch] animate-rise text-display font-display text-balance text-ink">
          Unforgettable experiences
        </h1>
        <div className="mt-8 flex animate-rise flex-col gap-6 [animation-delay:150ms] sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[46ch] text-lead text-ink/80">
            Hosted by people who know South Africa best, from township kitchens to Kruger at sunset.
          </p>
          <Link href="/experiences" className={buttonVariants({ size: 'lg' })}>
            Browse experiences
          </Link>
        </div>
      </div>
    </section>
  )
}
