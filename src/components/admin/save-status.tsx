import { Label } from '@/components/ui/input'
import type { FormState } from '@/lib/admin/form'

export function SaveStatus({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-caption text-danger">
        {state.error}
      </p>
    )
  }
  if (state.saved) {
    return (
      <p role="status" className="text-caption text-success">
        {state.saved}
      </p>
    )
  }
  return null
}

export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5 rounded-sheet border border-line bg-control p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-title font-semibold">{title}</h2>
        {description ? <p className="text-caption text-ink/60">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-caption text-ink/50">{hint}</p> : null}
    </div>
  )
}
