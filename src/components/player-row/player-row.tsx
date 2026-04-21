import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import { RiskScore } from '../risk-score'
import { StatusDot } from '../status-dot'
import styles from './player-row.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected' | 'manual_review' | 'blocked'
type AmlRiskTier = 'standard' | 'enhanced' | 'high_risk'
type PlayerAction = 'view' | 'flag' | 'new_verification' | 'export'

export interface PlayerListItem {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly externalId: string
  readonly kycStatus: KycStatus
  readonly amlRiskTier: AmlRiskTier
  readonly amlRiskScore: number
  readonly rgIsExcluded: boolean
  readonly hasNearLimitWarning: boolean
  readonly markets: ReadonlyArray<Market>
  readonly lastActivityAt: string
  readonly createdAt: string
}

export interface PlayerRowProps {
  readonly player: PlayerListItem
  readonly selected?: boolean
  readonly onSelect?: (id: string, checked: boolean) => void
  readonly onClick?: (id: string) => void
  readonly onAction?: (id: string, action: PlayerAction) => void
  readonly className?: string
}

const KYC_BADGE: Record<KycStatus, string> = {
  unverified: 'pending',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  manual_review: 'manual_review',
  blocked: 'blocked',
}

const KYC_LABEL: Record<KycStatus, string | undefined> = {
  unverified: 'Unverified',
  pending: undefined,
  approved: undefined,
  rejected: undefined,
  manual_review: undefined,
  blocked: undefined,
}

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

const ACTIONS: Array<{ action: PlayerAction; label: string; danger?: boolean }> = [
  { action: 'view', label: 'View profile' },
  { action: 'new_verification', label: 'New verification' },
  { action: 'flag', label: 'Flag player', danger: true },
  { action: 'export', label: 'Export data' },
]

function formatRelative(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

function getBorder(p: PlayerListItem): string | undefined {
  if (p.rgIsExcluded || p.kycStatus === 'blocked') return styles['borderDanger']
  if (p.amlRiskTier === 'high_risk') return styles['borderWarning']
  return undefined
}

export function PlayerRow({
  player: p,
  selected = false,
  onSelect,
  onClick,
  onAction,
  className,
}: PlayerRowProps) {
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

  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    selected ? styles['selected'] : undefined,
    p.kycStatus === 'blocked' ? styles['blocked'] : undefined,
    getBorder(p),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rowClassNames} onClick={onClick !== undefined ? () => onClick(p.id) : undefined}>
      {/* Checkbox */}
      <div className={`${styles['cell']} ${styles['cellCheck']}`}>
        <Checkbox
          checked={selected}
          onChange={(c) => onSelect?.(p.id, c)}
          size="sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Player */}
      <div className={styles['playerCell']}>
        <Avatar name={p.name} size="sm" />
        <div className={styles['playerInfo']}>
          <span className={styles['playerName']}>{p.name}</span>
          <span className={styles['playerEmail']}>{p.email}</span>
        </div>
      </div>

      {/* KYC */}
      <div className={styles['cell']}>
        <Badge variant={KYC_BADGE[p.kycStatus] as 'approved'} size="sm" label={KYC_LABEL[p.kycStatus]} />
      </div>

      {/* AML */}
      <div className={styles['amlCell']}>
        <RiskScore score={p.amlRiskScore} mode="inline" />
        <Badge variant={p.amlRiskTier as 'standard'} size="sm" />
      </div>

      {/* RG */}
      <div className={styles['rgCell']}>
        {p.rgIsExcluded ? (
          <Badge variant="blocked" size="sm" label="Excluded" />
        ) : p.hasNearLimitWarning ? (
          <>
            <StatusDot status="warning" size="sm" />
            <span className={styles['rgNearLimit']}>Near limit</span>
          </>
        ) : (
          <span className={styles['rgDash']}>{'\u2014'}</span>
        )}
      </div>

      {/* Markets */}
      <div className={styles['marketsCell']}>
        {p.markets.map((m) => (
          <MarketTag key={m} market={m} size="sm" showLicense={false} />
        ))}
      </div>

      {/* Last active */}
      <div className={styles['timeCell']}>
        {formatRelative(p.lastActivityAt)}
      </div>

      {/* Actions */}
      <div className={styles['actionsWrapper']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton
          icon={MoreIcon}
          label="Actions"
          size="sm"
          variant="ghost"
          tooltip={false}
          onClick={() => setMenuOpen((prev) => !prev)}
        />
        {menuOpen && (
          <div className={styles['actionsDropdown']}>
            {ACTIONS.map((a) => (
              <button
                key={a.action}
                type="button"
                className={`${styles['actionItem']} ${a.danger ? styles['actionDanger'] : ''}`}
                onClick={() => { onAction?.(p.id, a.action); setMenuOpen(false) }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
