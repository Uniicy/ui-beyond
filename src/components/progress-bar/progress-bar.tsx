import { type HTMLAttributes } from 'react'
import styles from './progress-bar.module.css'

type ProgressBarHeight = 'xs' | 'sm' | 'md' | 'lg'
type ProgressBarIntent = 'success' | 'warning' | 'danger' | 'primary' | 'neutral'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Percentage 0–100. Values outside the range are clamped. */
  readonly value: number
  /** Track thickness. */
  readonly height?: ProgressBarHeight
  /** Fill color. Use `warning`/`danger` for limit overruns. */
  readonly intent?: ProgressBarIntent
  /** Animate stripe pattern (usually pair with `striped`). */
  readonly animated?: boolean
  readonly striped?: boolean
  /** Round track corners (default on). */
  readonly rounded?: boolean
  /** Optional label rendered above the track. */
  readonly label?: string
}

/**
 * Linear progress/completion indicator with ARIA progressbar role. Use for
 * KYC step completion, deposit limits, upload progress, etc.
 */

export function ProgressBar({
  value,
  height = 'sm',
  intent = 'primary',
  animated = false,
  striped = false,
  rounded = true,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const trackClassNames = [
    styles['track'],
    styles[height],
    styles[intent],
    rounded ? styles['rounded'] : undefined,
    striped ? styles['striped'] : undefined,
    animated ? styles['animated'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperClassNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      {label !== undefined && (
        <div className={styles['header']}>
          <span className={styles['label']}>{label}</span>
        </div>
      )}
      <div
        className={trackClassNames}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles['fill']}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
