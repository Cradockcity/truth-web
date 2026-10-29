'use client'

import { ShieldCheck } from 'lucide-react'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { adminAuth, type AdminSignInState } from '@/lib/actions/admin-auth'

export function AdminSignInForm({
  initialStep,
  notice,
}: {
  initialStep: 'password' | 'code'
  notice?: string
}) {
  const [state, action, pending] = useActionState<AdminSignInState, FormData>(adminAuth, {
    step: initialStep,
    error: notice,
  })

  if (state.step === 'code') {
    return (
      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="intent" value="code" />
        <div className="flex items-start gap-3 text-ink/75">
          <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>Enter the 6-digit code from your authenticator app.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="admin-code">Authenticator code</Label>
          <Input
            id="admin-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            autoFocus
            required
            placeholder="123456"
            className="text-lead tracking-[0.3em] tabular-nums"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? 'admin-code-error' : undefined}
          />
          {state.error ? (
            <p id="admin-code-error" className="text-caption text-danger">
              {state.error}
            </p>
          ) : null}
        </div>
        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? 'Checking…' : 'Verify and continue'}
        </Button>
      </form>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="intent" value="password" />
      <div className="grid gap-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? (
        <p role="alert" className="rounded-control bg-surface px-4 py-3 text-caption text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Continue'}
      </Button>
    </form>
  )
}
