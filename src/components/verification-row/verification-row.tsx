import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import { ProviderBadge } from '../provider-badge'
import { SlaCountdown } from '../sla-countdown'
import styles from './verification-row.module.css'

type VerificationStatus = 'pending' | 'manual_review' | 'rejected' | 'approved' | 'expired'
type DocumentType = 'passport' | 'id_card' | 'driving_licence'
type Provider = 'onfido' | 'jumio' | 'manual'
type Market = 'de' | 'mu' | 'nl' | 'gb'

export interface Verification {
  readonly id: string
  readonly player: { readonly id: string; readonly name: string; readonly email: string }
  readonly status: VerificationStatus
  readonly documentType: DocumentType
  readonly provider: Provider
  readonly slaDeadline: string
  readonly slaCreatedAt: string
  readonly slaPaused?: boolean
  readonly assignedAgent?: { readonly name: string; readonly id: string }
  readonly market: Market
}

export interface VerificationRowProps {
  readonly verification: Verification
  readonly selected?: boolean
  readonly onSelect?: (id: string, checked: boolean) => void
  readonly onClick?: (id: string) => void
  readonly onActionMenu?: (id: string, action: string) => void
  readonly className?: string
}

const DOC_LABELS: Record<DocumentType, string> = {
  passport: 'Passport',
  id_card: 'ID card',
  driving_licence: 'Driving licence',
}

const STATUS_TO_BADGE: Record<VerificationStatus, string> = {
  pending: 'pending',
  manual_review: 'manual_review',
  rejected: 'rejected',
  approved: 'approved',
  expired: 'expired',
}

const ACTIONS = ['Assign to me', 'View player', 'Export'] as const

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

function isBreached(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

export function VerificationRow({
  verification: v,
  selected = false,
  onSelect,
  onClick,
  onActionMenu,
  className,
}: VerificationRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const breached = isBreached(v.slaDeadline) && !v.slaPaused

  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    selected ? styles['selected'] : undefined,
    breached ? styles['borderBreached'] :
      v.status === 'manual_review' ? styles['borderManualReview'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={rowClassNames}
      onClick={onClick !== undefined ? () => onClick(v.id) : undefined}
    >
      {/* Checkbox */}
      <div className={`${styles['cell']} ${styles['cellCheck']}`}>
        <Checkbox
          checked={selected}
          onChange={(c) => onSelect?.(v.id, c)}
          size="sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Player */}
      <div className={styles['playerCell']}>
        <Avatar name={v.player.name} size="sm" />
        <div className={styles['playerInfo']}>
          <span className={styles['playerName']}>{v.player.name}</span>
          <span className={styles['playerEmail']}>{v.player.email}</span>
        </div>
      </div>

      {/* Status */}
      <div className={styles['cell']}>
        <Badge variant={STATUS_TO_BADGE[v.status] as 'pending'} size="sm" />
      </div>

      {/* Document */}
      <div className={styles['cell']}>
        <span className={styles['docType']}>{DOC_LABELS[v.documentType]}</span>
      </div>

      {/* Provider */}
      <div className={styles['cell']}>
        <ProviderBadge provider={v.provider} />
      </div>

      {/* SLA */}
      <div className={styles['cell']}>
        <SlaCountdown
          createdAt={v.slaCreatedAt}
          deadline={v.slaDeadline}
          paused={v.slaPaused}
          mode="inline"
        />
      </div>

      {/* Agent */}
      <div className={styles['agentCell']}>
        {v.assignedAgent !== undefined ? (
          <Avatar name={v.assignedAgent.name} size="xs" tooltip />
        ) : (
          <>
            <Avatar name="Unassigned" size="xs" unassigned />
            <span className={styles['agentLabel']}>Unassigned</span>
          </>
        )}
      </div>

      {/* Market */}
      <div className={styles['cell']}>
        <MarketTag market={v.market} size="sm" showLicense={false} />
      </div>

      {/* Actions */}
      <div className={styles['actionsWrapper']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton
          icon={MoreIcon}
          label="Actions"
          size="sm"
          variant="ghost"
          tooltip={false}
          onClick={() => setMenuOpen((p) => !p)}
        />
        {menuOpen && (
          <div className={styles['actionsDropdown']}>
            {ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                className={styles['actionItem']}
                onClick={() => {
                  onActionMenu?.(v.id, action)
                  setMenuOpen(false)
                }}
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
