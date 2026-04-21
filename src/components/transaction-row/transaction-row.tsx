import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { ProviderBadge } from '../provider-badge'
import { StatusDot } from '../status-dot'
import styles from './transaction-row.module.css'

type TxType = 'deposit' | 'withdrawal'
type TxStatus = 'completed' | 'pending' | 'failed' | 'held' | 'rejected'
type CheckResult = 'pass' | 'fail' | 'warn' | 'skip'

interface ComplianceChecks {
  readonly oasis?: CheckResult
  readonly kyc: CheckResult
  readonly limit: CheckResult
}

export interface TransactionEntry {
  readonly id: string
  readonly occurredAt: string
  readonly type: TxType
  readonly player: { readonly id: string; readonly name: string }
  readonly amount: number
  readonly currency: string
  readonly provider: string
  readonly providerRef: string
  readonly status: TxStatus
  readonly complianceChecks: ComplianceChecks
}

type TxAction = 'hold' | 'approve' | 'reject' | 'export'

export interface TransactionRowProps {
  readonly tx: TransactionEntry
  readonly onClick?: (txId: string) => void
  readonly onAction?: (txId: string, action: TxAction) => void
  readonly className?: string
}

const STATUS_BADGE: Record<TxStatus, string> = {
  completed: 'approved',
  pending: 'pending',
  failed: 'rejected',
  held: 'manual_review',
  rejected: 'rejected',
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

const CHECK_DOT: Record<CheckResult, 'ok' | 'warning' | 'error' | 'inactive'> = {
  pass: 'ok', warn: 'warning', fail: 'error', skip: 'inactive',
}

const CHECK_LABELS: Record<string, Record<CheckResult, string>> = {
  oasis: { pass: 'OASIS: Clear', fail: 'OASIS: Hit', warn: 'OASIS: Warning', skip: 'OASIS: Skip' },
  kyc: { pass: 'KYC: Verified', fail: 'KYC: Failed', warn: 'KYC: Warning', skip: 'KYC: Skip' },
  limit: { pass: 'Limit: Within bounds', fail: 'Limit: Exceeded', warn: 'Limit: Near', skip: 'Limit: Skip' },
}

const ACTIONS: Array<{ action: TxAction; label: string }> = [
  { action: 'hold', label: 'Hold' },
  { action: 'approve', label: 'Approve withdrawal' },
  { action: 'reject', label: 'Reject' },
  { action: 'export', label: 'Export' },
]

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

function formatTs(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  }
}

function formatAmount(minor: number, currency: string): string {
  const major = (minor / 100).toLocaleString('en', { minimumFractionDigits: 2 })
  const sym = CURRENCY_SYMBOLS[currency]
  return sym !== undefined ? `${sym}${major}` : `${currency} ${major}`
}

function hasAnyFail(checks: ComplianceChecks): boolean {
  return checks.kyc === 'fail' || checks.limit === 'fail' || checks.oasis === 'fail'
}

function getBorder(tx: TransactionEntry): string | undefined {
  if (hasAnyFail(tx.complianceChecks)) return styles['borderDanger']
  if (tx.status === 'failed' || tx.status === 'rejected') return styles['borderDanger']
  if (tx.status === 'held') return styles['borderWarning']
  return undefined
}

export function TransactionRow({ tx, onClick, onAction, className }: TransactionRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const { date, time } = formatTs(tx.occurredAt)
  const anyFail = hasAnyFail(tx.complianceChecks)
  const isHeldOrDanger = tx.status === 'held' || tx.status === 'rejected'
  const withdrawalDanger = tx.type === 'withdrawal' && isHeldOrDanger

  const rowClassNames = [
    styles['row'],
    onClick !== undefined ? styles['clickable'] : undefined,
    tx.status === 'held' ? styles['heldTint'] : undefined,
    getBorder(tx),
    className,
  ].filter(Boolean).join(' ')

  const checks: Array<{ key: string; result: CheckResult }> = []
  if (tx.complianceChecks.oasis !== undefined) checks.push({ key: 'oasis', result: tx.complianceChecks.oasis })
  checks.push({ key: 'kyc', result: tx.complianceChecks.kyc })
  checks.push({ key: 'limit', result: tx.complianceChecks.limit })

  return (
    <div className={rowClassNames} onClick={onClick !== undefined ? () => onClick(tx.id) : undefined}>
      <div className={styles['tsCell']}>
        <span className={styles['tsDate']}>{date}</span>
        <span className={styles['tsTime']}>{time}</span>
      </div>

      <div className={styles['playerCell']}>
        <Avatar name={tx.player.name} size="xs" />
        {onClick !== undefined ? (
          <button type="button" className={styles['playerLink']} onClick={(e) => { e.stopPropagation(); onClick(tx.id) }}>{tx.player.name}</button>
        ) : (
          <span className={styles['playerName']}>{tx.player.name}</span>
        )}
      </div>

      <div className={styles['cell']}>
        <span className={`${styles['typePill']} ${tx.type === 'deposit' ? styles['typeDeposit'] : (withdrawalDanger ? styles['typeWithdrawalDanger'] : styles['typeWithdrawal'])}`}>
          {tx.type === 'deposit' ? '\u2193 Deposit' : '\u2191 Withdrawal'}
        </span>
      </div>

      <div className={`${styles['cell']} ${styles['amount']} ${tx.type === 'deposit' ? styles['amountDeposit'] : styles['amountWithdrawal']}`}>
        {formatAmount(tx.amount, tx.currency)}
      </div>

      <div className={styles['cell']}>
        <ProviderBadge provider={tx.provider as 'trustly'} badgeStyle="outlined" />
      </div>

      <div className={styles['complianceCell']}>
        {anyFail ? (
          <Badge variant="critical" size="sm" label="Check failed" />
        ) : (
          checks.map((c) => (
            <span key={c.key} className={styles['complianceDot']} data-tooltip={CHECK_LABELS[c.key]?.[c.result] ?? ''}>
              <StatusDot status={CHECK_DOT[c.result]} size="sm" />
            </span>
          ))
        )}
      </div>

      <div className={styles['cell']}>
        <Badge variant={STATUS_BADGE[tx.status] as 'approved'} size="sm" />
      </div>

      <div className={styles['actionsWrapper']} ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <IconButton icon={MoreIcon} label="Actions" size="sm" variant="ghost" tooltip={false} onClick={() => setMenuOpen((p) => !p)} />
        {menuOpen && (
          <div className={styles['actionsDropdown']}>
            {ACTIONS.map((a) => (
              <button key={a.action} type="button" className={styles['actionItem']} onClick={() => { onAction?.(tx.id, a.action); setMenuOpen(false) }}>{a.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
