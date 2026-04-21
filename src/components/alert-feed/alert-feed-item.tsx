import { type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import styles from './alert-feed-item.module.css'

type AlertType =
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'kyc_manual'
  | 'aml_alert'
  | 'exclusion_applied'
  | 'lugas_failure'
  | 'oasis_hit'
  | 'player_created'

type AlertSeverity = 'high' | 'medium' | 'low'

export interface AlertFeedItemProps extends HTMLAttributes<HTMLDivElement> {
  readonly type: AlertType
  readonly playerName?: string
  readonly playerId?: string
  readonly description: string
  readonly timestamp: string
  readonly severity?: AlertSeverity
  readonly onClick?: () => void
}

interface TypeConfig {
  readonly icon: string
  readonly iconStyle: string
}

const TYPE_CONFIG = {
  kyc_approved: { icon: '\u2713', iconStyle: styles['iconKyc'] },
  kyc_rejected: { icon: '\u2717', iconStyle: styles['iconAml'] },
  kyc_manual: { icon: '\u270E', iconStyle: styles['iconKyc'] },
  aml_alert: { icon: '\u26A0', iconStyle: styles['iconAml'] },
  exclusion_applied: { icon: '\u20E0', iconStyle: styles['iconExclusion'] },
  lugas_failure: { icon: '\u2693', iconStyle: styles['iconSystem'] },
  oasis_hit: { icon: '\u25C9', iconStyle: styles['iconExclusion'] },
  player_created: { icon: '\u002B', iconStyle: styles['iconPlayer'] },
} as const

export function AlertFeedItem({
  type,
  playerName,
  description,
  timestamp,
  severity,
  onClick,
  className,
  ...props
}: AlertFeedItemProps) {
  const config = TYPE_CONFIG[type]
  const isHighAml = type === 'aml_alert' && severity === 'high'

  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    isHighAml ? styles['highSeverity'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

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
      <span className={`${styles['icon']} ${config.iconStyle}`} aria-hidden="true">
        {config.icon}
      </span>

      <div className={styles['content']}>
        {playerName !== undefined && (
          <span className={styles['playerName']}>{playerName}</span>
        )}
        <span className={styles['description']}>{description}</span>
      </div>

      <div className={styles['meta']}>
        {severity !== undefined && <Badge variant={severity} size="sm" />}
        <span className={styles['timestamp']}>{timestamp}</span>
      </div>
    </div>
  )
}
