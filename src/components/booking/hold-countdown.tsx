'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function HoldCountdown({ expiresAt }: { expiresAt: string }) {
  const router = useRouter()
  const deadline = new Date(expiresAt).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const timer = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [])

  const left = now === null ? null : Math.max(0, deadline - now)

  useEffect(() => {
    if (left === 0) router.refresh()
  }, [left, router])

  if (left === null) return null
  const minutes = Math.floor(left / 60_000)
  const seconds = Math.floor((left % 60_000) / 1000)

  return (
    <span className="font-semibold tabular-nums">
      {minutes}:{String(seconds).padStart(2, '0')}
    </span>
  )
}
