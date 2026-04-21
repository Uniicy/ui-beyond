import { useState, useRef, useEffect } from 'react'
import { AlertTimeline, type AlertTimelineItem } from '../alert-timeline'
import type { AmlAlert } from '../alert-row'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { RiskScore } from '../risk-score'
import { SlideInPanel } from '../slide-in-panel'
import { TransactionSummaryTable, type Transaction } from '../transaction-summary-table'
import styles from './alert-detail-panel.module.css'

interface Agent {
  readonly id: string
  readonly name: string
}

export interface AlertDetailPanelProps {
  readonly alert: AmlAlert
  readonly transactions: ReadonlyArray<Transaction>
  readonly timeline: ReadonlyArray<AlertTimelineItem>
  readonly agents: ReadonlyArray<Agent>
  readonly currentAgent: Agent
  readonly open: boolean
  readonly onClose: () => void
  readonly onDismiss: (reason: string) => void
  readonly onEscalate: (note: string) => void
  readonly onCreateSAR: () => void
  readonly onAssign: (agentId: string) => void
  readonly onAddNote: (text: string) => void
}

const DISMISS_REASONS = ['Not suspicious', 'Duplicate alert', 'False positive', 'Other'] as const

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

function formatCurrency(minorUnits: number, currency: string): string {
  const major = (minorUnits / 100).toLocaleString('en', { minimumFractionDigits: 0 })
  const sym = CURRENCY_SYMBOLS[currency]
  return sym !== undefined ? `${sym}${major}` : `${currency} ${major}`
}

export function AlertDetailPanel({
  alert: a,
  transactions,
  timeline,
  agents,
  currentAgent,
  open,
  onClose,
  onDismiss,
  onEscalate,
  onCreateSAR,
  onAssign,
  onAddNote,
}: AlertDetailPanelProps) {
  const [confirmAction, setConfirmAction] = useState<'dismiss' | 'escalate' | null>(null)
  const [dismissReason, setDismissReason] = useState<string>(DISMISS_REASONS[0])
  const [escalateNote, setEscalateNote] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const assignRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!assignOpen) return
    function handleClick(e: MouseEvent) {
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) {
        setAssignOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [assignOpen])

  const handleDismissConfirm = () => {
    onDismiss(dismissReason)
    setConfirmAction(null)
  }

  const handleEscalateConfirm = () => {
    onEscalate(escalateNote)
    setConfirmAction(null)
    setEscalateNote('')
  }

  const isEnhancedCdd = a.severity === 'high' || a.severity === 'critical'

  const footer = (
    <div className={styles['footer']}>
      <div className={styles['footerLeft']} ref={assignRef}>
        <button type="button" className={styles['assignBtn']} onClick={() => setAssignOpen((p) => !p)}>
          {a.assignedAgent !== undefined ? (
            <><Avatar name={a.assignedAgent.name} size="xs" /> {a.assignedAgent.name}</>
          ) : (
            'Assign to \u25BE'
          )}
        </button>
        {assignOpen && (
          <div className={styles['assignDropdown']}>
            {agents.map((agent) => (
              <button
                key={agent.id}
                type="button"
                className={styles['assignItem']}
                onClick={() => { onAssign(agent.id); setAssignOpen(false) }}
              >
                <Avatar name={agent.name} size="xs" />
                {agent.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles['footerRight']}>
        {confirmAction === null ? (
          <>
            <Button variant="danger" size="sm" onClick={() => setConfirmAction('dismiss')}>Dismiss</Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirmAction('escalate')}>Escalate</Button>
            <Button variant="primary" size="sm" onClick={onCreateSAR}>Create SAR {'\u2192'}</Button>
          </>
        ) : confirmAction === 'dismiss' ? (
          <div className={styles['inlineConfirm']}>
            <select
              className={styles['reasonSelect']}
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
            >
              {DISMISS_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <Button variant="danger" size="sm" onClick={handleDismissConfirm}>Confirm dismiss</Button>
            <button type="button" className={styles['cancelLink']} onClick={() => setConfirmAction(null)}>Cancel</button>
          </div>
        ) : (
          <div className={styles['inlineConfirm']}>
            <input
              className={styles['noteInput']}
              placeholder="Escalation reason..."
              value={escalateNote}
              onChange={(e) => setEscalateNote(e.target.value)}
            />
            <Button variant="secondary" size="sm" onClick={handleEscalateConfirm}>Confirm escalate</Button>
            <button type="button" className={styles['cancelLink']} onClick={() => setConfirmAction(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SlideInPanel
      open={open}
      onClose={onClose}
      title={a.ruleName}
      subtitle={`Alert \u00b7 ${a.id}`}
      footer={footer}
    >
      {/* Transactions */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Transactions</div>
        <div className={styles['ruleTrigger']}>
          Triggered by rule: <strong>{a.ruleName}</strong>
        </div>
        <TransactionSummaryTable
          transactions={transactions}
          currency={a.currency}
          totalAmount={a.totalAmount}
        />
      </div>

      {/* Player */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Player</div>
        <div className={styles['playerCard']}>
          <div className={styles['playerLeft']}>
            <Avatar name={a.player.name} size="md" />
            <div className={styles['playerInfo']}>
              <span className={styles['playerName']}>{a.player.name}</span>
              <span className={styles['playerId']}>{a.player.id}</span>
            </div>
          </div>
          <div className={styles['playerGrid']}>
            <div className={styles['gridItem']}>
              <span className={styles['gridLabel']}>KYC status</span>
              <span className={styles['gridValue']}><Badge variant="approved" size="sm" /></span>
            </div>
            <div className={styles['gridItem']}>
              <span className={styles['gridLabel']}>AML risk tier</span>
              <span className={styles['gridValue']}>
                <Badge variant={isEnhancedCdd ? 'high_risk' : 'standard'} size="sm" />
              </span>
            </div>
            <div className={styles['gridItem']}>
              <span className={styles['gridLabel']}>30-day deposits</span>
              <span className={styles['gridValueMono']}>{formatCurrency(a.totalAmount * 4, a.currency)}</span>
            </div>
            <div className={styles['gridItem']}>
              <span className={styles['gridLabel']}>Previous alerts</span>
              <span className={styles['gridValue']}>2 alerts {'\u00b7'} 1 dismissed</span>
            </div>
          </div>
        </div>
        {isEnhancedCdd && (
          <div className={styles['cddNote']}>Enhanced due diligence required</div>
        )}
      </div>

      {/* Risk score */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Risk score</div>
        <RiskScore score={a.riskScore} mode="full" showLabel />
      </div>

      {/* Timeline */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Timeline</div>
        <AlertTimeline
          items={timeline}
          onAddNote={onAddNote}
          currentAgent={currentAgent}
        />
      </div>
    </SlideInPanel>
  )
}
