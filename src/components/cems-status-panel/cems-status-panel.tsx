import { type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import { EmptyState } from '../empty-state'
import { IconButton } from '../icon-button'
import { StatusDot } from '../status-dot'
import styles from './cems-status-panel.module.css'

type ReportStatus = 'healthy' | 'degraded' | 'failed' | 'reporting'

interface ReportHistoryEntry {
  readonly reportedAt: string
  readonly transactionCount: number
  readonly status: 'success' | 'failed'
  readonly durationMs: number
}

export interface CemsStatusPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly reportStatus: ReportStatus
  readonly lastReportAt: string
  readonly reportsToday: number
  readonly transactionsReported: number
  readonly failuresToday: number
  readonly reportHistory: ReadonlyArray<ReportHistoryEntry>
  readonly brandMarket: string
  readonly onManualReport: () => void
}

const STATUS_DOT: Record<ReportStatus, 'ok' | 'warning' | 'error' | 'pending'> = {
  healthy: 'ok', degraded: 'warning', failed: 'error', reporting: 'pending',
}

const STATUS_BADGE: Record<ReportStatus, { variant: string; label: string }> = {
  healthy: { variant: 'approved', label: 'Healthy' },
  degraded: { variant: 'pending', label: 'Degraded' },
  failed: { variant: 'rejected', label: 'Failed' },
  reporting: { variant: 'manual_review', label: 'Reporting' },
}

const ReportIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 14V4l4-2 4 2 4-2v10l-4 2-4-2-4 2Z" /><path d="M6 2v12M10 4v12" /></svg>
)

function formatRelative(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function formatTs(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`
}

export function CemsStatusPanel({
  reportStatus, lastReportAt, reportsToday, transactionsReported, failuresToday,
  reportHistory, brandMarket, onManualReport, className, ...props
}: CemsStatusPanelProps) {
  if (brandMarket !== 'mu') {
    return (
      <EmptyState
        variant="no-data"
        title="MRA CEMS not applicable"
        description="Real-time transaction reporting to the Mauritius Revenue Authority applies to MU-licensed brands only."
      />
    )
  }

  const badge = STATUS_BADGE[reportStatus]
  const wrapperClassNames = [styles['wrapper'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      {/* Header */}
      <div className={styles['headerCard']}>
        <div className={styles['headerLeft']}>
          <StatusDot status={STATUS_DOT[reportStatus]} size="md" pulse={reportStatus === 'reporting'} />
          <div>
            <div className={styles['headerTitle']}>MRA CEMS reporting</div>
            <div className={styles['headerMeta']}>Last report: {formatRelative(lastReportAt)}</div>
          </div>
        </div>
        <div className={styles['headerRight']}>
          <Badge variant={badge.variant as 'approved'} size="sm" label={badge.label} />
          <IconButton icon={ReportIcon} label="Manual report" size="sm" variant="outline" loading={reportStatus === 'reporting'} disabled={reportStatus === 'reporting'} onClick={onManualReport} />
        </div>
      </div>

      {/* Stats */}
      <div className={styles['stats']}>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Reports today</div>
          <div className={styles['statValue']}>{reportsToday.toLocaleString('en')}</div>
        </div>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Transactions reported</div>
          <div className={styles['statValue']}>{transactionsReported.toLocaleString('en')}</div>
        </div>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Failures today</div>
          <div className={[styles['statValue'], failuresToday > 0 && styles['statDanger']].filter(Boolean).join(' ')}>{failuresToday}</div>
        </div>
      </div>

      {/* History */}
      <div>
        <div className={styles['sectionTitle']}>Report history</div>
        <div className={styles['historyHeader']}>
          <span>Time</span><span>Tx count</span><span>Status</span><span>Duration</span>
        </div>
        {reportHistory.slice(0, 10).map((h) => (
          <div key={h.reportedAt} className={[styles['historyRow'], h.status === 'failed' && styles['historyRowFail']].filter(Boolean).join(' ')}>
            <span className={styles['historyTs']}>{formatTs(h.reportedAt)}</span>
            <span>{h.transactionCount.toLocaleString('en')}</span>
            <span className={h.status === 'failed' ? styles['historyFail'] : styles['historySuccess']}>
              <StatusDot status={h.status === 'success' ? 'ok' : 'error'} size="sm" />
              {h.status === 'success' ? 'Success' : 'Failed'}
            </span>
            <span className={styles['historyDuration']}>{formatDuration(h.durationMs)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
