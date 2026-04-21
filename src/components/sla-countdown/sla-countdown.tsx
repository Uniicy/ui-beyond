import { useState, useEffect, type HTMLAttributes } from 'react'
import { ProgressBar } from '../progress-bar'
import { StatusDot } from '../status-dot'
import styles from './sla-countdown.module.css'

type SlaMode = 'inline' | 'full'

export interface SlaCountdownProps extends HTMLAttributes<HTMLDivElement> {
  readonly deadline: Date | string
  readonly createdAt: Date | string
  readonly paused?: boolean
  readonly mode?: SlaMode
}

function toMs(d: Date | string): number {
  return new Date(d).getTime()
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(Math.abs(ms) / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatDeadline(d: Date | string): string {
  const date = new Date(d)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

interface SlaState {
  readonly percentElapsed: number
  readonly remainingMs: number
  readonly breached: boolean
}

function computeState(createdAtMs: number, deadlineMs: number, now: number): SlaState {
  const totalMs = deadlineMs - createdAtMs
  const elapsedMs = now - createdAtMs
  const percentElapsed = totalMs > 0
    ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))
    : 100
  const remainingMs = deadlineMs - now

  return {
    percentElapsed,
    remainingMs,
    breached: remainingMs <= 0,
  }
}

export function SlaCountdown({
  deadline,
  createdAt,
  paused = false,
  mode = 'inline',
  className,
  ...props
}: SlaCountdownProps) {
  const createdAtMs = toMs(createdAt)
  const deadlineMs = toMs(deadline)

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (paused) return

    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [paused])

  const state = computeState(createdAtMs, deadlineMs, now)

  const barHeight = mode === 'inline' ? 'xs' : 'sm'

  const derived = paused
    ? { intent: 'neutral' as const, dotStatus: 'inactive' as const, timeClass: styles['timePaused'] ?? '', dotPulse: false, barStriped: false }
    : state.breached
    ? { intent: 'danger' as const, dotStatus: 'error' as const, timeClass: styles['timeDanger'] ?? '', dotPulse: false, barStriped: true }
    : state.percentElapsed > 80
    ? { intent: 'danger' as const, dotStatus: 'error' as const, timeClass: styles['timeDanger'] ?? '', dotPulse: true, barStriped: false }
    : state.percentElapsed >= 60
    ? { intent: 'warning' as const, dotStatus: 'warning' as const, timeClass: styles['timeWarning'] ?? '', dotPulse: false, barStriped: false }
    : { intent: 'success' as const, dotStatus: 'ok' as const, timeClass: '', dotPulse: false, barStriped: false }

  const { intent, dotStatus, timeClass, dotPulse, barStriped } = derived

  const barValue = paused ? state.percentElapsed : (state.breached ? 100 : state.percentElapsed)

  let timeText: string
  if (paused) {
    timeText = 'Under review'
  } else if (state.breached) {
    timeText = `Overdue by ${formatDuration(state.remainingMs)}`
  } else {
    timeText = `${formatDuration(state.remainingMs)} remaining`
  }

  const wrapperClassNames = [
    styles['wrapper'],
    styles[mode],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      <ProgressBar
        value={barValue}
        height={barHeight}
        intent={intent}
        striped={barStriped}
        animated={false}
      />
      <div className={styles['statusRow']}>
        <StatusDot status={dotStatus} size="sm" pulse={dotPulse} />
        <span className={`${styles['time']} ${timeClass}`}>{timeText}</span>
      </div>
      <span className={styles['deadline']}>Due {formatDeadline(deadline)}</span>
    </div>
  )
}
