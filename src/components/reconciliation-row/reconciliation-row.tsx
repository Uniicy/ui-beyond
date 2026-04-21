import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { ProviderBadge } from '../provider-badge'
import styles from './reconciliation-row.module.css'

export interface ReconciliationEntry {
  readonly id: string
  readonly date: string
  readonly provider: string
  readonly expectedAmount: number
  readonly actualAmount: number
  readonly delta: number
  readonly currency: string
  readonly status: 'reconciled' | 'mismatch' | 'pending' | 'investigating'
  readonly investigatingAgent?: { readonly id: string; readonly name: string }
}

export interface ReconciliationRowProps {
  readonly rec: ReconciliationEntry
  readonly onInvestigate?: (id: string) => void
  readonly className?: string
}

const STATUS_BADGE: Record<string, string> = { reconciled: 'approved', mismatch: 'rejected', pending: 'pending', investigating: 'manual_review' }
const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$', MUR: 'MUR ' }

function fmt(minor: number, cur: string): string {
  const sym = CURRENCY_SYMBOLS[cur] ?? `${cur} `
  return `${sym}${(minor / 100).toLocaleString('en', { minimumFractionDigits: 2 })}`
}

function getBorder(status: string): string | undefined {
  if (status === 'mismatch') return styles['borderDanger']
  if (status === 'investigating') return styles['borderWarning']
  return undefined
}

export function ReconciliationRow({ rec: r, onInvestigate, className }: ReconciliationRowProps) {
  const isMismatch = r.status === 'mismatch' || r.status === 'investigating'
  const rowCls = [styles['row'], getBorder(r.status), className].filter(Boolean).join(' ')

  const deltaClass = r.delta === 0 ? styles['deltaZero'] : r.delta > 0 ? styles['deltaPositive'] : styles['deltaNegative']
  const deltaText = r.delta === 0 ? '\u2014' : r.delta > 0 ? `+${fmt(r.delta, r.currency)}` : `\u2013${fmt(Math.abs(r.delta), r.currency)}`

  return (
    <div className={rowCls}>
      <span className={styles['date']}>{r.date}</span>
      <div className={styles['cell']}><ProviderBadge provider={r.provider as 'trustly'} /></div>
      <div className={`${styles['cell']} ${styles['amount']}`}>{fmt(r.expectedAmount, r.currency)}</div>
      <div className={`${styles['cell']} ${styles['amount']} ${isMismatch ? styles['amountDanger'] : ''}`}>{fmt(r.actualAmount, r.currency)}</div>
      <div className={`${styles['cell']} ${styles['delta']} ${deltaClass}`}>{deltaText}</div>
      <div className={styles['cell']}><Badge variant={STATUS_BADGE[r.status] as 'approved'} size="sm" /></div>
      <div className={styles['agentCell']}>
        {r.investigatingAgent !== undefined ? <Avatar name={r.investigatingAgent.name} size="xs" tooltip /> : <span className={styles['dash']}>\u2014</span>}
      </div>
      <div className={styles['actionCell']}>
        {r.status === 'mismatch' && onInvestigate !== undefined ? (
          <button type="button" className={styles['investigateLink']} onClick={() => onInvestigate(r.id)}>Investigate {'\u2192'}</button>
        ) : <span className={styles['dash']}>\u2014</span>}
      </div>
    </div>
  )
}
