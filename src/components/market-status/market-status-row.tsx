import { type HTMLAttributes } from 'react'
import { MarketTag } from '../market-tag'
import { StatusDot } from '../status-dot'
import styles from './market-status-row.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type MarketStatusValue = 'live' | 'beta' | 'degraded' | 'outage' | 'maintenance'

export interface MarketStatusRowProps extends HTMLAttributes<HTMLDivElement> {
  readonly market: Market
  readonly status: MarketStatusValue
  readonly checks?: ReadonlyArray<{ readonly name: string; readonly ok: boolean }>
  readonly lastChecked?: string
  readonly onClick?: () => void
}

const STATUS_DOT_MAP = {
  live: 'live',
  beta: 'pending',
  degraded: 'warning',
  outage: 'error',
  maintenance: 'inactive',
} as const

const STATUS_LABELS: Record<MarketStatusValue, string> = {
  live: 'Live',
  beta: 'Beta',
  degraded: 'Degraded',
  outage: 'Outage',
  maintenance: 'Maintenance',
}

const MAX_CHECK_DOTS = 5

export function MarketStatusRow({
  market,
  status,
  checks,
  lastChecked,
  onClick,
  className,
  ...props
}: MarketStatusRowProps) {
  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const visibleChecks = checks?.slice(0, MAX_CHECK_DOTS)
  const overflowCount = checks !== undefined && checks.length > MAX_CHECK_DOTS
    ? checks.length - MAX_CHECK_DOTS
    : 0

  return (
    <div
      className={rowClassNames}
      role={onClick !== undefined ? 'button' : undefined}
      tabIndex={onClick !== undefined ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick !== undefined ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      {...props}
    >
      <div className={styles['market']}>
        <MarketTag market={market} size="sm" />
      </div>

      {visibleChecks !== undefined ? (
        <div className={styles['checks']}>
          {visibleChecks.map((check) => (
            <span
              key={check.name}
              className={`${styles['checkDot']} ${check.ok ? styles['checkOk'] : styles['checkFail']}`}
              title={check.name}
            />
          ))}
          {overflowCount > 0 && (
            <span className={styles['moreChecks']}>+{overflowCount}</span>
          )}
        </div>
      ) : (
        <div className={styles['spacer']} />
      )}

      <div className={styles['statusSection']}>
        <StatusDot status={STATUS_DOT_MAP[status]} size="sm" pulse={status === 'live'} />
        <span className={styles['statusText']}>{STATUS_LABELS[status]}</span>
        {lastChecked !== undefined && (
          <span className={styles['lastChecked']}>{lastChecked}</span>
        )}
      </div>
    </div>
  )
}
