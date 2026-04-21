import { useState, useCallback } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import { ProviderBadge } from '../provider-badge'
import { SlideInPanel } from '../slide-in-panel'
import { StatusDot } from '../status-dot'
import type { TransactionEntry } from '../transaction-row'
import styles from './transaction-detail-panel.module.css'

type CheckResult = 'pass' | 'fail' | 'warn' | 'skip'

interface ComplianceCheckRow {
  readonly label: string
  readonly result: CheckResult
  readonly marketGate?: string
}

export interface TransactionDetailPanelProps {
  readonly tx: TransactionEntry
  readonly open: boolean
  readonly onClose: () => void
  readonly onHold: (txId: string) => void
  readonly onApprove: (txId: string) => void
  readonly onReject: (txId: string, reason: string) => void
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

const CHECK_DOT: Record<CheckResult, 'ok' | 'warning' | 'error' | 'inactive'> = {
  pass: 'ok', warn: 'warning', fail: 'error', skip: 'inactive',
}

const CHECK_LABEL: Record<CheckResult, string> = {
  pass: 'Passed', warn: 'Warning', fail: 'Failed', skip: 'Skipped',
}

const REJECT_REASONS = [
  'Insufficient KYC documentation',
  'Suspected fraud',
  'AML compliance concern',
  'Source of funds not verified',
  'Account flagged for review',
  'Other',
] as const

const CopyIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M5 11H3.5A1.5 1.5 0 0 1 2 9.5v-6A1.5 1.5 0 0 1 3.5 2h6A1.5 1.5 0 0 1 11 3.5V5" />
  </svg>
)

function formatAmount(minor: number, currency: string): string {
  const major = (minor / 100).toLocaleString('en', { minimumFractionDigits: 2 })
  const sym = CURRENCY_SYMBOLS[currency]
  return sym !== undefined ? `${sym}${major}` : `${currency} ${major}`
}

function formatFullTs(iso: string): string {
  return new Date(iso).toISOString()
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {})
}

function buildChecks(tx: TransactionEntry): ReadonlyArray<ComplianceCheckRow> {
  const rows: ComplianceCheckRow[] = []

  if (tx.complianceChecks.oasis !== undefined) {
    rows.push({ label: 'OASIS pre-session', result: tx.complianceChecks.oasis, marketGate: 'de' })
  }

  rows.push({ label: 'KYC verification', result: tx.complianceChecks.kyc })
  rows.push({ label: 'Monthly deposit limit', result: tx.complianceChecks.limit })

  return rows
}

export function TransactionDetailPanel({
  tx,
  open,
  onClose,
  onHold,
  onApprove,
  onReject,
}: TransactionDetailPanelProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectSelect, setShowRejectSelect] = useState(false)

  const panelTitle = tx.type === 'deposit' ? 'Deposit details' : 'Withdrawal details'
  const checks = buildChecks(tx)

  const handleReject = useCallback(() => {
    if (rejectReason === '') return
    onReject(tx.id, rejectReason)
    setRejectReason('')
    setShowRejectSelect(false)
  }, [tx.id, rejectReason, onReject])

  const showDecisionPanel = tx.type === 'withdrawal' && (tx.status === 'pending' || tx.status === 'held')
  const showOutcome = tx.status === 'completed' || tx.status === 'rejected'

  return (
    <SlideInPanel open={open} onClose={onClose} title={panelTitle}>
      <div className={styles['body']}>
        {/* 1. Transaction summary */}
        <div className={styles['summaryCard']}>
          <div className={styles['amountRow']}>
            <span className={styles['amount']}>{formatAmount(tx.amount, tx.currency)}</span>
            <span className={[styles['typePill'], tx.type === 'deposit' ? styles['typeDeposit'] : styles['typeWithdrawal']].filter(Boolean).join(' ')}>
              {tx.type === 'deposit' ? '\u2193 Deposit' : '\u2191 Withdrawal'}
            </span>
          </div>
          <div className={styles['metaRow']}>
            <span className={styles['metaLabel']}>Timestamp</span>
            <span className={styles['metaMono']}>{formatFullTs(tx.occurredAt)}</span>
          </div>
          <div className={styles['metaRow']}>
            <span className={styles['metaLabel']}>Provider</span>
            <ProviderBadge provider={tx.provider as 'trustly'} badgeStyle="filled" />
          </div>
          <div className={styles['metaRow']}>
            <span className={styles['metaLabel']}>Provider ref</span>
            <span className={styles['refRow']}>
              <span className={styles['metaMono']}>{tx.providerRef}</span>
              <IconButton icon={CopyIcon} label="Copy" size="sm" variant="ghost" onClick={() => copyToClipboard(tx.providerRef)} />
            </span>
          </div>
        </div>

        {/* 2. Player section */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Player</div>
          <div className={styles['playerCard']}>
            <div className={styles['playerLeft']}>
              <Avatar name={tx.player.name} size="md" />
              <div className={styles['playerInfo']}>
                <span className={styles['playerName']}>{tx.player.name}</span>
                <span className={styles['playerId']}>
                  {tx.player.id}
                  <IconButton icon={CopyIcon} label="Copy player ID" size="sm" variant="ghost" onClick={() => copyToClipboard(tx.player.id)} />
                </span>
              </div>
            </div>
            <Badge variant="approved" size="sm" label="KYC verified" />
          </div>
        </div>

        {/* 3. Compliance checks */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Compliance checks</div>
          <div className={styles['checksList']}>
            {checks.map((check) => (
              <div key={check.label} className={styles['checkRow']}>
                <span className={styles['checkLabel']}>{check.label}</span>
                <span className={styles['checkResult']}>
                  <StatusDot status={CHECK_DOT[check.result]} size="sm" />
                  <span className={check.result === 'fail' ? styles['checkFail'] : undefined}>{CHECK_LABEL[check.result]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Decision panel (withdrawals only) */}
        {showDecisionPanel && (
          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Decision</div>
            <div className={styles['decisionCard']}>
              {showRejectSelect && (
                <div className={styles['rejectSelect']}>
                  <select
                    className={styles['select']}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    <option value="">Select rejection reason…</option>
                    {REJECT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className={styles['decisionActions']}>
                <Button variant="primary" size="sm" onClick={() => onApprove(tx.id)}>
                  {tx.status === 'held' ? 'Approve & release' : 'Approve'}
                </Button>
                {tx.status === 'pending' && (
                  <Button variant="secondary" size="sm" onClick={() => onHold(tx.id)}>Hold</Button>
                )}
                {!showRejectSelect ? (
                  <Button variant="danger" size="sm" onClick={() => setShowRejectSelect(true)}>Reject</Button>
                ) : (
                  <Button variant="danger" size="sm" disabled={rejectReason === ''} onClick={handleReject}>Confirm rejection</Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4b. Outcome (completed/rejected) */}
        {showOutcome && (
          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Outcome</div>
            <div className={styles['outcomeCard']}>
              <Badge variant={tx.status === 'completed' ? 'approved' : 'rejected'} size="sm" />
              <span className={styles['outcomeMeta']}>Processed {formatFullTs(tx.occurredAt)}</span>
            </div>
          </div>
        )}
      </div>
    </SlideInPanel>
  )
}
