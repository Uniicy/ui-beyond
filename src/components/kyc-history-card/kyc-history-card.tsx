import { type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import { ProgressBar } from '../progress-bar'
import { ProviderBadge } from '../provider-badge'
import { SlaCountdown } from '../sla-countdown'
import styles from './kyc-history-card.module.css'

type VerificationStatus = 'approved' | 'rejected' | 'manual_review' | 'pending' | 'expired'
type DocumentType = 'passport' | 'id_card' | 'driving_licence'
type Provider = 'onfido' | 'jumio' | 'manual'

export interface KycVerification {
  readonly id: string
  readonly attemptNumber: number
  readonly status: VerificationStatus
  readonly documentType: DocumentType
  readonly provider: Provider
  readonly submittedAt: string
  readonly resolvedAt?: string
  readonly confidence?: number
  readonly rejectionReason?: string
  readonly slaDeadline?: string
  readonly slaCreatedAt?: string
}

export interface KycHistoryCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly verification: KycVerification
  readonly isLatest?: boolean
}

const STATUS_CLASS: Record<VerificationStatus, string> = {
  approved: styles['approved'] ?? '',
  rejected: styles['rejected'] ?? '',
  manual_review: styles['manualReview'] ?? '',
  pending: styles['pending'] ?? '',
  expired: styles['expired'] ?? '',
}

const DOC_LABELS: Record<DocumentType, string> = {
  passport: 'Passport',
  id_card: 'ID card',
  driving_licence: 'Driving licence',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDuration(startIso: string, endIso: string): string {
  const diffMs = new Date(endIso).getTime() - new Date(startIso).getTime()
  const totalMin = Math.floor(Math.abs(diffMs) / 60_000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0) return `Resolved in ${h}h ${m}m`
  return `Resolved in ${m}m`
}

export function KycHistoryCard({
  verification: v,
  isLatest = false,
  className,
  ...props
}: KycHistoryCardProps) {
  const cardClassNames = [
    styles['card'],
    STATUS_CLASS[v.status],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassNames} {...props}>
      {/* Header */}
      <div className={styles['headerRow']}>
        <div className={styles['headerLeft']}>
          <span className={styles['attemptLabel']}>Attempt {v.attemptNumber}</span>
          <Badge variant={v.status as 'approved'} size="sm" />
        </div>
        <div className={styles['headerRight']}>
          <ProviderBadge provider={v.provider} />
          {isLatest && <span className={styles['currentPill']}>Current</span>}
        </div>
      </div>

      {/* Details grid */}
      <div className={styles['grid']}>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Document</span>
          <span className={styles['gridValue']}>{DOC_LABELS[v.documentType]}</span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Submitted</span>
          <span className={styles['gridValue']}>{formatDate(v.submittedAt)}</span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Resolved</span>
          <span className={styles['gridValue']}>
            {v.resolvedAt !== undefined ? formatDate(v.resolvedAt) : 'Pending'}
          </span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Duration</span>
          <span className={styles['gridValue']}>
            {v.resolvedAt !== undefined ? formatDuration(v.submittedAt, v.resolvedAt) : '\u2014'}
          </span>
        </div>
      </div>

      {/* Approved: confidence */}
      {v.status === 'approved' && v.confidence !== undefined && (
        <div className={styles['confidenceRow']}>
          <span className={styles['confidenceLabel']}>Provider confidence:</span>
          <span className={styles['confidenceValue']}>{Math.round(v.confidence * 100)}%</span>
          <div className={styles['confidenceBar']}>
            <ProgressBar value={v.confidence * 100} height="xs" intent="success" rounded />
          </div>
        </div>
      )}

      {/* Rejected: reason */}
      {v.status === 'rejected' && v.rejectionReason !== undefined && (
        <div className={styles['rejectionBlock']}>{v.rejectionReason}</div>
      )}

      {/* Pending / manual_review: SLA */}
      {(v.status === 'pending' || v.status === 'manual_review') && v.slaDeadline !== undefined && v.slaCreatedAt !== undefined && (
        <SlaCountdown
          createdAt={v.slaCreatedAt}
          deadline={v.slaDeadline}
          paused={v.status === 'manual_review'}
          mode="full"
        />
      )}

      {/* Expired */}
      {v.status === 'expired' && (
        <span className={styles['expiredNote']}>Session expired without completion</span>
      )}
    </div>
  )
}
