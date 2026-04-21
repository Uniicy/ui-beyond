import { type HTMLAttributes } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { EmptyState } from '../empty-state'
import { IconButton } from '../icon-button'
import { StatusDot } from '../status-dot'
import styles from './lugas-sync-panel.module.css'

interface SyncHistoryEntry {
  readonly syncedAt: string
  readonly playersSynced: number
  readonly failures: number
  readonly durationMs: number
}

interface PlayerAtLimit {
  readonly id: string
  readonly name: string
  readonly amount: number
  readonly resetAt: string
}

type SyncStatus = 'healthy' | 'degraded' | 'failed' | 'syncing'

export interface LugasSyncPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly syncStatus: SyncStatus
  readonly lastSyncAt: string
  readonly lastSyncDurationMs: number
  readonly playersSynced: number
  readonly playersAtLimit: number
  readonly failuresToday: number
  readonly syncHistory: ReadonlyArray<SyncHistoryEntry>
  readonly playersAtLimitList: ReadonlyArray<PlayerAtLimit>
  readonly brandMarket: string
  readonly onRetrySync: () => void
}

const STATUS_DOT: Record<SyncStatus, 'live' | 'ok' | 'warning' | 'error' | 'pending'> = {
  healthy: 'ok', degraded: 'warning', failed: 'error', syncing: 'pending',
}

const STATUS_BADGE: Record<SyncStatus, { variant: string; label: string }> = {
  healthy: { variant: 'approved', label: 'Healthy' },
  degraded: { variant: 'pending', label: 'Degraded' },
  failed: { variant: 'rejected', label: 'Failed' },
  syncing: { variant: 'manual_review', label: 'Syncing' },
}

const RefreshIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 6.5A5.5 5.5 0 0 1 13 6M13.5 9.5A5.5 5.5 0 0 1 3 10" /><path d="M13 3v3h-3M3 13v-3h3" /></svg>
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function LugasSyncPanel({
  syncStatus, lastSyncAt, lastSyncDurationMs, playersSynced, playersAtLimit, failuresToday,
  syncHistory, playersAtLimitList, brandMarket, onRetrySync, className, ...props
}: LugasSyncPanelProps) {
  if (brandMarket !== 'de') {
    return (
      <EmptyState
        variant="no-data"
        title="LUGAS not applicable"
        description={`The LUGAS register applies to German-licensed brands only (GGL/GwG). This brand operates under ${brandMarket.toUpperCase()} licensing.`}
      />
    )
  }

  const badge = STATUS_BADGE[syncStatus]
  const wrapperClassNames = [styles['wrapper'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      {/* Header */}
      <div className={styles['headerCard']}>
        <div className={styles['headerLeft']}>
          <StatusDot status={STATUS_DOT[syncStatus]} size="md" pulse={syncStatus === 'syncing'} />
          <div>
            <div className={styles['headerTitle']}>LUGAS sync</div>
            <div className={styles['headerMeta']}>Last sync: {formatRelative(lastSyncAt)} {'\u00b7'} {formatDuration(lastSyncDurationMs)}</div>
          </div>
        </div>
        <div className={styles['headerRight']}>
          <Badge variant={badge.variant as 'approved'} size="sm" label={badge.label} />
          <IconButton icon={RefreshIcon} label="Retry sync" size="sm" variant="outline" loading={syncStatus === 'syncing'} disabled={syncStatus === 'syncing'} onClick={onRetrySync} />
        </div>
      </div>

      {/* Stats */}
      <div className={styles['stats']}>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Players synced</div>
          <div className={styles['statValue']}>{playersSynced.toLocaleString('en')}</div>
        </div>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Failures today</div>
          <div className={`${styles['statValue']} ${failuresToday > 0 ? styles['statDanger'] : ''}`}>{failuresToday}</div>
        </div>
        <div className={styles['statCard']}>
          <div className={styles['statLabel']}>Players at \u20ac1,000 limit</div>
          <div className={`${styles['statValue']} ${playersAtLimit > 0 ? styles['statWarning'] : ''}`}>{playersAtLimit}</div>
        </div>
      </div>

      {/* History */}
      <div>
        <div className={styles['sectionTitle']}>Sync history</div>
        <div className={styles['historyHeader']}>
          <span>Time</span><span>Players synced</span><span>Failures</span><span>Duration</span>
        </div>
        {syncHistory.slice(0, 10).map((h, i) => (
          <div key={i} className={`${styles['historyRow']} ${h.failures > 0 ? styles['historyRowFail'] : ''}`}>
            <span className={styles['historyTs']}>{formatTs(h.syncedAt)}</span>
            <span>{h.playersSynced.toLocaleString('en')}</span>
            <span className={h.failures > 0 ? styles['historyFail'] : ''}>{h.failures}</span>
            <span className={styles['historyDuration']}>{formatDuration(h.durationMs)}</span>
          </div>
        ))}
      </div>

      {/* Players at limit */}
      {playersAtLimitList.length > 0 && (
        <div>
          <div className={styles['sectionTitle']}>Players at monthly cap (\u20ac1,000)</div>
          <div className={styles['playersGrid']}>
            {playersAtLimitList.slice(0, 9).map((p) => (
              <div key={p.id} className={styles['playerItem']}>
                <Avatar name={p.name} size="xs" />
                <span className={styles['playerName']}>{p.name}</span>
                <span className={styles['playerAmount']}>\u20ac{p.amount.toLocaleString('en')}</span>
                <span className={styles['playerReset']}>Resets {formatDate(p.resetAt)}</span>
              </div>
            ))}
          </div>
          {playersAtLimitList.length > 9 && (
            <button type="button" className={styles['viewAllLink']}>View all {playersAtLimitList.length} {'\u2192'}</button>
          )}
        </div>
      )}
    </div>
  )
}
