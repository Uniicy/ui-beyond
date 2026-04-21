import { type HTMLAttributes } from 'react'
import styles from './flagged-item-card.module.css'

type FlaggedSeverity = 'error' | 'warning' | 'info'

export interface FlaggedItemCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly category: string
  readonly count: number
  readonly severity: FlaggedSeverity
  readonly detail?: string
  readonly cta?: { readonly label: string; readonly onClick: () => void }
}

const SEVERITY_BORDER = {
  error: styles['error'],
  warning: styles['warning'],
  info: styles['info'],
} as const

const COUNT_COLOR = {
  error: styles['countError'],
  warning: styles['countWarning'],
  info: styles['countInfo'],
} as const

export function FlaggedItemCard({
  category,
  count,
  severity,
  detail,
  cta,
  className,
  ...props
}: FlaggedItemCardProps) {
  const cardClassNames = [
    styles['card'],
    SEVERITY_BORDER[severity],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassNames} {...props}>
      <span className={`${styles['count']} ${COUNT_COLOR[severity]}`}>
        {count}
      </span>
      <div className={styles['body']}>
        <span className={styles['category']}>{category}</span>
        {detail !== undefined && (
          <span className={styles['detail']}>{detail}</span>
        )}
        {cta !== undefined && (
          <button type="button" className={styles['cta']} onClick={cta.onClick}>
            {cta.label}
          </button>
        )}
      </div>
    </div>
  )
}
