'use client'

import { startTransition, useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { saveCreator } from '@/lib/actions/admin-people'
import type { FormState } from '@/lib/admin/form'
import type { EditableCreator } from '@/lib/admin/people'

import { ImageField } from './image-field'
import { Field, SaveStatus } from './save-status'

// Plain text fields: the save turns a handle like @name into the full link.
const SOCIALS = [
  ['socialInstagram', 'Instagram', '@handle or link'],
  ['socialTiktok', 'TikTok', '@handle or link'],
  ['socialYoutube', 'YouTube', '@handle or link'],
  ['socialWebsite', 'Website', 'example.co.za'],
] as const

export function CreatorForm({ creator }: { creator: EditableCreator | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCreator, {})
  const c = creator

  return (
    // Submitted by hand so a failed save doesn't reset the fields (see experience-details-form).
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        startTransition(() => action(data))
      }}
      className="flex flex-col gap-5"
    >
      {c ? <input type="hidden" name="id" value={c.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <ImageField
          name="avatarUrl"
          label="Profile photo"
          folder="creators"
          initial={c?.avatarUrl ?? null}
        />
        <ImageField
          name="coverUrl"
          label="Cover photo"
          folder="creators"
          shape="wide"
          initial={c?.coverUrl ?? null}
          hint="A wide photo for the top of their page. JPG, PNG or WebP, up to 2 MB."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" required maxLength={80} defaultValue={c?.name} />
        </Field>
        <Field
          label="Web address"
          htmlFor="slug"
          hint="Their page is /creators/ followed by this. Changing it breaks old links."
        >
          <Input
            id="slug"
            name="slug"
            required
            maxLength={80}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and dashes, like jane-doe"
            defaultValue={c?.slug}
            placeholder="jane-doe"
          />
        </Field>
        <Field label="Location" htmlFor="location">
          <Input
            id="location"
            name="location"
            maxLength={80}
            defaultValue={c?.location}
            placeholder="Cape Town"
          />
        </Field>
        <Field label="Followers" htmlFor="followers" hint="As shown on their page, like 120K.">
          <Input id="followers" name="followers" maxLength={20} defaultValue={c?.followers} />
        </Field>
        <Field
          label="Creator's share (%)"
          htmlFor="revenueShare"
          hint="Of the experience price of bookings they refer, paid from Truth's commission. Only admins see this."
        >
          <Input
            id="revenueShare"
            name="revenueShare"
            inputMode="decimal"
            defaultValue={c?.revenueShare ?? ''}
            placeholder="5"
            className="sm:w-32"
          />
        </Field>
      </div>

      <Field label="Signature quote" htmlFor="quote">
        <Input id="quote" name="quote" maxLength={300} defaultValue={c?.quote} />
      </Field>
      <Field label="About the creator" htmlFor="bio">
        <Textarea id="bio" name="bio" maxLength={1000} defaultValue={c?.bio} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tags" htmlFor="tags" hint="Separate with commas.">
          <Input
            id="tags"
            name="tags"
            defaultValue={c?.tags.join(', ')}
            placeholder="Foodie, Wine lover"
          />
        </Field>
        <Field label="Featured in" htmlFor="featuredIn" hint="Separate with commas.">
          <Input id="featuredIn" name="featuredIn" defaultValue={c?.featuredIn.join(', ')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {SOCIALS.map(([name, label, placeholder]) => (
          <Field key={name} label={label} htmlFor={name}>
            <Input
              id={name}
              name={name}
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={c?.[name]}
              placeholder={placeholder}
            />
          </Field>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : c ? 'Save creator' : 'Create creator'}
        </Button>
        <SaveStatus state={state} />
      </div>
    </form>
  )
}
