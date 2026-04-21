import { type HTMLAttributes } from 'react'
import { StatusDot } from '../status-dot'
import styles from './kpi-card.module.css'

type ChangeVariant = 'positive' | 'negative' | 'warning' | 'neutral'
type CardStatus = 'ok' | 'warning' | 'error' | 'neutral'

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric name (e.g. "Pending KYC reviews"). */
  readonly label: string
  /** Main metric value. Pre-format numbers (commas, units) before passing. */
  readonly value: string | number
  /** Delta string (e.g. `"+12% vs yesterday"`). Omit for point-in-time metrics. */
  readonly change?: string
  /** Drives delta color. `positive`/`negative` auto-interpret direction. */
  readonly changeVariant?: ChangeVariant
  /** Overall health of the metric. Adds a colored border + status dot. */
  readonly status?: CardStatus
  /** Optional footer link (e.g. "View details"). */
  readonly action?: { readonly label: string; readonly onClick: () => void }
  /** Render skeleton placeholder while data loads. */
  readonly loading?: boolean
}

/**
 * KPI summary card for dashboards. Pair with `KpiRow` to render a
 * responsive grid of metrics. Supports skeleton loading state.
 */

const STATUS_CLASS = {
  ok: styles['statusOk'],
  warning: styles['statusWarning'],
  error: styles['statusError'],
  neutral: undefined,
} as const

const CHANGE_CLASS = {
  positive: styles['changePositive'],
  negative: styles['changeNegative'],
  warning: styles['changeWarning'],
  neutral: styles['changeNeutral'],
} as const

const STATUS_TO_DOT = {
  ok: 'ok',
  warning: 'warning',
  error: 'error',
  neutral: 'inactive',
} as const

export function KpiCard({
  label,
  value,
  change,
  changeVariant = 'neutral',
  status = 'neutral',
  action,
  loading = false,
  className,
  ...props
}: KpiCardProps) {
  const cardClassNames = [
    styles['card'],
    STATUS_CLASS[status],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (loading) {
    return (
      <div className={cardClassNames} {...props}>
        <div className={`${styles['skeleton']} ${styles['skeletonLabel']}`} />
        <div className={`${styles['skeleton']} ${styles['skeletonValue']}`} />
        <div className={`${styles['skeleton']} ${styles['skeletonChange']}`} />
      </div>
    )
  }

  return (
    <div className={cardClassNames} {...props}>
      <span className={styles['label']}>{label}</span>
      <span className={styles['value']}>{value}</span>
      <div className={styles['footer']}>
        {change !== undefined ? (
          <span className={`${styles['change']} ${CHANGE_CLASS[changeVariant]}`}>
            {status !== 'neutral' && (
              <StatusDot status={STATUS_TO_DOT[status]} size="sm" />
            )}{' '}
            {change}
          </span>
        ) : status !== 'neutral' ? (
          <StatusDot status={STATUS_TO_DOT[status]} size="sm" />
        ) : (
          <span />
        )}
        {action !== undefined && (
          <button type="button" className={styles['action']} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
