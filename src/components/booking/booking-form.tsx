'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { type BookingFormState, createBooking } from '@/lib/actions/booking'

export function BookingForm({
  experienceId,
  date,
  time,
  guests,
  creator,
  totalLabel,
}: {
  experienceId: string
  date: string
  time: string
  guests: number
  creator?: string
  totalLabel: string
}) {
  const [state, action, pending] = useActionState<BookingFormState, FormData>(createBooking, {})
  const errors = state.fieldErrors ?? {}

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="experienceId" value={experienceId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />
      <input type="hidden" name="guests" value={guests} />
      {creator ? <input type="hidden" name="creator" value={creator} /> : null}

      <Field id="name" label="Full name" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          placeholder="Thandi Nkosi"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
      </Field>

      <Field
        id="email"
        label="Email"
        hint="Your host uses this to reach you about the booking."
        error={errors.email}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          placeholder="thandi@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
        />
      </Field>

      <Field
        id="phone"
        label="Phone (optional)"
        hint="So your host can reach you on the day."
        error={errors.phone}
      >
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          defaultValue={state.values?.phone}
          placeholder="+27 82 123 4567"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
        />
      </Field>

      {state.formError ? (
        <p role="alert" className="rounded-control bg-surface px-4 py-3 text-caption text-danger">
          {state.formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Reserving your seats…' : `Reserve for ${totalLabel}`}
      </Button>
      <p className="text-center text-caption text-ink/60">
        Your seats are held for 20 minutes while you pay. You won&apos;t be charged yet.
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-ink/55">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
