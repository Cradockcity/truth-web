import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ExperienceCard } from '@/components/experience/experience-card'
import { SiteHeader } from '@/components/site/header'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Input, Label } from '@/components/ui/input'
import { getFeaturedExperiences } from '@/lib/data/experiences'

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false },
}

const COLORS = [
  { name: 'Canvas', swatch: 'bg-canvas', light: '#F6F7F4', dark: '#0D0F0C', use: 'Page' },
  { name: 'Surface', swatch: 'bg-surface', light: '#ECEEE9', dark: '#171A15', use: 'Fields' },
  { name: 'Raised', swatch: 'bg-raised', light: '#E2E5DE', dark: '#21251E', use: 'Tags' },
  { name: 'Ink', swatch: 'bg-ink', light: '#121510', dark: '#F1EEE6', use: 'Text, actions' },
  { name: 'Jacaranda', swatch: 'bg-accent', light: '#6A4BAE', dark: '#A78BDB', use: 'Accent' },
  { name: 'Protea', swatch: 'bg-saved', light: '#D63D63', dark: '#E8577A', use: 'Saved' },
] as const

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-16 sm:px-6 lg:px-8">
        <Section title="Colour">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COLORS.map((color) => (
              <div key={color.name} className="flex flex-col gap-3">
                <div className={`h-24 rounded-media border border-ink/10 ${color.swatch}`} />
                <div>
                  <p className="font-semibold">{color.name}</p>
                  <p className="text-caption text-ink/60">
                    {color.use}. Light {color.light}, dark {color.dark}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type">
          <div className="flex flex-col gap-6">
            <p className="text-display font-display">Kruger at sunset</p>
            <p className="text-headline font-wide">Featured experiences</p>
            <p className="text-title font-semibold">Cultural Township Tour with Local Family</p>
            <p className="max-w-[60ch] text-lead text-ink/80">
              Hosted by people who know South Africa best, from township kitchens to Kruger at
              sunset.
            </p>
            <p className="max-w-[65ch] text-body text-ink/80">
              Spend an afternoon with a family in Langa, Cape Town&apos;s oldest township. Share a
              meal, hear the neighbourhood&apos;s history from the people who live it, and leave
              with recipes to try at home.
            </p>
            <p className="text-caption text-ink/60">Langa Township, 4 hours</p>
          </div>
        </Section>

        <Section title="Actions">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Book this experience</Button>
            <Button>Reserve</Button>
            <Button variant="secondary">Share</Button>
            <Button variant="ghost">
              View all <ArrowRight />
            </Button>
            <Button size="sm">Apply filters</Button>
            <Button disabled>Unavailable</Button>
          </div>
          <div className="relative mt-6 flex flex-wrap items-center gap-3 overflow-hidden rounded-media bg-[url(https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=1200)] bg-cover bg-center p-8">
            <Button variant="glass">On a photograph</Button>
            <Chip tone="glass">Adventure</Chip>
            <Chip tone="glass">
              <MapPin /> Hermanus
            </Chip>
          </div>
        </Section>

        <Section title="Chips">
          <div className="flex flex-wrap gap-3">
            <Chip>Food &amp; Drink</Chip>
            <Chip>Up to 8 people</Chip>
            <Chip tone="accent">
              <Sparkles /> Recommended by Thandi
            </Chip>
          </div>
        </Section>

        <Section title="Fields">
          <form className="grid max-w-xl gap-5">
            <div className="grid gap-2">
              <Label htmlFor="sg-name">Full name</Label>
              <Input id="sg-name" placeholder="Thandi Nkosi" autoComplete="name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sg-email">Email</Label>
              <Input
                id="sg-email"
                type="email"
                defaultValue="thandi@"
                aria-invalid
                aria-describedby="sg-email-error"
              />
              <p id="sg-email-error" className="text-caption text-danger">
                Enter an email address like name@example.com.
              </p>
            </div>
          </form>
        </Section>

        <Section title="Experience cards">
          <Suspense fallback={<p className="text-ink/60">Loading experiences</p>}>
            <Cards />
          </Suspense>
        </Section>
      </main>
    </>
  )
}

async function Cards() {
  const experiences = await getFeaturedExperiences(6)
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="border-b border-ink/10 pb-4 text-title font-wide">{title}</h2>
      {children}
    </section>
  )
}
