import { ProgressBar } from '../progress-bar'
import styles from './usage-meter.module.css'

export interface UsageMeterProps {
  readonly label: string; readonly current: number; readonly quota: number | null
  readonly unit?: string; readonly period?: string; readonly trend?: number
  readonly className?: string
}

function intentClass(pct: number, unlimited: boolean): string {
  if (unlimited) return styles['neutral'] ?? ''
  if (pct >= 85) return styles['danger'] ?? ''
  if (pct >= 60) return styles['warning'] ?? ''
  return styles['success'] ?? ''
}

function barIntent(pct: number, unlimited: boolean): 'success' | 'warning' | 'danger' | 'neutral' {
  if (unlimited) return 'neutral'
  if (pct >= 85) return 'danger'
  if (pct >= 60) return 'warning'
  return 'success'
}

export function UsageMeter({ label, current, quota, unit, period = 'this month', trend, className }: UsageMeterProps) {
  const unlimited = quota === null
  const pct = unlimited ? 100 : (quota > 0 ? Math.min(120, (current / quota) * 100) : 0)
  const cls = [styles['meter'], className].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      <div className={styles['row1']}>
        <span className={styles['label']}>{label}</span>
        <span className={styles['period']}>{period}</span>
      </div>
      <div className={styles['row2']}>
        <span className={`${styles['current']} ${intentClass(pct, unlimited)}`}>{current.toLocaleString('en')}</span>
        <span className={styles['quota']}>
          {unlimited ? 'Unlimited' : `/ ${quota.toLocaleString('en')}${unit ? ` ${unit}` : ''}`}
        </span>
        {trend !== undefined && trend !== 0 && (
          <span className={`${styles['trend']} ${trend > 0 ? styles['trendUp'] : styles['trendDown']}`}>
            {trend > 0 ? '\u2191' : '\u2193'}{Math.abs(trend).toLocaleString('en')} vs last {period.replace('this ', '')}
          </span>
        )}
      </div>
      <ProgressBar value={unlimited ? 100 : pct} height="xs" intent={barIntent(pct, unlimited)} rounded />
    </div>
  )
}
