'use client'

import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { savePhotos } from '@/lib/actions/admin-experiences'
import type { FormState } from '@/lib/admin/form'
import { cn } from '@/lib/cn'
import { discardUpload, uploadImage } from '@/lib/upload-image'

import { SaveStatus } from './save-status'

const MAX_PHOTOS = 12

export function PhotoManager({
  experienceId,
  initial,
}: {
  experienceId: string
  initial: string[]
}) {
  const [urls, setUrls] = useState(initial)
  const [state, setState] = useState<FormState>({})
  const [uploading, setUploading] = useState(0)
  const [saving, startSaving] = useTransition()
  const input = useRef<HTMLInputElement>(null)
  const dirty = urls.join('|') !== initial.join('|')

  async function upload(files: FileList | null) {
    if (!files?.length) return
    const room = MAX_PHOTOS - urls.length
    const chosen = [...files].slice(0, room)
    const problems: string[] = []
    setUploading(chosen.length)
    setState({})

    for (const file of chosen) {
      const result = await uploadImage(file, 'experiences')
      if ('error' in result) problems.push(result.error)
      else setUrls((current) => [...current, result.url])
      setUploading((count) => count - 1)
    }

    if (files.length > room) problems.push(`Only ${MAX_PHOTOS} photos fit; the rest were skipped.`)
    if (problems.length) setState({ error: problems.join(' ') })
    if (input.current) input.current.value = ''
  }

  function remove(url: string) {
    setUrls((current) => current.filter((item) => item !== url))
    // Saved photos are only deleted from storage when the change is saved.
    if (!initial.includes(url)) discardUpload(url)
  }

  function move(index: number, by: -1 | 1) {
    setUrls((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      if (item) next.splice(index + by, 0, item)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((url, index) => (
          <li key={url} className="flex flex-col gap-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-control bg-surface">
              <Image src={url} alt="" fill sizes="16rem" className="object-cover" />
              {index === 0 ? (
                <span className="absolute top-2 left-2 rounded-full glass px-2.5 py-0.5 text-caption">
                  Cover
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <IconButton
                  label="Move earlier"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowLeft />
                </IconButton>
                <IconButton
                  label="Move later"
                  disabled={index === urls.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowRight />
                </IconButton>
              </div>
              <IconButton label="Remove photo" onClick={() => remove(url)}>
                <Trash2 />
              </IconButton>
            </div>
          </li>
        ))}
        {urls.length < MAX_PHOTOS ? (
          <li>
            <label
              className={cn(
                'flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-control border border-dashed border-ink/25 text-caption text-ink/60 transition-colors hover:border-ink/50 hover:text-ink',
                uploading > 0 && 'pointer-events-none animate-pulse',
              )}
            >
              <ImagePlus className="size-6" aria-hidden />
              {uploading > 0 ? `Uploading ${uploading}…` : 'Add photos'}
              <input
                ref={input}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(event) => upload(event.target.files)}
              />
            </label>
          </li>
        ) : null}
      </ul>

      <p className="text-caption text-ink/55">
        The first photo is the cover. JPG, PNG or WebP, up to 2 MB each, at most {MAX_PHOTOS}.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          disabled={!dirty || saving || uploading > 0}
          onClick={() =>
            startSaving(async () => {
              const result = await savePhotos({ id: experienceId, urls })
              setState(result)
            })
          }
        >
          {saving ? 'Saving…' : 'Save photos'}
        </Button>
        {dirty && !saving ? (
          <span className="text-caption text-ink/55">Unsaved changes</span>
        ) : null}
        <SaveStatus state={state} />
      </div>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 cursor-pointer place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/8 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:size-4"
    >
      {children}
    </button>
  )
}
