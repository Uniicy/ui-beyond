import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import styles from './brand-row.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type BrandStatus = 'active' | 'disabled' | 'pending'

export interface Brand {
  readonly id: string; readonly name: string; readonly domain: string; readonly additionalDomains?: ReadonlyArray<string>
  readonly locale: string; readonly currency: string; readonly markets: ReadonlyArray<Market>
  readonly playerCount: number; readonly status: BrandStatus
}

export interface BrandRowProps {
  readonly brand: Brand
  readonly onEdit: (id: string) => void
  readonly onDisable: (id: string) => void
  readonly onClick: (id: string) => void
  readonly className?: string
}

const STATUS_BADGE: Record<BrandStatus, string> = { active: 'approved', disabled: 'inactive', pending: 'pending' }
const COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#4f46e5', '#0d9488']

const EditIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 2.5l2.5 2.5M4 13l-1.5.5.5-1.5L10.5 4.5l2.5 2.5L5.5 14.5" /></svg>)
const ToggleIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5" /><path d="M8 5v6" /></svg>)

function hashColor(name: string): string {
  let h = 0; for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0
  return COLORS[Math.abs(h) % COLORS.length]!
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2 ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase() : name.slice(0, 2).toUpperCase()
}

export function BrandRow({ brand: b, onEdit, onDisable, onClick, className }: BrandRowProps) {
  const rowCls = [styles['row'], b.status === 'disabled' ? styles['disabled'] : undefined, b.status === 'pending' ? styles['borderPending'] : undefined, className].filter(Boolean).join(' ')

  return (
    <div className={rowCls} onClick={b.status !== 'disabled' ? () => onClick(b.id) : undefined}>
      <div className={styles['brandCell']}>
        <div className={styles['brandAvatar']} style={{ backgroundColor: hashColor(b.name) }}>{initials(b.name)}</div>
        <span className={styles['brandName']}>{b.name}</span>
      </div>
      <div className={styles['domainCell']}>
        <span className={styles['domain']}>{b.domain}</span>
        {b.additionalDomains !== undefined && b.additionalDomains.length > 0 && <span className={styles['moreDomains']}>+{b.additionalDomains.length} more</span>}
      </div>
      <span className={styles['localeCurrency']}>{b.locale} {'\u00b7'} {b.currency}</span>
      <div className={styles['marketsCell']}>{b.markets.map((m) => <MarketTag key={m} market={m} size="sm" showLicense={false} />)}</div>
      <span className={styles['players']}>{b.playerCount.toLocaleString('en')}</span>
      <div className={styles['cell']}><Badge variant={STATUS_BADGE[b.status] as 'approved'} size="sm" /></div>
      <div className={styles['actions']} onClick={(e) => e.stopPropagation()}>
        <IconButton icon={EditIcon} label="Edit" size="sm" variant="ghost" onClick={() => onEdit(b.id)} />
        <IconButton icon={ToggleIcon} label={b.status === 'active' ? 'Disable' : 'Enable'} size="sm" variant="ghost" intent={b.status === 'active' ? 'danger' : 'neutral'} onClick={() => onDisable(b.id)} />
      </div>
    </div>
  )
}
