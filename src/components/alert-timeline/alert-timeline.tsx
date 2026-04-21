import { useState } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import styles from './alert-timeline.module.css'

type ItemType =
  | 'note_added' | 'status_changed' | 'assigned' | 'escalated' | 'dismissed' | 'sar_linked' | 'created'
  | 'kyc_approved' | 'kyc_rejected' | 'kyc_manual_review'
  | 'aml_alert_created'
  | 'rg_exclusion_applied' | 'rg_exclusion_expired' | 'rg_limit_set' | 'rg_limit_reached'
  | 'deposit_completed' | 'withdrawal_approved' | 'withdrawal_rejected'
  | 'login' | 'player_created'

type TimelineModule = 'kyc' | 'aml' | 'rg' | 'psp' | 'system'

export interface AlertTimelineItem {
  readonly id: string
  readonly type: ItemType
  readonly agent: { readonly name: string; readonly id: string }
  readonly timestamp: string
  readonly content?: string
  readonly metadata?: Readonly<Record<string, string>>
  readonly module?: TimelineModule
}

interface Agent {
  readonly name: string
  readonly id: string
}

export interface AlertTimelineProps {
  readonly items: ReadonlyArray<AlertTimelineItem>
  readonly onAddNote: (text: string) => void
  readonly currentAgent: Agent
  readonly loading?: boolean
  readonly className?: string
}

const DOT_CLASS: Record<ItemType, string> = {
  created: styles['dotCreated'] ?? '',
  note_added: styles['dotNoteAdded'] ?? '',
  status_changed: styles['dotStatusChanged'] ?? '',
  assigned: styles['dotAssigned'] ?? '',
  escalated: styles['dotEscalated'] ?? '',
  dismissed: styles['dotDismissed'] ?? '',
  sar_linked: styles['dotSarLinked'] ?? '',
  kyc_approved: styles['dotKycApproved'] ?? '',
  kyc_rejected: styles['dotKycRejected'] ?? '',
  kyc_manual_review: styles['dotKycManualReview'] ?? '',
  aml_alert_created: styles['dotAmlAlertCreated'] ?? '',
  rg_exclusion_applied: styles['dotRgExclusionApplied'] ?? '',
  rg_exclusion_expired: styles['dotRgExclusionExpired'] ?? '',
  rg_limit_set: styles['dotRgLimitSet'] ?? '',
  rg_limit_reached: styles['dotRgLimitReached'] ?? '',
  deposit_completed: styles['dotDepositCompleted'] ?? '',
  withdrawal_approved: styles['dotWithdrawalApproved'] ?? '',
  withdrawal_rejected: styles['dotWithdrawalRejected'] ?? '',
  login: styles['dotLogin'] ?? '',
  player_created: styles['dotPlayerCreated'] ?? '',
}

const ACTION_TEXT: Record<ItemType, string> = {
  created: 'created this alert',
  note_added: 'added a note',
  status_changed: 'changed status',
  assigned: 'assigned this alert',
  escalated: 'escalated this alert',
  dismissed: 'dismissed this alert',
  sar_linked: 'linked a SAR filing',
  kyc_approved: 'Identity verification approved',
  kyc_rejected: 'Identity verification rejected',
  kyc_manual_review: 'Verification referred to manual review',
  aml_alert_created: 'AML alert raised',
  rg_exclusion_applied: 'Self-exclusion applied',
  rg_exclusion_expired: 'Exclusion period ended',
  rg_limit_set: 'Deposit limit updated',
  rg_limit_reached: 'Deposit limit reached',
  deposit_completed: 'Deposit completed',
  withdrawal_approved: 'Withdrawal approved',
  withdrawal_rejected: 'Withdrawal rejected',
  login: 'Player logged in',
  player_created: 'Player account created',
}

const MODULE_LABELS: Record<TimelineModule, string> = {
  kyc: 'KYC',
  aml: 'AML',
  rg: 'RG',
  psp: 'PSP',
  system: 'System',
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  const now = Date.now()
  const diffMin = Math.floor((now - d.getTime()) / 60_000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function AlertTimeline({
  items,
  onAddNote,
  currentAgent,
  loading = false,
  className,
}: AlertTimelineProps) {
  const [noteExpanded, setNoteExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    if (noteText.trim() === '') return
    setSubmitting(true)
    onAddNote(noteText.trim())
    setTimeout(() => {
      setNoteText('')
      setNoteExpanded(false)
      setSubmitting(false)
    }, 400)
  }

  const wrapperClassNames = [styles['timeline'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames}>
      {/* Add note form */}
      <div className={styles['noteForm']}>
        {!noteExpanded ? (
          <div
            className={styles['noteCollapsed']}
            onClick={() => setNoteExpanded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setNoteExpanded(true) }}
          >
            Add investigation note...
          </div>
        ) : (
          <div className={styles['noteExpanded']}>
            <Avatar name={currentAgent.name} size="xs" />
            <div className={styles['noteTextarea']}>
              <textarea
                className={styles['textarea']}
                rows={3}
                placeholder="Write your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                autoFocus
              />
              <div className={styles['noteActions']}>
                <button
                  type="button"
                  className={styles['cancelLink']}
                  onClick={() => { setNoteExpanded(false); setNoteText('') }}
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={noteText.trim() === '' || submitting}
                >
                  {submitting ? 'Posting...' : 'Post note'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className={styles['items']}>
        {loading ? (
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={styles['skeleton']}>
              <div className={styles['skeletonDot']} />
              <div className={styles['skeletonBar']} style={{ width: '60%', marginBottom: 6 }} />
              <div className={styles['skeletonBar']} style={{ width: '40%' }} />
            </div>
          ))
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles['item']}>
              <div className={`${styles['dot']} ${DOT_CLASS[item.type]}`} />
              <div className={styles['itemHeader']}>
                <Avatar name={item.agent.name} size="xs" />
                <span className={styles['agentName']}>{item.agent.name}</span>
                <span className={styles['actionText']}>{ACTION_TEXT[item.type]}</span>
                {item.module !== undefined && (
                  <span className={styles['moduleTag']}>{MODULE_LABELS[item.module]}</span>
                )}
                <span className={styles['timestamp']}>{formatTimestamp(item.timestamp)}</span>
              </div>

              {/* Note content */}
              {item.type === 'note_added' && item.content !== undefined && (
                <div className={styles['noteBlock']}>{item.content}</div>
              )}

              {/* Status change */}
              {item.type === 'status_changed' && item.metadata !== undefined && (
                <div className={styles['statusChange']}>
                  <Badge variant="standard" size="sm" label={item.metadata['previousStatus'] ?? ''} />
                  <span className={styles['statusArrow']}>{'\u2192'}</span>
                  <Badge variant="enhanced" size="sm" label={item.metadata['newStatus'] ?? ''} />
                </div>
              )}

              {/* Assigned content */}
              {item.type === 'assigned' && item.content !== undefined && (
                <div className={styles['actionText']} style={{ marginTop: 4, fontSize: 11 }}>{item.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
