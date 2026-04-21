import type { BadgeProps } from '../badge'

export type ReplayState =
  | { readonly phase: 'idle' }
  | { readonly phase: 'loading' }
  | { readonly phase: 'result'; readonly status: number; readonly success: boolean }

export const REPLAY_RESULT_DISPLAY_MS = 1800

export function getHttpStatusBadge(status: number): { readonly variant: BadgeProps['variant']; readonly label: string } {
  if (status >= 200 && status < 300) {
    return { variant: 'approved', label: `${status} OK` }
  }
  if (status >= 400 && status < 500) {
    return { variant: 'pending', label: `${status} Client Error` }
  }
  return { variant: 'critical', label: `${status} Server Error` }
}

export function formatOrdinal(n: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' }
  const suffix = n <= 3 ? suffixes[n] ?? 'th' : 'th'
  return `${n}${suffix}`
}

export function formatTimestamp(iso: string): { readonly date: string; readonly time: string } {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' })
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')

  return {
    date: `${day} ${month}`,
    time: `${h}:${m}:${s}.${ms}`,
  }
}

export function formatResponseTime(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`
}
