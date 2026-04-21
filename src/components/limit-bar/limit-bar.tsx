import { type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import { ProgressBar } from '../progress-bar'
import styles from './limit-bar.module.css'

type LimitType = 'deposit' | 'loss' | 'session_time' | 'session_count'
type LimitPeriod = 'daily' | 'weekly' | 'monthly'
type LimitSource = 'player' | 'operator' | 'lugas' | 'oasis'

export interface LimitBarProps extends HTMLAttributes<HTMLDivElement> {
  readonly limitType: LimitType
  readonly period: LimitPeriod
  readonly currentAmount: number
  readonly limitAmount: number
  readonly currency?: string
  readonly source: LimitSource
  readonly periodResetAt: string
  readonly canEdit?: boolean
}

const TYPE_LABELS: Record<LimitType, string> = {
  deposit: 'deposit',
  loss: 'loss',
  session_time: 'session time',
  session_count: 'session count',
}

const PERIOD_LABELS: Record<LimitPeriod, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const SOURCE_CONFIG: Record<LimitSource, { label: string; variant: string }> = {
  lugas: { label: 'LUGAS \u00b7 enforced', variant: 'rejected' },
  oasis: { label: 'OASIS \u00b7 enforced', variant: 'rejected' },
  operator: { label: 'Operator-set', variant: 'pending' },
  player: { label: 'Self-set', variant: 'low' },
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

function formatValue(amount: number, limitType: LimitType, currency?: string): string {
  if (limitType === 'session_time') {
    const h = Math.floor(amount / 60)
    const m = amount % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }
  if (limitType === 'session_count') {
    return String(amount)
  }
  const sym = currency !== undefined ? CURRENCY_SYMBOLS[currency] : undefined
  const formatted = amount.toLocaleString('en', { minimumFractionDigits: 0 })
  return sym !== undefined ? `${sym}${formatted}` : `${currency ?? ''} ${formatted}`
}

function formatResetDate(iso: string): string {
  const d = new Date(iso)
  return `Resets ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
}

export function LimitBar({
  limitType,
  period,
  currentAmount,
  limitAmount,
  currency,
  source,
  periodResetAt,
  canEdit = false,
  className,
  ...props
}: LimitBarProps) {
  const percentUsed = limitAmount > 0
    ? Math.min(120, (currentAmount / limitAmount) * 100)
    : 0
  const isBreached = currentAmount > limitAmount
  const isLocked = source === 'lugas' || source === 'oasis'

  const intent: 'success' | 'warning' | 'danger' =
    percentUsed >= 85 ? 'danger' : percentUsed >= 60 ? 'warning' : 'success'

  const sourceConf = SOURCE_CONFIG[source]
  const label = `${PERIOD_LABELS[period]} ${TYPE_LABELS[limitType]}`

  const wrapperClassNames = [styles['limitBar'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      {/* Row 1 */}
      <div className={styles['row1']}>
        <span className={styles['limitLabel']}>{label}</span>
        <div className={styles['sourceRow']}>
          {isLocked && <span className={styles['lockIcon']}>{'\u{1F512}'}</span>}
          <Badge variant={sourceConf.variant as 'low'} size="sm" label={sourceConf.label} />
        </div>
      </div>

      {/* Row 2: bar */}
      <ProgressBar
        value={isBreached ? 100 : percentUsed}
        height="sm"
        intent={intent}
        striped={isBreached}
        rounded
      />

      {/* Row 3: amounts + reset */}
      <div className={styles['row3']}>
        <span className={`${styles['amounts']} ${isBreached ? styles['amountsBreached'] : ''}`}>
          {formatValue(currentAmount, limitType, currency)} of {formatValue(limitAmount, limitType, currency)}
          {isBreached && <span className={styles['overLabel']}> {'\u00b7'} over limit</span>}
        </span>
        <span className={styles['resetDate']}>{formatResetDate(periodResetAt)}</span>
      </div>

      {/* Row 4: edit link */}
      {canEdit && source === 'player' && (
        <button type="button" className={styles['editLink']}>
          Change limit {'\u2192'}
        </button>
      )}
    </div>
  )
}

/* ── LimitGroup ── */

export interface LimitGroupProps extends HTMLAttributes<HTMLDivElement> {
  readonly limits: ReadonlyArray<LimitBarProps>
  readonly title?: string
}

export function LimitGroup({
  limits,
  title = 'Responsible gaming limits',
  className,
  ...props
}: LimitGroupProps) {
  const classNames = [styles['group'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      <div className={styles['groupHeader']}>{title}</div>
      {limits.map((limit, i) => (
        <div key={`${limit.limitType}-${limit.period}-${i}`} className={styles['groupItem']}>
          <LimitBar {...limit} />
        </div>
      ))}
    </div>
  )
}
