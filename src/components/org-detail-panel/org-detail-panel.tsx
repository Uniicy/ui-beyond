import { useState } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { EmptyState } from '../empty-state'
import { MarketTag } from '../market-tag'
import { SlideInPanel } from '../slide-in-panel'
import { StatusDot } from '../status-dot'
import { TabBar } from '../tab-bar'
import { UsageMeter, type UsageMeterProps } from '../usage-meter'
import styles from './org-detail-panel.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'

interface ImpSession { readonly agentName: string; readonly agentId: string; readonly startedAt: string; readonly durationSeconds: number; readonly reason: string }

export interface OrgDetail {
  readonly id: string; readonly name: string; readonly contactEmail: string; readonly tier: string
  readonly markets: ReadonlyArray<Market>; readonly brandCount: number; readonly playerCount: number
  readonly status: string; readonly legalName: string; readonly address: string
  readonly contractStart: string; readonly contractRenewal: string
  readonly accountManagerName: string; readonly accountManagerEmail: string
  readonly impersonationHistory: ReadonlyArray<ImpSession>
  readonly usageMetrics: ReadonlyArray<UsageMeterProps>
}

export interface OrgDetailPanelProps {
  readonly org: OrgDetail
  readonly onImpersonate: (orgId: string) => void
  readonly open: boolean; readonly onClose: () => void
}

const TIER_BADGE: Record<string, string> = { starter: 'standard', growth: 'enhanced', enterprise: 'live' }

function formatDuration(s: number): string { const m = Math.floor(s / 60); return m > 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m` }
function formatRelative(iso: string): string { const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago` }

const tabs = [{ value: 'overview', label: 'Overview' }, { value: 'usage', label: 'Usage' }, { value: 'impersonation', label: 'Impersonation' }]

export function OrgDetailPanel({ org: o, onImpersonate, open, onClose }: OrgDetailPanelProps) {
  const [tab, setTab] = useState('overview')

  const footer = (
    <div className={styles['footer']}>
      <Button variant="ghost" size="sm">Edit org {'\u2192'}</Button>
      <Button variant="danger" size="sm" onClick={() => onImpersonate(o.id)}>Impersonate {'\u2192'}</Button>
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={onClose} title={o.name} subtitle={o.id} width={600} footer={footer}>
      <TabBar tabs={tabs} activeTab={tab} onTabChange={setTab} size="sm" flush bordered />

      {tab === 'overview' && (
        <>
          <div className={styles['section']}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <Badge variant={TIER_BADGE[o.tier] as 'standard'} size="sm" label={o.tier} />
              <StatusDot status={o.status === 'active' ? 'ok' : o.status === 'trial' ? 'warning' : 'error'} size="sm" />
              <span style={{ fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>{o.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>{o.markets.map((m) => <MarketTag key={m} market={m} size="sm" />)}</div>
          </div>
          <div className={styles['section']}>
            <div className={styles['sTitle']}>Contract</div>
            <div className={styles['fieldRow']}><span className={styles['fieldLabel']}>Legal name</span><span className={styles['fieldValue']}>{o.legalName}</span></div>
            <div className={styles['fieldRow']}><span className={styles['fieldLabel']}>Start</span><span className={styles['fieldValue']}>{o.contractStart}</span></div>
            <div className={styles['fieldRow']}><span className={styles['fieldLabel']}>Renewal</span><span className={styles['fieldValue']}>{o.contractRenewal}</span></div>
            <div className={styles['fieldRow']}><span className={styles['fieldLabel']}>Account manager</span>
              <span className={styles['amRow']}><Avatar name={o.accountManagerName} size="xs" /> {o.accountManagerName} <span className={styles['amEmail']}>{o.accountManagerEmail}</span></span>
            </div>
          </div>
          <div className={styles['section']}>
            <div className={styles['sTitle']}>Internal notes</div>
            <textarea className={styles['noteArea']} placeholder="Add internal notes about this org\u2026" rows={3} />
            <Button variant="ghost" size="sm">Save notes</Button>
          </div>
        </>
      )}

      {tab === 'usage' && (
        <div className={styles['section']}>
          <div className={styles['sTitle']}>Usage this month</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {o.usageMetrics.map((m) => <UsageMeter key={m.label} {...m} />)}
          </div>
        </div>
      )}

      {tab === 'impersonation' && (
        <div className={styles['section']}>
          <div className={styles['sTitle']}>Recent sessions</div>
          {o.impersonationHistory.length === 0 ? (
            <EmptyState variant="no-data" title="No impersonation sessions recorded" />
          ) : (
            o.impersonationHistory.map((s, i) => (
              <div key={i} className={styles['impRow']}>
                <Avatar name={s.agentName} size="xs" />
                <div>
                  <span className={styles['impAgent']}>{s.agentName}</span>
                  <span className={styles['impMeta']}> impersonated for {formatDuration(s.durationSeconds)} {'\u00b7'} {formatRelative(s.startedAt)}</span>
                  <div className={styles['impReason']}>{s.reason}</div>
                </div>
              </div>
            ))
          )}
          <div style={{ marginTop: 16 }}>
            <Button variant="danger" size="sm" onClick={() => onImpersonate(o.id)}>Start impersonation session {'\u2192'}</Button>
          </div>
        </div>
      )}
    </SlideInPanel>
  )
}
