'use client'

import { ImagePlus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { discardUpload, uploadImage } from '@/lib/upload-image'

// One photo, uploaded on choosing and saved with the rest of the form (hidden input).
export function ImageField({
  name,
  label,
  folder,
  initial,
  shape = 'round',
  hint,
}: {
  name: string
  label: string
  folder: 'hosts' | 'creators'
  initial: string | null
  shape?: 'round' | 'wide'
  hint?: string
}) {
  const [url, setUrl] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputId = `${name}-file`

  // A photo uploaded in this visit but replaced before saving is never used: delete it.
  function replace(next: string | null) {
    if (url && url !== initial) discardUpload(url)
    setUrl(next)
  }

  async function upload(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError(null)
    const result = await uploadImage(file, folder)
    setUploading(false)
    if ('error' in result) setError(result.error)
    else replace(result.url)
  }

  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input type="hidden" name={name} value={url ?? ''} />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'relative shrink-0 overflow-hidden bg-surface',
            shape === 'round' ? 'size-20 rounded-full' : 'aspect-[16/9] w-48 rounded-control',
            uploading && 'animate-pulse',
          )}
        >
          {url ? <Image src={url} alt="" fill sizes="12rem" className="object-cover" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-control px-4 text-caption font-semibold hover:border-ink/30 has-[:focus-visible]:border-accent"
          >
            <ImagePlus className="size-4" aria-hidden />
            {uploading ? 'Uploading…' : url ? 'Replace' : 'Upload'}
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              className="sr-only"
              onChange={(event) => {
                void upload(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </label>
          {url ? (
            <Button variant="ghost" size="sm" onClick={() => replace(null)}>
              <Trash2 /> Remove
            </Button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : (
        <p className="text-caption text-ink/50">
          {hint ?? 'JPG, PNG or WebP, up to 2 MB.'} Saved when you save the form.
        </p>
      )}
    </div>
  )
}
