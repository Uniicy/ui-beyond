import { useState, useCallback } from 'react'
import { AlertTimeline, type AlertTimelineItem } from '../alert-timeline'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { SlaCountdown } from '../sla-countdown'
import styles from './compliance-flag-card.module.css'

type Severity = 'low' | 'medium' | 'high' | 'critical'
type FlagStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'

export interface ComplianceFlag {
  readonly id: string
  readonly type: string
  readonly severity: Severity
  readonly player: { readonly id: string; readonly name: string }
  readonly raisedAt: string
  readonly resolutionDeadline: string
  readonly resolutionCreatedAt: string
  readonly status: FlagStatus
  readonly assignedAgent?: { readonly id: string; readonly name: string }
  readonly notesCount: number
  readonly timeline: ReadonlyArray<AlertTimelineItem>
}

interface Agent {
  readonly name: string
  readonly id: string
}

export interface ComplianceFlagCardProps {
  readonly flag: ComplianceFlag
  readonly currentAgent: Agent
  readonly agents: ReadonlyArray<Agent>
  readonly onAddNote: (flagId: string, text: string) => void
  readonly onAssign: (flagId: string, agentId: string) => void
  readonly onClose: (flagId: string, resolution: string) => void
  readonly onDismiss: (flagId: string, reason: string) => void
  readonly className?: string
}

const SEVERITY_BORDER: Record<Severity, string | undefined> = {
  critical: styles['borderCritical'],
  high: styles['borderHigh'],
  medium: styles['borderMedium'],
  low: undefined,
}

const STATUS_BADGE: Record<FlagStatus, string> = {
  open: 'pending',
  investigating: 'manual_review',
  resolved: 'approved',
  dismissed: 'expired',
}

const ChevronDown = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <path d="M4 6l4 4 4-4" />
  </svg>
)

export function ComplianceFlagCard({
  flag,
  currentAgent,
  agents,
  onAddNote,
  onAssign,
  onClose: onCloseFlag,
  onDismiss,
  className,
}: ComplianceFlagCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [dismissReason, setDismissReason] = useState('')
  const [closeResolution, setCloseResolution] = useState('')
  const [showDismissInput, setShowDismissInput] = useState(false)
  const [showCloseInput, setShowCloseInput] = useState(false)

  const isClosed = flag.status === 'resolved' || flag.status === 'dismissed'

  const handleDismiss = useCallback(() => {
    if (!showDismissInput) {
      setShowDismissInput(true)
      setShowCloseInput(false)
      return
    }
    if (dismissReason.trim() === '') return
    onDismiss(flag.id, dismissReason.trim())
    setDismissReason('')
    setShowDismissInput(false)
  }, [showDismissInput, dismissReason, flag.id, onDismiss])

  const handleClose = useCallback(() => {
    if (!showCloseInput) {
      setShowCloseInput(true)
      setShowDismissInput(false)
      return
    }
    if (closeResolution.trim() === '') return
    onCloseFlag(flag.id, closeResolution.trim())
    setCloseResolution('')
    setShowCloseInput(false)
  }, [showCloseInput, closeResolution, flag.id, onCloseFlag])

  const cardCls = [
    styles['card'],
    SEVERITY_BORDER[flag.severity],
    isClosed && styles['muted'],
    className,
  ].filter(Boolean).join(' ')

  const chevronCls = [styles['chevron'], expanded && styles['chevronExpanded']].filter(Boolean).join(' ')

  return (
    <div className={cardCls}>
      {/* Collapsed header */}
      <div
        className={styles['header']}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v) }}
      >
        <Badge variant={flag.severity as 'low'} size="sm" />
        <span className={styles['flagType']}>{flag.type}</span>
        <div className={styles['playerInfo']}>
          <Avatar name={flag.player.name} size="xs" />
          <span className={styles['playerName']}>{flag.player.name}</span>
        </div>
        <div className={styles['slaCell']}>
          <SlaCountdown createdAt={flag.resolutionCreatedAt} deadline={flag.resolutionDeadline} mode="inline" paused={isClosed} />
        </div>
        <Badge variant={STATUS_BADGE[flag.status] as 'pending'} size="sm" />
        <div className={styles['agentCell']}>
          {flag.assignedAgent !== undefined ? (
            <Avatar name={flag.assignedAgent.name} size="xs" tooltip />
          ) : (
            <span className={styles['unassigned']}>{'\u2014'}</span>
          )}
        </div>
        <span className={styles['notesCount']}>{flag.notesCount} notes</span>
        <span className={chevronCls}>{ChevronDown}</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className={styles['expandedBody']}>
          <AlertTimeline
            items={[...flag.timeline]}
            onAddNote={(text) => onAddNote(flag.id, text)}
            currentAgent={currentAgent}
          />

          {/* Footer actions */}
          {!isClosed && (
            <div className={styles['footer']}>
              <div className={styles['footerLeft']}>
                <label className={styles['assignLabel']}>
                  Assign to
                  <select
                    className={styles['assignSelect']}
                    value={flag.assignedAgent?.id ?? ''}
                    onChange={(e) => { if (e.target.value !== '') onAssign(flag.id, e.target.value) }}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles['footerRight']}>
                {(showDismissInput || showCloseInput) && (
                  <div className={styles['inlineInput']}>
                    <input
                      type="text"
                      className={styles['reasonInput']}
                      placeholder={showDismissInput ? 'Reason for dismissal\u2026' : 'Resolution summary\u2026'}
                      value={showDismissInput ? dismissReason : closeResolution}
                      onChange={(e) => showDismissInput ? setDismissReason(e.target.value) : setCloseResolution(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles['dangerGhost']}
                  onClick={handleDismiss}
                  disabled={showDismissInput && dismissReason.trim() === ''}
                >
                  {showDismissInput ? 'Confirm dismiss' : 'Dismiss'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleClose}
                  disabled={showCloseInput && closeResolution.trim() === ''}
                >
                  {showCloseInput ? 'Confirm close' : 'Close flag'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
