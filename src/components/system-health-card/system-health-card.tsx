import { Badge } from '../badge'
import { SparklineBar } from '../sparkline-bar'
import { StatusDot } from '../status-dot'
import styles from './system-health-card.module.css'

type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown'

export interface ServiceHealth {
  readonly name: string; readonly displayName: string; readonly status: ServiceStatus
  readonly uptimePercent: number; readonly uptimeHistory: ReadonlyArray<number>
  readonly errorRatePercent: number; readonly latencyP95Ms: number
  readonly lastIncidentAt?: string
}

export interface SystemHealthCardProps {
  readonly service: ServiceHealth
  readonly onViewLogs?: (service: string) => void
  readonly className?: string
}

const STATUS_BADGE: Record<ServiceStatus, string> = { healthy: 'approved', degraded: 'pending', down: 'rejected', unknown: 'inactive' }

function uptimeClass(pct: number): string {
  if (pct >= 99) return styles['uptimeGood'] ?? ''
  if (pct >= 95) return styles['uptimeWarn'] ?? ''
  return styles['uptimeBad'] ?? ''
}

function formatRelative(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`
}

export function SystemHealthCard({ service: s, onViewLogs, className }: SystemHealthCardProps) {
  const cardCls = [
    styles['card'],
    s.status === 'degraded' ? styles['degraded'] : undefined,
    s.status === 'down' ? styles['down'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cardCls}>
      <div className={styles['header']}>
        <div className={styles['headerLeft']}>
          {s.status === 'down' && <StatusDot status="error" size="sm" pulse />}
          <span className={styles['serviceName']}>{s.displayName}</span>
        </div>
        <Badge variant={STATUS_BADGE[s.status] as 'approved'} size="sm" />
      </div>

      {s.status !== 'unknown' ? (
        <>
          <div className={styles['uptimeRow']}>
            <span className={`${styles['uptimeValue']} ${uptimeClass(s.uptimePercent)}`}>{s.uptimePercent.toFixed(2)}%</span>
            <span className={styles['uptimeLabel']}>uptime {'\u00b7'} 30d</span>
          </div>

          <div>
            <SparklineBar data={[...s.uptimeHistory]} height={28} />
            <span className={styles['sparklineLabel']}>Last 24h {'\u00b7'} each bar = 1 hour</span>
          </div>

          <div className={styles['metricsRow']}>
            <div className={styles['metric']}>
              <span className={styles['metricLabel']}>Error rate (1h)</span>
              <span className={`${styles['metricValue']} ${s.errorRatePercent > 1 ? styles['metricDanger'] : styles['metricOk']}`}>{s.errorRatePercent.toFixed(2)}%</span>
            </div>
            <div className={styles['metric']}>
              <span className={styles['metricLabel']}>P95 latency (1h)</span>
              <span className={`${styles['metricValue']} ${s.latencyP95Ms > 2000 ? styles['metricDanger'] : s.latencyP95Ms > 500 ? styles['metricWarn'] : styles['metricOk']}`}>{s.latencyP95Ms}ms</span>
            </div>
          </div>

          {s.lastIncidentAt !== undefined && (
            <span className={styles['incident']}>Last incident: {formatRelative(s.lastIncidentAt)}</span>
          )}
        </>
      ) : (
        <span className={styles['unknown']}>Status unknown — service not reporting</span>
      )}

      {onViewLogs !== undefined && (
        <button type="button" className={styles['viewLogs']} onClick={() => onViewLogs(s.name)}>View logs {'\u2192'}</button>
      )}
    </div>
  )
}
