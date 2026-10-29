'use client'

import { MailCheck } from 'lucide-react'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { sendSignInLink, type SignInState, signInWithGoogle } from '@/lib/actions/auth'

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendSignInLink, {})

  if (state.sentTo) {
    return (
      <div className="flex flex-col gap-3" role="status">
        <MailCheck className="size-8" aria-hidden />
        <h2 className="text-title font-semibold">Check your email</h2>
        <p className="text-ink/75">
          We sent a sign-in link to <strong className="text-ink">{state.sentTo}</strong>. Open it on
          this device to finish signing in. It expires in an hour.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          <GoogleMark /> Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-4 text-caption text-ink/50">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={action} noValidate className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <div className="grid gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.email}
            placeholder="thandi@example.com"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? 'signin-error' : undefined}
          />
          {state.error ? (
            <p id="signin-error" className="text-caption text-danger">
              {state.error}
            </p>
          ) : null}
        </div>
        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? 'Sending link…' : 'Email me a sign-in link'}
        </Button>
      </form>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.4 3.62v3h3.88c2.27-2.1 3.57-5.18 3.57-8.65z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3a7.2 7.2 0 0 1-10.73-3.78H1.32v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.33 14.32a7.2 7.2 0 0 1 0-4.64v-3.1H1.32a12 12 0 0 0 0 10.84z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A12 12 0 0 0 1.32 6.58l4.01 3.1A7.17 7.17 0 0 1 12 4.77z"
      />
    </svg>
  )
}
