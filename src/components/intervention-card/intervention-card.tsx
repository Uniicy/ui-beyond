import { useState, type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import styles from './intervention-card.module.css'

type InterventionType = 'affordability_nudge' | 'deposit_limit_suggestion' | 'reality_check' | 'cooling_off_suggestion' | 'panic_button'
type InterventionOutcome = 'pending' | 'accepted' | 'dismissed' | 'expired'

export interface Intervention {
  readonly id: string
  readonly type: InterventionType
  readonly player: { readonly id: string; readonly name: string }
  readonly triggeredBy: 'system' | 'agent'
  readonly agentName?: string
  readonly sentAt: string
  readonly outcome: InterventionOutcome
  readonly outcomeAt?: string
  readonly note?: string
}

export interface InterventionCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly intervention: Intervention
  readonly onViewPlayer?: (playerId: string) => void
}

const TYPE_CONFIG: Record<InterventionType, { label: string; icon: string }> = {
  affordability_nudge: { label: 'Affordability nudge', icon: '\u{1F4AC}' },
  deposit_limit_suggestion: { label: 'Limit suggestion', icon: '\u{1F4CA}' },
  reality_check: { label: 'Reality check', icon: '\u23F1' },
  cooling_off_suggestion: { label: 'Cooling-off suggestion', icon: '\u2744\uFE0F' },
  panic_button: { label: 'Self-exclusion triggered', icon: '\u{1F6D1}' },
}

const OUTCOME_BADGE: Record<InterventionOutcome, { variant: string; label: string }> = {
  pending: { variant: 'pending', label: 'Pending' },
  accepted: { variant: 'approved', label: 'Accepted' },
  dismissed: { variant: 'inactive', label: 'Dismissed' },
  expired: { variant: 'expired', label: 'Expired' },
}

function formatRelative(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  return `${Math.floor(diffH / 24)}d ago`
}

function formatOutcomeTime(sentAt: string, outcomeAt?: string): string {
  if (outcomeAt === undefined) return ''
  const diffMin = Math.floor((new Date(outcomeAt).getTime() - new Date(sentAt).getTime()) / 60_000)
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  const duration = h > 0 ? `${h}h ${m}m` : `${m}m`
  return `${duration} after sending`
}

export function InterventionCard({
  intervention: iv,
  onViewPlayer,
  className,
  ...props
}: InterventionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const config = TYPE_CONFIG[iv.type]
  const outcome = OUTCOME_BADGE[iv.outcome]
  const isPanic = iv.type === 'panic_button'

  const cardClassNames = [
    styles['card'],
    isPanic ? styles['panicBorder'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cardClassNames}
      onClick={() => setExpanded((p) => !p)}
      {...props}
    >
      {/* Main row */}
      <div className={styles['main']}>
        <div className={styles['iconBox']}>{config.icon}</div>

        <div className={styles['centre']}>
          <span className={styles['typeLabel']}>{config.label}</span>
          <button
            type="button"
            className={styles['playerLink']}
            onClick={(e) => { e.stopPropagation(); onViewPlayer?.(iv.player.id) }}
          >
            {iv.player.name}
          </button>
          <span className={styles['sentTime']}>Sent {formatRelative(iv.sentAt)}</span>
        </div>

        <div className={styles['right']}>
          <Badge variant={outcome.variant as 'pending'} size="sm" label={outcome.label} />
          <span className={styles['triggeredBy']}>
            By {iv.triggeredBy === 'agent' && iv.agentName !== undefined ? iv.agentName : 'system'}
          </span>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className={styles['expanded']}>
          {iv.note !== undefined && (
            <div className={styles['noteBlock']}>{iv.note}</div>
          )}
          {iv.outcomeAt !== undefined && (
            <span className={`${styles['outcomeTime']} ${iv.outcome === 'expired' ? styles['outcomeExpired'] : ''}`}>
              {outcome.label} {formatOutcomeTime(iv.sentAt, iv.outcomeAt)}
            </span>
          )}
          {onViewPlayer !== undefined && (
            <button
              type="button"
              className={styles['viewLink']}
              onClick={(e) => { e.stopPropagation(); onViewPlayer(iv.player.id) }}
            >
              View player {'\u2192'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
