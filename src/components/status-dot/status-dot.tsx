import { type HTMLAttributes } from 'react'
import styles from './status-dot.module.css'

type StatusDotStatus = 'live' | 'ok' | 'warning' | 'error' | 'inactive' | 'pending'
type StatusDotSize = 'sm' | 'md' | 'lg'

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic state. `live` auto-pulses unless `pulse` is explicitly set. */
  readonly status: StatusDotStatus
  readonly size?: StatusDotSize
  /** Force pulse animation on/off (overrides the `live` default). */
  readonly pulse?: boolean
  /** Inline text rendered to the right of the dot. */
  readonly label?: string
}

/**
 * Tiny colored dot for compact status indication. Used inside `Badge`,
 * `KpiCard`, row layouts — anywhere a full pill would be visual noise.
 */

export function StatusDot({
  status,
  size = 'md',
  pulse,
  label,
  className,
  ...props
}: StatusDotProps) {
  const shouldPulse = pulse ?? status === 'live'

  const dotClassNames = [
    styles['dot'],
    styles[status],
    styles[size],
    shouldPulse ? styles['pulse'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperClassNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClassNames} {...props}>
      <span className={dotClassNames} aria-hidden="true" />
      {label !== undefined && <span className={styles['label']}>{label}</span>}
    </span>
  )
}
