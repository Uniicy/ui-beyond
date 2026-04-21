import { useState } from 'react'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import { ProgressBar } from '../progress-bar'
import styles from './license-row.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type LicenseStatus = 'active' | 'expires_soon' | 'expired' | 'suspended'

export interface License {
  readonly id: string; readonly market: Market; readonly licenseNumber: string; readonly authority: string
  readonly validFrom: string; readonly validTo: string | null; readonly status: LicenseStatus
  readonly brandId: string; readonly brandName: string
}

export interface LicenseRowProps {
  readonly license: License
  readonly onDeactivate: (id: string) => void
  readonly className?: string
}

const STATUS_BADGE: Record<LicenseStatus, string> = { active: 'approved', expires_soon: 'pending', expired: 'expired', suspended: 'blocked' }
const CopyIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" /></svg>)

function formatDate(iso: string): string { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }

function getBorder(status: LicenseStatus): string | undefined {
  if (status === 'expires_soon') return styles['borderWarning']
  if (status === 'expired' || status === 'suspended') return styles['borderDanger']
  return undefined
}

function calcProgress(from: string, to: string | null): { pct: number; intent: 'success' | 'warning' | 'danger' } | null {
  if (to === null) return null
  const start = new Date(from).getTime(); const end = new Date(to).getTime(); const now = Date.now()
  const total = end - start; if (total <= 0) return { pct: 100, intent: 'danger' }
  const elapsed = now - start; const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))
  return { pct, intent: pct >= 85 ? 'danger' : pct >= 60 ? 'warning' : 'success' }
}

export function LicenseRow({ license: l, onDeactivate, className }: LicenseRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const progress = calcProgress(l.validFrom, l.validTo)
  const canDeact = l.status === 'active' || l.status === 'expires_soon'
  const rowCls = [styles['row'], getBorder(l.status), className].filter(Boolean).join(' ')

  const handleCopy = () => { navigator.clipboard.writeText(l.licenseNumber).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className={rowCls}>
      <div className={styles['cell']}><MarketTag market={l.market} /></div>
      <div className={styles['licenseCell']}>
        <span className={styles['licenseNum']}>{l.licenseNumber}</span>
        <IconButton icon={CopyIcon} label={copied ? 'Copied!' : 'Copy'} size="sm" variant="ghost" tooltip onClick={handleCopy} />
      </div>
      <span className={styles['authority']}>{l.authority}</span>
      <div className={styles['validityCell']}>
        {l.validTo !== null ? (
          <span className={`${styles['dateRange']} ${l.status === 'expires_soon' ? styles['dateWarning'] : ''}`}>
            {formatDate(l.validFrom)} {'\u2013'} {formatDate(l.validTo)}
          </span>
        ) : (
          <span className={styles['dateRange']}>Indefinite</span>
        )}
        {progress !== null && <div className={styles['progressWrap']}><ProgressBar value={progress.pct} height="xs" intent={progress.intent} rounded /></div>}
      </div>
      <div className={styles['cell']}><Badge variant={STATUS_BADGE[l.status] as 'approved'} size="sm" /></div>
      <div className={styles['actionCell']}>
        {canDeact && !confirmOpen && <button type="button" className={styles['deactBtn']} onClick={() => setConfirmOpen(true)}>Deactivate</button>}
        {confirmOpen && (
          <div className={styles['confirmRow']}>
            Confirm?
            <button type="button" className={`${styles['confirmBtn']} ${styles['confirmDanger']}`} onClick={() => { onDeactivate(l.id); setConfirmOpen(false) }}>Yes</button>
            <button type="button" className={`${styles['confirmBtn']} ${styles['confirmCancel']}`} onClick={() => setConfirmOpen(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  )
}
