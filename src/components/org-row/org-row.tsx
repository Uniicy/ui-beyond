import { useState, useRef, useEffect } from 'react'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import { StatusDot } from '../status-dot'
import styles from './org-row.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type Tier = 'starter' | 'growth' | 'enterprise'
type OrgStatus = 'active' | 'trial' | 'suspended'

export interface Organisation {
  readonly id: string; readonly name: string; readonly contactEmail: string; readonly tier: Tier
  readonly markets: ReadonlyArray<Market>; readonly brandCount: number; readonly playerCount: number
  readonly monthlyApiCalls: number; readonly status: OrgStatus; readonly createdAt: string
  readonly accountManagerName?: string
}

export interface OrgRowProps {
  readonly org: Organisation
  readonly onImpersonate: (orgId: string) => void
  readonly onClick: (orgId: string) => void
  readonly className?: string
}

const TIER_BADGE: Record<Tier, string> = { starter: 'standard', growth: 'enhanced', enterprise: 'live' }
const MoreIcon = (<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>)

export function OrgRow({ org: o, onImpersonate, onClick, className }: OrgRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!menuOpen) return; function h(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [menuOpen])

  const isSuspended = o.status === 'suspended'
  const rowCls = [styles['row'], o.status === 'trial' ? styles['borderTrial'] : undefined, isSuspended ? styles['borderSuspended'] : undefined, className].filter(Boolean).join(' ')

  return (
    <div className={rowCls} onClick={!isSuspended ? () => onClick(o.id) : undefined}>
      <div className={styles['orgCell']}>
        <span className={styles['orgName']}>{o.name}</span>
        <span className={styles['orgEmail']}>{o.contactEmail}</span>
      </div>
      <div className={styles['cell']}><Badge variant={TIER_BADGE[o.tier] as 'standard'} size="sm" label={o.tier} /></div>
      <div className={styles['marketsCell']}>{o.markets.slice(0, 3).map((m) => <MarketTag key={m} market={m} size="sm" showLicense={false} />)}</div>
      <div className={styles['statsCell']}>
        <span className={styles['statLine']}>{o.brandCount} brands</span>
        <span className={styles['statLine']}>{o.playerCount.toLocaleString('en')} players</span>
      </div>
      <div className={styles['apiCell']}>
        <span className={styles['apiCount']}>{o.monthlyApiCalls.toLocaleString('en')}</span>
        <span className={styles['apiLabel']}>this month</span>
      </div>
      <div className={styles['statusCell']}>
        <StatusDot status={o.status === 'active' ? 'ok' : o.status === 'trial' ? 'warning' : 'error'} size="sm" />
        {o.status}
      </div>
      <div className={styles['actions']} onClick={(e) => e.stopPropagation()}>
        {!isSuspended && <button type="button" className={styles['impersonateBtn']} onClick={() => onImpersonate(o.id)}>Impersonate {'\u2192'}</button>}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <IconButton icon={MoreIcon} label="More" size="sm" variant="ghost" tooltip={false} onClick={() => setMenuOpen((p) => !p)} />
          {menuOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'var(--ub-color-surface-container-low)', borderRadius: 'var(--ub-radius-lg)', boxShadow: 'var(--ub-shadow-elevated)', zIndex: 10, padding: '4px 0', minWidth: 140 }}>
              {['View detail', 'Suspend', 'Export data'].map((a) => (
                <button key={a} type="button" style={{ display: 'block', width: '100%', padding: '7px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--ub-font-body)', fontSize: 12, color: a === 'Suspend' ? 'var(--ub-color-error)' : 'var(--ub-color-on-surface)', textAlign: 'left' }} onClick={() => setMenuOpen(false)}>{a}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
