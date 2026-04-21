import { Avatar } from '../avatar'
import { StatusDot } from '../status-dot'
import styles from './oasis-log-row.module.css'

export interface OasisLogEntry {
  readonly id: string
  readonly checkedAt: string
  readonly player: { readonly id: string; readonly name: string }
  readonly result: 'clear' | 'hit'
  readonly oasisRef?: string
  readonly responseTimeMs: number
  readonly sessionOutcome: 'allowed' | 'blocked'
  readonly market: 'de'
  readonly checkId: string
}

export interface OasisLogRowProps {
  readonly entry: OasisLogEntry
  readonly onViewPlayer?: (playerId: string) => void
  readonly className?: string
}

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  }
}

function formatResponseTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function responseClass(ms: number): string {
  if (ms < 500) return styles['respFast'] ?? ''
  if (ms <= 2000) return styles['respMedium'] ?? ''
  return styles['respSlow'] ?? ''
}

export function OasisLogRow({ entry: e, onViewPlayer, className }: OasisLogRowProps) {
  const { date, time } = formatTimestamp(e.checkedAt)
  const isHit = e.result === 'hit'

  const rowClassNames = [
    styles['row'],
    isHit ? styles['hit'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rowClassNames}>
      <div className={styles['tsCell']}>
        <span className={styles['tsDate']}>{date}</span>
        <span className={styles['tsTime']}>{time}</span>
      </div>

      <div className={styles['playerCell']}>
        <Avatar name={e.player.name} size="sm" />
        {onViewPlayer !== undefined ? (
          <button type="button" className={styles['playerLink']} onClick={() => onViewPlayer(e.player.id)}>
            {e.player.name}
          </button>
        ) : (
          <span className={styles['playerName']}>{e.player.name}</span>
        )}
      </div>

      <div className={styles['resultCell']}>
        <div className={styles['resultRow']}>
          <StatusDot status={isHit ? 'error' : 'live'} size="sm" pulse={false} />
          <span className={`${styles['resultLabel']} ${isHit ? styles['resultHit'] : styles['resultClear']}`}>
            {isHit ? 'Hit' : 'Clear'}
          </span>
        </div>
        {isHit && e.oasisRef !== undefined && (
          <span className={styles['oasisRef']}>{e.oasisRef}</span>
        )}
      </div>

      <span className={`${styles['response']} ${responseClass(e.responseTimeMs)}`}>
        {formatResponseTime(e.responseTimeMs)}
      </span>

      <span className={`${styles['session']} ${e.sessionOutcome === 'allowed' ? styles['sessionAllowed'] : styles['sessionBlocked']}`}>
        {e.sessionOutcome === 'allowed' ? 'Allowed' : 'Blocked'}
      </span>

      <span className={styles['checkId']}>{e.checkId}</span>
    </div>
  )
}
