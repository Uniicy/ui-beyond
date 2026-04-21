import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { ProgressBar } from '../progress-bar'
import { SlaCountdown } from '../sla-countdown'
import styles from './affordability-row.module.css'

type TriggerType = 'deposit_threshold' | 'loss_threshold' | 'risk_flag'
type CheckStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired'
type RowAction = 'review' | 'approve' | 'reject' | 'extend_deadline'

export interface AffordabilityCheck {
  readonly id: string
  readonly player: { readonly id: string; readonly name: string; readonly email: string }
  readonly triggerType: TriggerType
  readonly thresholdAmount?: number
  readonly currency?: string
  readonly deadline: string
  readonly createdAt: string
  readonly documentsUploaded: number
  readonly documentsRequired: number
  readonly status: CheckStatus
  readonly assignedAgent?: { readonly id: string; readonly name: string }
}

export interface AffordabilityRowProps {
  readonly check: AffordabilityCheck
  readonly selected?: boolean
  readonly onSelect?: (id: string, checked: boolean) => void
  readonly onClick?: (id: string) => void
  readonly onAction?: (id: string, action: RowAction) => void
  readonly className?: string
}

const TRIGGER_LABELS: Record<TriggerType, string> = {
  deposit_threshold: 'Deposit threshold',
  loss_threshold: 'Loss threshold',
  risk_flag: 'Risk flag',
}

const STATUS_BADGE: Record<CheckStatus, string> = {
  pending: 'pending',
  submitted: 'manual_review',
  approved: 'approved',
  rejected: 'rejected',
  expired: 'expired',
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

const ACTIONS: Array<{ action: RowAction; label: string }> = [
  { action: 'review', label: 'Review documents' },
  { action: 'approve', label: 'Approve' },
  { action: 'reject', label: 'Reject' },
  { action: 'extend_deadline', label: 'Extend deadline' },
]

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

function formatAmount(amount: number, currency?: string): string {
  const sym = currency !== undefined ? CURRENCY_SYMBOLS[currency] : undefined
  const formatted = amount.toLocaleString('en', { minimumFractionDigits: 0 })
  return sym !== undefined ? `${sym}${formatted}` : `${currency ?? ''} ${formatted}`
}

function getBorder(c: AffordabilityCheck): string | undefined {
  if (c.status === 'expired') return styles['borderMuted']
  const breached = new Date(c.deadline).getTime() < Date.now() && (c.status === 'pending' || c.status === 'submitted')
  if (breached) return styles['borderDanger']
  if (c.status === 'pending' && c.documentsUploaded >= c.documentsRequired) return styles['borderSuccess']
  return undefined
}

function docsIntent(uploaded: number, required: number): 'success' | 'warning' | 'danger' {
  if (uploaded >= required) return 'success'
  if (uploaded > 0) return 'warning'
  return 'danger'
}

export function AffordabilityRow({
  check: c,
  selected = false,
  onSelect,
  onClick,
  onAction,
  className,
}: AffordabilityRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    selected ? styles['selected'] : undefined,
    c.status === 'expired' ? styles['expired'] : undefined,
    getBorder(c),
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rowClassNames} onClick={onClick !== undefined ? () => onClick(c.id) : undefined}>
      <div className={`${styles['cell']} ${styles['cellCheck']}`}>
        <Checkbox checked={selected} onChange={(v) => onSelect?.(c.id, v)} size="sm" onClick={(e) => e.stopPropagation()} />
      </div>

      <div className={styles['playerCell']}>
        <Avatar name={c.player.name} size="sm" />
        <div className={styles['playerInfo']}>
          <span className={styles['playerName']}>{c.player.name}</span>
          <span className={styles['playerEmail']}>{c.player.email}</span>
        </div>
      </div>

      <div className={styles['triggerCell']}>
        <span className={styles['triggerLabel']}>{TRIGGER_LABELS[c.triggerType]}</span>
        {c.thresholdAmount !== undefined && (
          <span className={styles['triggerAmount']}>{formatAmount(c.thresholdAmount, c.currency)} in 30d</span>
        )}
      </div>

      <div className={styles['docsCell']}>
        <span className={styles['docsLabel']}>{c.documentsUploaded} of {c.documentsRequired}</span>
        <div className={styles['docsBar']}>
          <ProgressBar
            value={c.documentsRequired > 0 ? (c.documentsUploaded / c.documentsRequired) * 100 : 0}
            height="xs"
            intent={docsIntent(c.documentsUploaded, c.documentsRequired)}
            rounded
          />
        </div>
      </div>

      <div className={styles['cell']}>
        <SlaCountdown createdAt={c.createdAt} deadline={c.deadline} mode="inline" />
      </div>

      <div className={styles['cell']}>
        <Badge variant={STATUS_BADGE[c.status] as 'pending'} size="sm" />
      </div>

      <div className={styles['agentCell']}>
        {c.assignedAgent !== undefined
          ? <Avatar name={c.assignedAgent.name} size="sm" tooltip />
          : <Avatar name="Unassigned" size="sm" unassigned />}
      </div>

      <div className={styles['actionsWrapper']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton icon={MoreIcon} label="Actions" size="sm" variant="ghost" tooltip={false} onClick={() => setMenuOpen((p) => !p)} />
        {menuOpen && (
          <div className={styles['actionsDropdown']}>
            {ACTIONS.map((a) => (
              <button key={a.action} type="button" className={styles['actionItem']} onClick={() => { onAction?.(c.id, a.action); setMenuOpen(false) }}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
