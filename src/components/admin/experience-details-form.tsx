'use client'

import { startTransition, useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { saveExperienceDetails } from '@/lib/actions/admin-experiences'
import type { FormState } from '@/lib/admin/form'
import type { EditableExperience } from '@/lib/admin/experiences'

import { Field, SaveStatus } from './save-status'

export function ExperienceDetailsForm({
  experience,
  hosts,
  categories,
}: {
  experience: EditableExperience | null
  hosts: { id: string; name: string }[]
  categories: string[]
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveExperienceDetails, {})
  const e = experience

  return (
    // Submitted by hand rather than via `action`, so React doesn't reset the fields
    // (and lose the admin's edits) when the save returns an error.
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        startTransition(() => action(data))
      }}
      className="flex flex-col gap-5"
    >
      {e ? <input type="hidden" name="id" value={e.id} /> : null}

      <Field label="Title" htmlFor="title">
        <Input id="title" name="title" required defaultValue={e?.title} maxLength={140} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <Input
            id="category"
            name="category"
            required
            list="category-options"
            defaultValue={e?.category}
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
        <Field label="Location" htmlFor="location" hint="Shown on cards and used for search.">
          <Input
            id="location"
            name="location"
            required
            defaultValue={e?.location}
            placeholder="Cape Town"
          />
        </Field>
        <Field label="Price per person (R)" htmlFor="price">
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            required
            defaultValue={e?.price ?? undefined}
          />
        </Field>
        <Field label="Host" htmlFor="hostId">
          <Select id="hostId" name="hostId" defaultValue={e?.hostId ?? ''}>
            <option value="">No host yet</option>
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Duration" htmlFor="duration">
          <Input id="duration" name="duration" defaultValue={e?.duration} placeholder="4 hours" />
        </Field>
        <Field label="Group size" htmlFor="groupSize" hint="Write it as “Up to 8 people”.">
          <Input
            id="groupSize"
            name="groupSize"
            defaultValue={e?.groupSize}
            placeholder="Up to 8 people"
          />
        </Field>
      </div>

      <Field
        label="Short description"
        htmlFor="description"
        hint="One or two sentences for previews and Google."
      >
        <Textarea
          id="description"
          name="description"
          defaultValue={e?.description}
          maxLength={300}
          className="min-h-20"
        />
      </Field>
      <Field label="Full description" htmlFor="longDescription">
        <Textarea
          id="longDescription"
          name="longDescription"
          defaultValue={e?.longDescription}
          className="min-h-40"
        />
      </Field>

      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Highlights" htmlFor="highlights" hint="One per line.">
          <Textarea id="highlights" name="highlights" defaultValue={e?.highlights.join('\n')} />
        </Field>
        <Field label="What's included" htmlFor="includes" hint="One per line.">
          <Textarea id="includes" name="includes" defaultValue={e?.includes.join('\n')} />
        </Field>
        <Field label="What to bring" htmlFor="whatToBring" hint="One per line.">
          <Textarea id="whatToBring" name="whatToBring" defaultValue={e?.whatToBring.join('\n')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Meeting point" htmlFor="meetingPoint">
          <Input id="meetingPoint" name="meetingPoint" defaultValue={e?.meetingPoint} />
        </Field>
        <Field label="Cancellation policy" htmlFor="cancellationPolicy">
          <Input
            id="cancellationPolicy"
            name="cancellationPolicy"
            defaultValue={e?.cancellationPolicy}
            placeholder="Free cancellation up to 24 hours before"
          />
        </Field>
        <Field label="Accessibility" htmlFor="accessibility">
          <Input id="accessibility" name="accessibility" defaultValue={e?.accessibility} />
        </Field>
        <Field label="Google Place ID (optional)" htmlFor="googlePlaceId">
          <Input id="googlePlaceId" name="googlePlaceId" defaultValue={e?.googlePlaceId} />
        </Field>
      </div>

      {e ? (
        <label className="flex items-start gap-3 rounded-control border border-line px-4 py-3">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={e.isActive}
            className="mt-1 accent-current"
          />
          <span className="flex flex-col">
            <span className="font-medium">Show on the site</span>
            <span className="text-caption text-ink/60">
              Guests can find and book it. Needs at least one photo.
            </span>
          </span>
        </label>
      ) : (
        <p className="text-caption text-ink/60">
          New experiences start hidden. Add photos and a schedule next, then switch it on.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : e ? 'Save details' : 'Create experience'}
        </Button>
        <SaveStatus state={state} />
      </div>
    </form>
  )
}
