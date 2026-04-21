import styles from './WidgetLimitBar.module.css'
import { ProgressBar } from '../../components/progress-bar'

type Source = 'self' | 'operator' | 'regulatory'
type Currency = 'EUR' | 'MUR' | 'GBP'
type Intent = 'success' | 'warning' | 'danger'

export interface WidgetLimitBarProps {
  readonly label: string
  readonly used: number
  readonly limit: number
  readonly currency?: Currency
  readonly unit?: string
  readonly source: Source
  readonly periodResetLabel: string
  readonly canChange?: boolean
  readonly onChangeClick?: () => void
}

const SOURCE_LABEL: Record<Source, string> = {
  self: 'Set by you',
  operator: 'Set by the operator',
  regulatory: 'Regulatory limit',
}

const INTENT_USAGE_CLASS: Record<Intent, string | undefined> = {
  success: styles['usageSuccess'],
  warning: styles['usageWarning'],
  danger: styles['usageDanger'],
}

function deriveIntent(used: number, limit: number): Intent {
  if (limit <= 0) return 'success'
  const pct = (used / limit) * 100
  if (used > limit) return 'danger'
  if (pct >= 85) return 'danger'
  if (pct >= 60) return 'warning'
  return 'success'
}

function formatAmount(n: number): string {
  const opts: Intl.NumberFormatOptions =
    n < 100
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  return new Intl.NumberFormat('en-US', opts).format(n)
}

function formatUsage(
  used: number,
  limit: number,
  currency: Currency | undefined,
  unit: string | undefined,
  isBreached: boolean,
): string {
  if (currency !== undefined) {
    const base = `${currency} ${formatAmount(used)} of ${currency} ${formatAmount(limit)}`
    return isBreached ? `${base} · over limit` : base
  }
  if (unit !== undefined) {
    return `${used} of ${limit} ${unit}`
  }
  return `${used} of ${limit}`
}

const LOCK_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M8 11V7a4 4 0 018 0v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

export function WidgetLimitBar({
  label,
  used,
  limit,
  currency,
  unit,
  source,
  periodResetLabel,
  canChange = false,
  onChangeClick,
}: WidgetLimitBarProps) {
  const rawPct = limit > 0 ? (used / limit) * 100 : 0
  const percentage = Math.min(120, rawPct)
  const displayValue = Math.min(100, percentage)
  const isBreached = used > limit
  const intent = deriveIntent(used, limit)
  const isRegulatory = source === 'regulatory'
  const showChange = canChange && !isRegulatory

  const usageClass = [styles['usage'], INTENT_USAGE_CLASS[intent]]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles['wrapper']}>
      <div className={styles['headRow']}>
        <span className={styles['label']}>{label}</span>
        <span className={styles['source']}>
          {isRegulatory && <span className={styles['lock']}>{LOCK_ICON}</span>}
          {SOURCE_LABEL[source]}
        </span>
      </div>
      <ProgressBar
        value={displayValue}
        height="sm"
        intent={intent}
        striped={isBreached}
      />
      <div className={styles['footRow']}>
        <span className={usageClass}>
          {formatUsage(used, limit, currency, unit, isBreached)}
        </span>
        <span className={styles['reset']}>{periodResetLabel}</span>
      </div>
      {showChange && (
        <button
          type="button"
          className={styles['changeLink']}
          onClick={onChangeClick}
        >
          Change limit →
        </button>
      )}
    </div>
  )
}
