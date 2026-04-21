import { useState } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { ProviderBadge } from '../provider-badge'
import { SlaCountdown } from '../sla-countdown'
import { SlideInPanel } from '../slide-in-panel'
import type { Verification } from '../verification-row'
import styles from './verification-detail-panel.module.css'

interface Agent {
  readonly id: string
  readonly name: string
}

export interface VerificationDetailPanelProps {
  readonly verification: Verification
  readonly onApprove: () => void
  readonly onReject: (reason: string) => void
  readonly onRequestInfo: (message: string) => void
  readonly onAssign: (agentId: string) => void
  readonly agents: ReadonlyArray<Agent>
  readonly open: boolean
  readonly onClose: () => void
}

const DOC_ICONS: Record<string, string> = {
  passport: '\u{1F4C4}',
  id_card: '\u{1F4B3}',
  driving_licence: '\u{1F697}',
}

const DOC_LABELS: Record<string, string> = {
  passport: 'Passport',
  id_card: 'ID Card',
  driving_licence: 'Driving Licence',
}

export function VerificationDetailPanel({
  verification: v,
  onApprove,
  onReject,
  onRequestInfo,
  onAssign,
  agents,
  open,
  onClose,
}: VerificationDetailPanelProps) {
  const [note, setNote] = useState('')
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [requestMode, setRequestMode] = useState(false)
  const [requestMsg, setRequestMsg] = useState('')

  const handleApproveConfirm = () => {
    onApprove()
    setConfirmAction(null)
  }

  const handleRejectConfirm = () => {
    onReject(rejectReason)
    setConfirmAction(null)
    setRejectReason('')
  }

  const handleRequestInfo = () => {
    onRequestInfo(requestMsg)
    setRequestMode(false)
    setRequestMsg('')
  }

  const footer = (
    <div className={styles['footer']}>
      <div className={styles['footerLeft']}>
        {!requestMode ? (
          <Button variant="ghost" size="sm" onClick={() => setRequestMode(true)}>
            Request more info
          </Button>
        ) : (
          <div className={styles['requestRow']}>
            <input
              className={styles['requestInput']}
              placeholder="What info is needed?"
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
            />
            <Button variant="secondary" size="sm" onClick={handleRequestInfo}>Send</Button>
            <Button variant="ghost" size="sm" onClick={() => setRequestMode(false)}>Cancel</Button>
          </div>
        )}
      </div>

      <div className={styles['footerRight']}>
        {confirmAction === null ? (
          <>
            <Button variant="danger" size="sm" onClick={() => setConfirmAction('reject')}>
              Reject
            </Button>
            <Button variant="primary" size="sm" onClick={() => setConfirmAction('approve')}>
              Approve
            </Button>
          </>
        ) : confirmAction === 'approve' ? (
          <div className={styles['confirm']}>
            <span className={styles['confirmText']}>Approve this verification?</span>
            <Button variant="primary" size="sm" onClick={handleApproveConfirm}>Confirm</Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)}>Cancel</Button>
          </div>
        ) : (
          <div className={styles['confirm']}>
            <input
              className={styles['requestInput']}
              placeholder="Rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ width: 180 }}
            />
            <Button variant="danger" size="sm" onClick={handleRejectConfirm}>Confirm reject</Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SlideInPanel
      open={open}
      onClose={onClose}
      title="Verification detail"
      subtitle={`${v.id} \u00b7 ${v.player.name}`}
      footer={footer}
    >
      {/* Document section */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Document</div>
        <div className={styles['docRow']}>
          <div className={styles['docIcon']}>{DOC_ICONS[v.documentType] ?? '\u{1F4C4}'}</div>
          <div className={styles['docInfo']}>
            <span className={styles['docType']}>{DOC_LABELS[v.documentType] ?? v.documentType}</span>
            <span className={styles['docMeta']}>
              <ProviderBadge provider={v.provider} /> {'\u00b7'} Submitted {new Date(v.slaCreatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <SlaCountdown createdAt={v.slaCreatedAt} deadline={v.slaDeadline} paused={v.slaPaused} mode="full" />
        <Badge variant={v.status as 'pending'} size="sm" style={{ marginTop: 10 }} />
      </div>

      {/* Player section */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Player</div>
        <div className={styles['playerRow']}>
          <Avatar name={v.player.name} size="md" />
          <div className={styles['playerInfo']}>
            <span className={styles['playerName']}>{v.player.name}</span>
            <span className={styles['playerEmail']}>{v.player.email}</span>
            <span className={styles['playerId']}>{v.player.id}</span>
          </div>
        </div>
        <div className={styles['history']}>3 previous verifications {'\u00b7'} 2 rejected</div>
      </div>

      {/* Notes section */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Notes</div>
        <textarea
          className={styles['textarea']}
          rows={3}
          placeholder="Add investigation note\u2026"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {note !== '' && (
          <div className={styles['noteSubmit']}>
            <Button variant="secondary" size="sm" onClick={() => setNote('')}>
              Add note
            </Button>
          </div>
        )}
      </div>

      {/* Assign section */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Assignment</div>
        <div className={styles['assignRow']}>
          {v.assignedAgent !== undefined ? (
            <Avatar name={v.assignedAgent.name} size="sm" tooltip />
          ) : (
            <Avatar name="Unassigned" size="sm" unassigned />
          )}
          <span className={styles['assignLabel']}>
            {v.assignedAgent?.name ?? 'Unassigned'}
          </span>
          <select
            className={styles['assignSelect']}
            value={v.assignedAgent?.id ?? ''}
            onChange={(e) => onAssign(e.target.value)}
          >
            <option value="">Reassign to...</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>
    </SlideInPanel>
  )
}
