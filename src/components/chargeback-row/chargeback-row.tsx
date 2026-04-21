import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { ProgressBar } from '../progress-bar'
import { ProviderBadge } from '../provider-badge'
import { SlaCountdown } from '../sla-countdown'
import styles from './chargeback-row.module.css'

type CbStatus = 'open' | 'disputed' | 'accepted' | 'won' | 'lost'

export interface ChargebackEntry {
  readonly id: string
  readonly player: { readonly id: string; readonly name: string }
  readonly originalAmount: number
  readonly currency: string
  readonly provider: string
  readonly providerRef: string
  readonly reasonCode: string
  readonly reasonLabel: string
  readonly evidenceDeadline: string
  readonly evidenceCreatedAt: string
  readonly evidenceUploaded: number
  readonly evidenceRequired: number
  readonly status: CbStatus
  readonly assignedAgent?: { readonly id: string; readonly name: string }
}

export interface ChargebackRowProps {
  readonly cb: ChargebackEntry
  readonly selected?: boolean
  readonly onSelect?: (id: string, checked: boolean) => void
  readonly onClick?: (id: string) => void
  readonly className?: string
}

const STATUS_BADGE: Record<CbStatus, string> = { open: 'pending', disputed: 'manual_review', accepted: 'approved', won: 'approved', lost: 'rejected' }
const STATUS_LABEL: Record<CbStatus, string | undefined> = { open: undefined, disputed: undefined, accepted: undefined, won: 'Won', lost: 'Lost' }
const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

const MoreIcon = (<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>)

function fmt(minor: number, cur: string): string {
  const sym = CURRENCY_SYMBOLS[cur] ?? `${cur} `
  return `${sym}${(minor / 100).toLocaleString('en', { minimumFractionDigits: 2 })}`
}

function docIntent(uploaded: number, required: number): 'success' | 'warning' | 'danger' {
  if (uploaded >= required) return 'success'
  if (uploaded > 0) return 'warning'
  return 'danger'
}

export function ChargebackRow({ cb: c, selected = false, onSelect, onClick, className }: ChargebackRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!menuOpen) return; function h(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [menuOpen])

  const isClosed = c.status === 'accepted' || c.status === 'lost'
  const breached = !isClosed && new Date(c.evidenceDeadline).getTime() < Date.now()

  const rowCls = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    selected ? styles['selected'] : undefined,
    isClosed ? styles['muted'] : undefined,
    breached ? styles['borderDanger'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rowCls} onClick={onClick !== undefined ? () => onClick(c.id) : undefined}>
      <div className={`${styles['cell']} ${styles['cellCheck']}`}>
        <Checkbox checked={selected} onChange={(v) => onSelect?.(c.id, v)} size="sm" onClick={(e) => e.stopPropagation()} />
      </div>

      <div className={styles['playerCell']}>
        <Avatar name={c.player.name} size="sm" />
        <div className={styles['playerInfo']}>
          <span className={styles['playerName']}>{c.player.name}</span>
          <span className={styles['playerAmount']}>{fmt(c.originalAmount, c.currency)}</span>
        </div>
      </div>

      <div className={styles['reasonCell']}>
        <span className={styles['reasonCode']}>{c.reasonCode}</span>
        <span className={styles['reasonLabel']}>{c.reasonLabel}</span>
      </div>

      <div className={styles['cell']}><ProviderBadge provider={c.provider as 'trustly'} badgeStyle="outlined" /></div>

      <div className={styles['evidenceCell']}>
        <span className={styles['evidenceLabel']}>{c.evidenceUploaded} of {c.evidenceRequired}</span>
        <div className={styles['evidenceBar']}><ProgressBar value={c.evidenceRequired > 0 ? (c.evidenceUploaded / c.evidenceRequired) * 100 : 0} height="xs" intent={docIntent(c.evidenceUploaded, c.evidenceRequired)} rounded /></div>
      </div>

      <div className={styles['cell']}>
        <SlaCountdown createdAt={c.evidenceCreatedAt} deadline={c.evidenceDeadline} mode="inline" />
      </div>

      <div className={styles['cell']}>
        <Badge variant={STATUS_BADGE[c.status] as 'pending'} size="sm" label={STATUS_LABEL[c.status]} />
      </div>

      <div className={styles['agentCell']}>
        {c.assignedAgent !== undefined ? <Avatar name={c.assignedAgent.name} size="xs" tooltip /> : <span className={styles['dash']}>{'\u2014'}</span>}
      </div>

      <div className={styles['actionsWrapper']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton icon={MoreIcon} label="Actions" size="sm" variant="ghost" tooltip={false} onClick={() => setMenuOpen((p) => !p)} />
        {menuOpen && (
          <div className={styles['actionsDropdown']}>
            {['Upload evidence', 'Dispute', 'Accept loss', 'Export'].map((a) => (
              <button key={a} type="button" className={styles['actionItem']} onClick={() => setMenuOpen(false)}>{a}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
