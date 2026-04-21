import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { RiskScore } from '../risk-score'
import styles from './alert-row.module.css'

export interface AmlAlert {
  readonly id: string
  readonly ruleName: string
  readonly alertType: string
  readonly status: 'open' | 'investigating' | 'escalated' | 'dismissed'
  readonly severity: 'low' | 'medium' | 'high' | 'critical'
  readonly player: { readonly id: string; readonly name: string }
  readonly riskScore: number
  readonly totalAmount: number
  readonly currency: string
  readonly transactionCount: number
  readonly assignedAgent?: { readonly id: string; readonly name: string }
  readonly createdAt: string
}

type AlertAction = 'assign_me' | 'dismiss' | 'escalate' | 'create_sar'

export interface AlertRowProps {
  readonly alert: AmlAlert
  readonly selected?: boolean
  readonly onSelect?: (id: string, checked: boolean) => void
  readonly onClick?: (id: string) => void
  readonly onAction?: (id: string, action: AlertAction) => void
  readonly className?: string
}

const SEVERITY_BORDER: Record<string, string | undefined> = {
  critical: styles['borderCritical'],
  high: styles['borderHigh'],
  medium: styles['borderMedium'],
  low: undefined,
}

const SEVERITY_BADGE: Record<string, string> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '\u20ac',
  GBP: '\u00a3',
  USD: '$',
}

function formatAmount(minorUnits: number, currency: string): string {
  const major = minorUnits / 100
  const symbol = CURRENCY_SYMBOLS[currency]
  const formatted = major.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return symbol !== undefined ? `${symbol}${formatted}` : `${currency} ${formatted}`
}

function formatRelative(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

export function AlertRow({
  alert: a,
  selected = false,
  onSelect,
  onClick,
  onAction,
  className,
}: AlertRowProps) {
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
    a.status === 'dismissed' ? styles['dismissed'] : undefined,
    SEVERITY_BORDER[a.severity],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={rowClassNames}
      onClick={onClick !== undefined ? () => onClick(a.id) : undefined}
    >
      {/* Checkbox */}
      <div className={`${styles['cell']} ${styles['cellCheck']}`}>
        <Checkbox
          checked={selected}
          onChange={(c) => onSelect?.(a.id, c)}
          size="sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Rule */}
      <div className={styles['ruleCell']}>
        <span className={styles['ruleName']}>{a.ruleName}</span>
        <span className={styles['alertType']}>{a.alertType}</span>
      </div>

      {/* Player */}
      <div className={styles['playerCell']}>
        <Avatar name={a.player.name} size="sm" />
        <span className={styles['playerName']}>{a.player.name}</span>
      </div>

      {/* Risk */}
      <div className={styles['cell']}>
        <RiskScore score={a.riskScore} mode="inline" />
      </div>

      {/* Amount */}
      <div className={styles['amountCell']}>
        <span className={styles['amount']}>{formatAmount(a.totalAmount, a.currency)}</span>
        <span className={styles['txnCount']}>{a.transactionCount} txns</span>
      </div>

      {/* Severity */}
      <div className={styles['cell']}>
        <Badge variant={SEVERITY_BADGE[a.severity] as 'high'} size="sm" />
      </div>

      {/* Agent */}
      <div className={styles['agentCell']}>
        {a.assignedAgent !== undefined ? (
          <Avatar name={a.assignedAgent.name} size="sm" tooltip />
        ) : (
          <Avatar name="Unassigned" size="sm" unassigned />
        )}
      </div>

      {/* Time + quick actions */}
      <div className={styles['timeCell']}>
        {formatRelative(a.createdAt)}
        <div className={styles['quickActions']}>
          <button
            type="button"
            className={styles['quickBtn']}
            onClick={(e) => { e.stopPropagation(); onAction?.(a.id, 'assign_me') }}
          >
            Assign
          </button>
          <button
            type="button"
            className={styles['quickBtn']}
            onClick={(e) => { e.stopPropagation(); onAction?.(a.id, 'dismiss') }}
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className={styles['actionsCell']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton
          icon={MoreIcon}
          label="Actions"
          size="sm"
          variant="ghost"
          tooltip={false}
          onClick={() => setMenuOpen((p) => !p)}
        />
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 8,
            backgroundColor: 'var(--ub-color-surface-container-low)',
            borderRadius: 'var(--ub-radius-lg)',
            boxShadow: 'var(--ub-shadow-elevated)',
            zIndex: 10,
            padding: '4px 0',
            minWidth: 150,
          }}>
            {(['assign_me', 'dismiss', 'escalate', 'create_sar'] as const).map((action) => (
              <button
                key={action}
                type="button"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '7px 12px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--ub-font-body)',
                  fontSize: 12,
                  color: action === 'escalate' ? 'var(--ub-color-error)' : 'var(--ub-color-on-surface)',
                  textAlign: 'left',
                }}
                onClick={() => { onAction?.(a.id, action); setMenuOpen(false) }}
              >
                {{ assign_me: 'Assign to me', dismiss: 'Dismiss', escalate: 'Escalate', create_sar: 'Create SAR' }[action]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
