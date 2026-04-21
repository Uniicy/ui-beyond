import { type HTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../icon-button'
import styles from './alert-routing-row.module.css'

type Channel = 'slack' | 'email' | 'webhook'

export interface AlertRoutingRule {
  readonly id: string
  readonly eventPattern: string
  readonly channel: Channel
  readonly channelTarget: string
  readonly throttle: string | null
  readonly active: boolean
}

export interface AlertRoutingRowProps extends HTMLAttributes<HTMLDivElement> {
  readonly rule: AlertRoutingRule
  readonly onToggleActive: (id: string, active: boolean) => void
  readonly onEdit: (id: string) => void
  readonly onDelete: (id: string) => void
}

const EditIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5Z" />
  </svg>
)

const DeleteIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4" />
  </svg>
)

const SlackIcon = (
  <span className={styles['channelIcon']} data-channel="slack">#</span>
)

const EmailIcon = (
  <svg className={styles['channelIconSvg']} data-channel="email" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
    <rect x="2" y="3" width="12" height="10" rx="1.5" />
    <path d="M2 5l6 4 6-4" />
  </svg>
)

const WebhookIcon = (
  <span className={styles['channelIcon']} data-channel="webhook">{'\u26a1'}</span>
)

const CHANNEL_ICONS: Record<Channel, ReactNode> = {
  slack: SlackIcon,
  email: EmailIcon,
  webhook: WebhookIcon,
}

function hasWildcard(pattern: string): boolean {
  return pattern.includes('*')
}

function renderPattern(pattern: string): ReactNode {
  if (!hasWildcard(pattern)) {
    return <span className={styles['patternText']}>{pattern}</span>
  }

  const parts = pattern.split('*')
  return (
    <span className={styles['patternText']}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className={styles['wildcard']}>*</span>}
        </span>
      ))}
    </span>
  )
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\u2026` : text
}

export function AlertRoutingRow({ rule: r, onToggleActive, onEdit, onDelete, className, ...props }: AlertRoutingRowProps) {
  const rowCls = [
    styles['row'],
    !r.active && styles['inactive'],
    hasWildcard(r.eventPattern) && styles['wildcardBorder'],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rowCls} {...props}>
      {/* Pattern */}
      <div className={styles['patternCell']}>
        {renderPattern(r.eventPattern)}
      </div>

      {/* Channel */}
      <div className={styles['channelCell']}>
        <span className={[styles['channelBadge'], styles[`channel${r.channel.charAt(0).toUpperCase()}${r.channel.slice(1)}`]].filter(Boolean).join(' ')}>
          {CHANNEL_ICONS[r.channel]}
        </span>
        <span className={styles['channelTarget']}>{truncate(r.channelTarget, 28)}</span>
      </div>

      {/* Throttle */}
      <div className={styles['throttleCell']}>
        {r.throttle !== null ? (
          <span className={styles['throttleText']}>{r.throttle}</span>
        ) : (
          <span className={styles['noThrottle']}>No throttle</span>
        )}
      </div>

      {/* Toggle */}
      <div className={styles['toggleCell']}>
        <label className={styles['toggle']}>
          <span className={styles['srOnly']}>
            {r.active ? 'Deactivate rule' : 'Activate rule'}
          </span>
          <input
            type="checkbox"
            checked={r.active}
            onChange={() => onToggleActive(r.id, !r.active)}
            className={styles['toggleInput']}
          />
          <span className={[styles['toggleTrack'], r.active && styles['toggleActive']].filter(Boolean).join(' ')}>
            <span className={styles['toggleThumb']} />
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className={styles['actionsCell']}>
        <IconButton icon={EditIcon} label="Edit rule" size="sm" variant="ghost" onClick={() => onEdit(r.id)} />
        <IconButton icon={DeleteIcon} label="Delete rule" size="sm" variant="ghost" intent="danger" onClick={() => onDelete(r.id)} />
      </div>
    </div>
  )
}
