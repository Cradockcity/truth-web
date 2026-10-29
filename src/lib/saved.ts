'use client'

import { useSyncExternalStore } from 'react'

export const SAVED_STORAGE_KEY = 'truth-saved'
const CHANGE_EVENT = 'truth-saved-change'
const EMPTY: readonly string[] = []

let cachedRaw: string | null = null
let cachedIds: readonly string[] = EMPTY

function read(): readonly string[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(SAVED_STORAGE_KEY)
  } catch {
    return EMPTY
  }
  // useSyncExternalStore needs a stable reference while the stored value is unchanged.
  if (raw === cachedRaw) return cachedIds
  cachedRaw = raw
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : EMPTY
  } catch {
    cachedIds = EMPTY
  }
  return cachedIds
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function write(ids: readonly string[]) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage blocked: the heart still toggles for this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function toggleSaved(id: string) {
  const ids = read()
  write(ids.includes(id) ? ids.filter((saved) => saved !== id) : [id, ...ids])
}

export function useSavedIds() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function useIsSaved(id: string) {
  return useSavedIds().includes(id)
}
