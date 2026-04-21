import { type HTMLAttributes } from 'react'
import { StatusDot } from '../status-dot'
import styles from './badge.module.css'

type TextVariant =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'manual_review'
  | 'blocked'
  | 'expired'
  | 'high'
  | 'medium'
  | 'low'
  | 'critical'
  | 'standard'
  | 'enhanced'
  | 'high_risk'
  | 'live'
  | 'beta'
  | 'inactive'
  | 'fail_closed'
  | 'fail_open'

type BadgeVariant = TextVariant | 'count'
type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic status. Drives tone (color) and default label. Use `count` variant for numeric notifications. */
  readonly variant: BadgeVariant
  /** `sm` for inline/table use, `md` (default) for standalone. */
  readonly size?: BadgeSize
  /** Prepend a pulsing `StatusDot` — useful for live/critical states. */
  readonly dot?: boolean
  /** Override the auto-formatted label (e.g. `"Awaiting docs"` instead of `"Pending"`). */
  readonly label?: string
  /** Number to render when `variant === 'count'`. Values above 99 show as `99+`. */
  readonly count?: number
}

const VARIANT_TONE: Record<TextVariant, string> = {
  approved: 'success',
  low: 'success',
  fail_open: 'success',
  pending: 'warning',
  medium: 'warning',
  enhanced: 'warning',
  rejected: 'danger',
  blocked: 'danger',
  high: 'danger',
  critical: 'danger',
  high_risk: 'danger',
  fail_closed: 'danger',
  manual_review: 'primary',
  expired: 'neutral',
  inactive: 'neutral',
  standard: 'neutral',
  live: 'live',
  beta: 'beta',
}

const VARIANT_DOT_STATUS = {
  approved: 'ok',
  low: 'ok',
  fail_open: 'ok',
  pending: 'warning',
  medium: 'warning',
  enhanced: 'warning',
  rejected: 'error',
  blocked: 'error',
  high: 'error',
  critical: 'error',
  high_risk: 'error',
  fail_closed: 'error',
  manual_review: 'pending',
  expired: 'inactive',
  inactive: 'inactive',
  standard: 'inactive',
  live: 'live',
  beta: 'pending',
} as const

const DEFAULT_LABELS: Partial<Record<TextVariant, string>> = {
  fail_closed: 'Fail-closed',
  fail_open: 'Fail-open',
  manual_review: 'Manual review',
  high_risk: 'High risk',
}

function formatLabel(variant: TextVariant): string {
  return DEFAULT_LABELS[variant] ?? variant.replace(/_/g, ' ')
}

function formatCount(count: number): string {
  return count > 99 ? '99+' : String(count)
}

/**
 * Compact status pill for compliance states, risk levels, feature lifecycle
 * tags, and numeric counters. Variants encode semantic meaning (approved,
 * pending, rejected, high_risk, …), so consumers don't pick colors.
 */
export function Badge({
  variant,
  size = 'md',
  dot = false,
  label,
  count,
  className,
  ...props
}: BadgeProps) {
  if (variant === 'count') {
    const displayCount = formatCount(count ?? 0)
    const isCircular = (count ?? 0) < 10

    const countClassNames = [
      styles['countBadge'],
      isCircular ? styles['countCircle'] : styles['countPill'],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span className={countClassNames} {...props}>
        {displayCount}
      </span>
    )
  }

  const tone = VARIANT_TONE[variant]

  const classNames = [
    styles['badge'],
    styles[tone],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...props}>
      {dot && (
        <StatusDot
          status={VARIANT_DOT_STATUS[variant]}
          size="sm"
          pulse={variant === 'live'}
        />
      )}
      {label ?? formatLabel(variant)}
    </span>
  )
}
