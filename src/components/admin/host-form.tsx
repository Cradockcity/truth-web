'use client'

import { startTransition, useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { saveHost } from '@/lib/actions/admin-people'
import type { FormState } from '@/lib/admin/form'
import type { EditableHost } from '@/lib/admin/people'

import { ImageField } from './image-field'
import { Field, SaveStatus } from './save-status'

export function HostForm({ host }: { host: EditableHost | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveHost, {})
  const h = host

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
      {h ? <input type="hidden" name="id" value={h.id} /> : null}

      <ImageField name="avatarUrl" label="Photo" folder="hosts" initial={h?.avatarUrl ?? null} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" required maxLength={80} defaultValue={h?.name} />
        </Field>
        <Field label="Email" htmlFor="email" hint="Only admins see this.">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            defaultValue={h?.email}
          />
        </Field>
        <Field label="Location" htmlFor="location">
          <Input
            id="location"
            name="location"
            maxLength={80}
            defaultValue={h?.location}
            placeholder="Stellenbosch"
          />
        </Field>
        <Field label="Host since" htmlFor="joinedDate">
          <Input id="joinedDate" name="joinedDate" type="date" defaultValue={h?.joinedDate} />
        </Field>
        <Field
          label="Revenue share (%)"
          htmlFor="revenueShare"
          hint="The host's share of each booking. Only admins see this."
        >
          <Input
            id="revenueShare"
            name="revenueShare"
            inputMode="decimal"
            defaultValue={h?.revenueShare ?? ''}
            placeholder="15"
            className="sm:w-32"
          />
        </Field>
      </div>

      <Field label="About the host" htmlFor="bio" hint="Shown on their experience pages.">
        <Textarea id="bio" name="bio" maxLength={1000} defaultValue={h?.bio} />
      </Field>

      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Languages" htmlFor="languages" hint="Separate with commas.">
          <Input
            id="languages"
            name="languages"
            defaultValue={h?.languages.join(', ')}
            placeholder="English, Afrikaans"
          />
        </Field>
        <Field label="Specialties" htmlFor="specialties" hint="Separate with commas.">
          <Input id="specialties" name="specialties" defaultValue={h?.specialties.join(', ')} />
        </Field>
        <Field label="Badges" htmlFor="verificationBadges" hint="Separate with commas.">
          <Input
            id="verificationBadges"
            name="verificationBadges"
            defaultValue={h?.verificationBadges.join(', ')}
            placeholder="ID verified, First aid"
          />
        </Field>
      </div>

      {/* Plain text fields: the save turns a handle like @name into the full link. */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Instagram" htmlFor="socialInstagram">
          <Input
            id="socialInstagram"
            name="socialInstagram"
            autoCapitalize="none"
            spellCheck={false}
            defaultValue={h?.socialInstagram}
            placeholder="@handle or link"
          />
        </Field>
        <Field label="X (Twitter)" htmlFor="socialTwitter">
          <Input
            id="socialTwitter"
            name="socialTwitter"
            autoCapitalize="none"
            spellCheck={false}
            defaultValue={h?.socialTwitter}
            placeholder="@handle or link"
          />
        </Field>
        <Field label="Website" htmlFor="socialWebsite">
          <Input
            id="socialWebsite"
            name="socialWebsite"
            autoCapitalize="none"
            spellCheck={false}
            defaultValue={h?.socialWebsite}
            placeholder="example.co.za"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : h ? 'Save host' : 'Create host'}
        </Button>
        <SaveStatus state={state} />
      </div>
    </form>
  )
}
