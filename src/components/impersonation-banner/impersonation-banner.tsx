import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './impersonation-banner.module.css'

export interface ImpersonationBannerProps {
  readonly orgName: string
  readonly agentName: string
  readonly sessionDurationSeconds?: number
  readonly startedAt: string
  readonly onEndSession: () => void
  readonly onSessionExpired: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function timerClass(remaining: number): string {
  if (remaining < 60) return styles['timerBlink'] ?? ''
  if (remaining <= 300) return styles['timerYellow'] ?? ''
  return styles['timerWhite'] ?? ''
}

export function ImpersonationBanner({
  orgName,
  agentName,
  sessionDurationSeconds = 1800,
  startedAt,
  onEndSession,
  onSessionExpired,
}: ImpersonationBannerProps) {
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    return Math.max(0, sessionDurationSeconds - elapsed)
  })
  const expiredRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
      const r = Math.max(0, sessionDurationSeconds - elapsed)
      setRemaining(r)
      if (r === 0 && !expiredRef.current) {
        expiredRef.current = true
        setTimeout(() => onSessionExpired(), 1000)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt, sessionDurationSeconds, onSessionExpired])

  const banner = (
    <div className={styles['banner']}>
      <div className={styles['left']}>
        <span className={styles['warnIcon']}>{'\u26A0'}</span>
        <span className={styles['saLabel']}>Super Admin</span>
        <span className={styles['divider']}>|</span>
        <span className={styles['impersonating']}>Impersonating {orgName} as {agentName}</span>
      </div>
      <div className={styles['centre']}>
        <span className={`${styles['timer']} ${timerClass(remaining)}`}>
          {remaining === 0 ? 'Session expired' : formatTime(remaining)}
        </span>
        {remaining > 0 && <span className={styles['remainingLabel']}>remaining</span>}
      </div>
      <button type="button" className={styles['endBtn']} onClick={onEndSession}>End session</button>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(banner, document.body)
}
