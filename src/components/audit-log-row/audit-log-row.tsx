import { useCallback, useRef, useState, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { type AuditSource, SOURCE_BADGE_VARIANT, SOURCE_LABEL, CopyIcon } from './audit-source'
import styles from './audit-log-row.module.css'

export type { AuditSource }

export interface AuditEvent {
  readonly id: string
  readonly occurredAt: string
  readonly eventType: string
  readonly source: AuditSource
  readonly tenantId: string
  readonly brandId: string
  readonly playerId?: string
  readonly playerName?: string
  readonly agentId?: string
  readonly agentName?: string
  readonly payloadPreview: string
  readonly sha256: string
}

export interface AuditLogRowProps {
  readonly event: AuditEvent
  readonly onClick?: (eventId: string) => void
  readonly className?: string
}

const SOURCE_DOT_CLASS: Record<AuditSource, string> = {
  kyc: 'dotPrimary',
  aml: 'dotDanger',
  rg: 'dotWarning',
  psp: 'dotSuccess',
  'player-graph': 'dotMuted',
  audit: 'dotMuted',
  tenant: 'dotMuted',
  system: 'dotMuted',
}

function formatTimestamp(iso: string): { readonly date: string; readonly time: string } {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' })
  const year = d.getFullYear()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')

  return {
    date: `${day} ${month} ${year}`,
    time: `${h}:${m}:${s}.${ms}`,
  }
}

export function AuditLogRow({
  event: e,
  onClick,
  className,
}: AuditLogRowProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const ts = formatTimestamp(e.occurredAt)
  const hashTail = `…${e.sha256.slice(-8)}`
  const isClickable = onClick !== undefined

  const handleCopyHash = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation()
    navigator.clipboard.writeText(e.sha256).catch(() => {})

    if (timerRef.current) clearTimeout(timerRef.current)
    setCopied(true)
    timerRef.current = setTimeout(() => setCopied(false), 1200)
  }, [e.sha256])

  const handleRowClick = isClickable ? () => onClick(e.id) : undefined

  const handleKeyDown = isClickable
    ? (ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault()
          onClick(e.id)
        }
      }
    : undefined

  const rowClassNames = [
    styles['row'],
    isClickable ? styles['clickable'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={rowClassNames}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Timestamp */}
      <div className={styles['tsCell']}>
        <span className={styles['tsDate']}>{ts.date}</span>
        <span className={styles['tsTime']}>{ts.time}</span>
      </div>

      {/* Event type */}
      <div className={styles['eventCell']}>
        <span className={`${styles['dot']} ${styles[SOURCE_DOT_CLASS[e.source]] ?? ''}`} />
        <span className={styles['eventType']}>{e.eventType}</span>
      </div>

      {/* Source */}
      <div className={styles['cell']}>
        <Badge
          variant={SOURCE_BADGE_VARIANT[e.source]}
          size="sm"
          label={SOURCE_LABEL[e.source]}
        />
      </div>

      {/* Entity */}
      <div className={styles['entityCell']}>
        {e.playerId !== undefined && e.playerName !== undefined ? (
          <>
            <Avatar name={e.playerName} size="xs" />
            <span className={styles['entityName']}>{e.playerName}</span>
          </>
        ) : (
          <span className={styles['entityMuted']}>{e.tenantId}</span>
        )}
      </div>

      {/* Agent */}
      <div className={styles['agentCell']}>
        {e.agentId !== undefined && e.agentName !== undefined ? (
          <>
            <Avatar name={e.agentName} size="xs" />
            <span className={styles['agentName']}>{e.agentName}</span>
          </>
        ) : (
          <span className={styles['agentSystem']}>system</span>
        )}
      </div>

      {/* Preview */}
      <div className={styles['previewCell']}>
        <span className={styles['previewText']}>{e.payloadPreview}</span>
      </div>

      {/* Hash */}
      <div className={styles['hashCell']} onClick={(ev) => ev.stopPropagation()}>
        <span className={styles['hashText']}>{hashTail}</span>
        <IconButton
          icon={CopyIcon}
          label={copied ? 'Copied' : 'Copy hash'}
          size="sm"
          variant="ghost"
          onClick={handleCopyHash}
        />
      </div>
    </div>
  )
}
