import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { OrgRow, type Organisation } from '../components/org-row'
import { OrgDetailPanel, type OrgDetail } from '../components/org-detail-panel'
import { BrandOnboardingWizard } from '../components/brand-onboarding-wizard'
import { ImpersonationBanner } from '../components/impersonation-banner'
import { SystemHealthCard, type ServiceHealth } from '../components/system-health-card'
import { Avatar } from '../components/avatar'
import { Badge } from '../components/badge'
import { Button } from '../components/button'
import { StatusDot } from '../components/status-dot'
import { Pagination } from '../components/pagination'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'
import type { CustomNavSection } from '../components/admin-sidebar'

/* helpers */
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function secondsAgo(s: number): string { return new Date(Date.now() - s * 1000).toISOString() }

const saNav: CustomNavSection[] = [
  { title: 'Platform', items: [{ label: 'Organisations', path: '/sa/orgs' }, { label: 'Usage & Billing', path: '/sa/billing' }, { label: 'System Health', path: '/sa/health' }] },
  { title: 'Access', items: [{ label: 'Impersonation', path: '/sa/impersonate' }, { label: 'Audit log', path: '/sa/audit' }] },
]

/* org fixtures */
const orgs: Organisation[] = [
  { id: 'org-1', name: 'Tipico GmbH', contactEmail: 'ops@tipico.de', tier: 'growth', markets: ['de', 'mu'], brandCount: 2, playerCount: 12847, monthlyApiCalls: 284320, status: 'active', createdAt: daysAgo(365) },
  { id: 'org-2', name: 'bet365-test', contactEmail: 'test@bet365.com', tier: 'starter', markets: ['gb'], brandCount: 1, playerCount: 841, monthlyApiCalls: 12400, status: 'trial', createdAt: daysAgo(14) },
  { id: 'org-3', name: 'MauritiusBets Ltd', contactEmail: 'admin@mubets.mu', tier: 'growth', markets: ['mu'], brandCount: 1, playerCount: 2841, monthlyApiCalls: 48200, status: 'active', createdAt: daysAgo(180) },
  { id: 'org-4', name: 'PokerStars DE', contactEmail: 'ops@pokerstars.de', tier: 'enterprise', markets: ['de', 'nl'], brandCount: 5, playerCount: 44291, monthlyApiCalls: 1840000, status: 'active', createdAt: daysAgo(540) },
  { id: 'org-5', name: 'OldCasino GmbH', contactEmail: 'info@oldcasino.de', tier: 'starter', markets: ['de'], brandCount: 1, playerCount: 291, monthlyApiCalls: 0, status: 'suspended', createdAt: daysAgo(400) },
]

const orgDetail: OrgDetail = {
  ...orgs[0]!, legalName: 'Tipico Co. Ltd', address: 'Berliner Str. 42, M\u00fcnchen',
  contractStart: '1 Feb 2026', contractRenewal: '1 Feb 2027',
  accountManagerName: 'Max Meier', accountManagerEmail: 'max@uniicy.com',
  usageMetrics: [
    { label: 'KYC verifications', current: 2441, quota: 5000, unit: 'verifications', trend: 842 },
    { label: 'Active players', current: 12847, quota: null, unit: 'players' },
    { label: 'API calls', current: 284320, quota: 500000, unit: 'calls' },
    { label: 'Storage', current: 284, quota: 420, unit: 'GB' },
  ],
  impersonationHistory: [
    { agentName: 'UNIICY Admin', agentId: 'sa-1', startedAt: hoursAgo(3), durationSeconds: 420, reason: 'KYC SLA investigation' },
    { agentName: 'Max Meier', agentId: 'sa-2', startedAt: daysAgo(2), durationSeconds: 1200, reason: 'Onboarding support' },
    { agentName: 'UNIICY Admin', agentId: 'sa-1', startedAt: daysAgo(7), durationSeconds: 180, reason: 'Config review' },
  ],
}

const orgCols: TableColumn[] = [{ key: 'org', label: 'Organisation', width: '220px', sortable: true }, { key: 'tier', label: 'Tier', width: '90px' }, { key: 'markets', label: 'Markets', width: '110px' }, { key: 'stats', label: 'Brands / Players', width: '140px' }, { key: 'api', label: 'API calls', width: '110px', sortable: true }, { key: 'status', label: 'Status', width: '100px' }, { key: 'actions', label: '', width: '100px' }]

/* health fixtures */
const allGreen = Array(24).fill(1)
const withDeg = [...Array(10).fill(1), 0.6, 0.5, ...Array(12).fill(1)]
const services: ServiceHealth[] = [
  { name: 'player-graph', displayName: 'Player Graph', status: 'healthy', uptimePercent: 99.94, uptimeHistory: allGreen, errorRatePercent: 0.02, latencyP95Ms: 142 },
  { name: 'kyc', displayName: 'KYC Service', status: 'degraded', uptimePercent: 97.2, uptimeHistory: withDeg, errorRatePercent: 0.8, latencyP95Ms: 680 },
  { name: 'aml', displayName: 'AML Service', status: 'healthy', uptimePercent: 100, uptimeHistory: allGreen, errorRatePercent: 0, latencyP95Ms: 88 },
  { name: 'rg', displayName: 'RG Service', status: 'healthy', uptimePercent: 99.8, uptimeHistory: [...allGreen.slice(0, 1), 0.7, ...allGreen.slice(2)], errorRatePercent: 0.01, latencyP95Ms: 120 },
  { name: 'psp', displayName: 'PSP Gateway', status: 'healthy', uptimePercent: 99.91, uptimeHistory: allGreen, errorRatePercent: 0.03, latencyP95Ms: 210 },
  { name: 'audit', displayName: 'Audit Service', status: 'healthy', uptimePercent: 100, uptimeHistory: allGreen, errorRatePercent: 0, latencyP95Ms: 55 },
  { name: 'notify', displayName: 'Notifications', status: 'healthy', uptimePercent: 99.6, uptimeHistory: allGreen, errorRatePercent: 0.04, latencyP95Ms: 180 },
  { name: 'api-gw', displayName: 'API Gateway', status: 'healthy', uptimePercent: 99.99, uptimeHistory: allGreen, errorRatePercent: 0, latencyP95Ms: 45 },
  { name: 'nats', displayName: 'NATS JetStream', status: 'healthy', uptimePercent: 100, uptimeHistory: allGreen, errorRatePercent: 0, latencyP95Ms: 8 },
]

/* impersonation log */
const impLog = [
  { agent: 'Sarah Klein', org: 'Tipico GmbH', duration: '28m 44s', reason: 'Support request', started: hoursAgo(2), ended: true },
  { agent: 'Max Meier', org: 'PokerStars DE', duration: '14m 22s', reason: 'Security audit', started: daysAgo(1), ended: true },
  { agent: 'UNIICY Admin', org: 'MauritiusBets Ltd', duration: '7m 01s', reason: 'Bug investigation', started: daysAgo(3), ended: true },
  { agent: 'Sarah Klein', org: 'bet365-test', duration: '30m 00s', reason: 'Onboarding', started: daysAgo(5), ended: true },
  { agent: 'Max Meier', org: 'Tipico GmbH', duration: '3m 12s', reason: 'Config check', started: daysAgo(7), ended: true },
]

const natsTopics = [
  { topic: 'TRACKEO.kyc.*', consumer: 'kyc-consumer', lag: 0, status: 'ok' },
  { topic: 'TRACKEO.aml.*', consumer: 'aml-consumer', lag: 0, status: 'ok' },
  { topic: 'TRACKEO.rg.*', consumer: 'rg-consumer', lag: 3, status: 'warning' },
  { topic: 'TRACKEO.psp.*', consumer: 'psp-consumer', lag: 0, status: 'ok' },
]

const natsCols: TableColumn[] = [{ key: 'topic', label: 'Topic', width: '200px' }, { key: 'consumer', label: 'Consumer', width: '160px' }, { key: 'lag', label: 'Lag', width: '80px' }, { key: 'status', label: 'Status', width: '80px' }]

const billingCols: TableColumn[] = [{ key: 'org', label: 'Organisation', width: '200px' }, { key: 'tier', label: 'Tier', width: '80px' }, { key: 'players', label: 'Players', width: '100px' }, { key: 'api', label: 'API calls', width: '120px' }, { key: 'verif', label: 'Verifications', width: '100px' }, { key: 'charge', label: 'Monthly', width: '100px' }, { key: 'invoice', label: '', width: '80px' }]

function formatRelative(iso: string): string { const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago` }

/* sections */
function OrgsSection({ panelOpen, setPanelOpen, wizardOpen, setWizardOpen }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void; wizardOpen: boolean; setWizardOpen: (v: boolean) => void }) {
  const rows = orgs.map((o) => <OrgRow key={o.id} org={o} onImpersonate={() => {}} onClick={() => setPanelOpen(true)} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 12 }, { value: 'active', label: 'Active', count: 10 }, { value: 'trial', label: 'Trial', count: 2 }, { value: 'suspended', label: 'Suspended', count: 1 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}><DataTable columns={orgCols} rows={rows} page={1} pageSize={25} total={12} onPageChange={() => {}} /></div>
      <OrgDetailPanel org={orgDetail} onImpersonate={() => {}} open={panelOpen} onClose={() => setPanelOpen(false)} />
      <BrandOnboardingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={async () => { await new Promise((r) => setTimeout(r, 1500)); return { brandId: 'brand_new_001', apiKey: 'sk_live_new_a1b2c3d4e5f6' } }} organisations={orgs.map((o) => ({ id: o.id, name: o.name }))} />
    </>
  )
}

function HealthSection() {
  const natsRows = natsTopics.map((t, i) => (
    <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 160px 80px 80px', alignItems: 'center', height: 40, padding: '0 8px', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)', fontSize: 12 }}>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11, color: 'var(--ub-color-on-surface)' }}>{t.topic}</span>
      <span style={{ color: 'var(--ub-color-on-surface-variant)' }}>{t.consumer}</span>
      <span style={{ fontFamily: 'var(--ub-font-mono)', color: t.lag > 0 ? 'var(--ub-color-warning)' : 'var(--ub-color-on-surface)', fontWeight: t.lag > 0 ? 500 : 400 }}>{t.lag}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><StatusDot status={t.status === 'ok' ? 'ok' : 'warning'} size="sm" />{t.status}</span>
    </div>
  ))
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {services.map((s) => <SystemHealthCard key={s.name} service={s} onViewLogs={() => {}} />)}
      </div>
      <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 8 }}>NATS event bus lag</div>
      <DataTable columns={natsCols} rows={natsRows} />
    </>
  )
}

function ImpersonateSection() {
  const logRows = impLog.map((l, i) => (
    <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 150px 80px 160px 100px 60px', alignItems: 'center', height: 44, padding: '0 8px', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)', fontSize: 12 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name={l.agent} size="xs" />{l.agent}</span>
      <span style={{ color: 'var(--ub-color-on-surface)' }}>{l.org}</span>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11 }}>{l.duration}</span>
      <span style={{ color: 'var(--ub-color-on-surface-variant)' }}>{l.reason}</span>
      <span style={{ fontSize: 11, color: 'var(--ub-color-on-surface-variant)' }}>{formatRelative(l.started)}</span>
      <Badge variant="approved" size="sm" label="ended" />
    </div>
  ))
  const logCols: TableColumn[] = [{ key: 'agent', label: 'Agent', width: '160px' }, { key: 'org', label: 'Organisation', width: '150px' }, { key: 'dur', label: 'Duration', width: '80px' }, { key: 'reason', label: 'Reason', width: '160px' }, { key: 'started', label: 'Started', width: '100px' }, { key: 'status', label: '', width: '60px' }]
  return (
    <>
      <div style={{ maxWidth: 480, padding: 20, border: '0.5px solid var(--ub-color-secondary-container)', borderRadius: 'var(--ub-radius-lg)', marginBottom: 24, fontFamily: 'var(--ub-font-body)' }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--ub-color-on-surface)' }}>Start impersonation</div>
        <select style={{ height: 34, width: '100%', marginBottom: 8, padding: '0 10px', border: '0.5px solid var(--ub-color-secondary-container)', borderRadius: 'var(--ub-radius-md)', fontSize: 12, fontFamily: 'var(--ub-font-body)' }}><option>Select organisation\u2026</option>{orgs.filter((o) => o.status !== 'suspended').map((o) => <option key={o.id}>{o.name}</option>)}</select>
        <select style={{ height: 34, width: '100%', marginBottom: 12, padding: '0 10px', border: '0.5px solid var(--ub-color-secondary-container)', borderRadius: 'var(--ub-radius-md)', fontSize: 12, fontFamily: 'var(--ub-font-body)' }}><option>Support request</option><option>Security audit</option><option>Bug investigation</option><option>Other</option></select>
        <Button variant="danger" size="sm">Start 30-min session {'\u2192'}</Button>
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 8, fontFamily: 'var(--ub-font-body)' }}>Impersonation log</div>
      <DataTable columns={logCols} rows={logRows} />
    </>
  )
}

function BillingSection() {
  const billingData = orgs.filter((o) => o.status !== 'suspended').map((o) => ({ ...o, verifs: Math.floor(o.playerCount * 0.2), charge: o.tier === 'enterprise' ? '\u20ac4,200' : o.tier === 'growth' ? '\u20ac890' : '\u20ac0 (trial)' }))
  const billingRows = billingData.map((b) => (
    <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '200px 80px 100px 120px 100px 100px 80px', alignItems: 'center', height: 44, padding: '0 8px', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)', fontSize: 12 }}>
      <span style={{ fontWeight: 500, color: 'var(--ub-color-on-surface)' }}>{b.name}</span>
      <Badge variant={b.tier === 'enterprise' ? 'live' : b.tier === 'growth' ? 'enhanced' : 'standard'} size="sm" label={b.tier} />
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11 }}>{b.playerCount.toLocaleString('en')}</span>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11 }}>{b.monthlyApiCalls.toLocaleString('en')}</span>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11 }}>{b.verifs.toLocaleString('en')}</span>
      <span style={{ fontWeight: 500, color: 'var(--ub-color-on-surface)' }}>{b.charge}</span>
      <span style={{ fontSize: 11, color: 'var(--ub-color-primary)', cursor: 'pointer' }}>Invoice {'\u2192'}</span>
    </div>
  ))
  return <DataTable columns={billingCols} rows={billingRows} />
}

/* page */
interface SAPageProps { section: string; sidebarCollapsed: boolean; panelOpen: boolean; wizardOpen: boolean; impersonating: boolean; impStartedSecondsAgo: number }

function SAPage({ section, sidebarCollapsed, panelOpen: initPanel, wizardOpen: initWizard, impersonating, impStartedSecondsAgo }: SAPageProps) {
  const [active, setActive] = useState(section)
  const [panelOpen, setPanelOpen] = useState(initPanel)
  const [wizardOpen, setWizardOpen] = useState(initWizard)

  const content: Record<string, React.JSX.Element> = {
    '/sa/orgs': <OrgsSection panelOpen={panelOpen} setPanelOpen={setPanelOpen} wizardOpen={wizardOpen} setWizardOpen={setWizardOpen} />,
    '/sa/health': <HealthSection />,
    '/sa/impersonate': <ImpersonateSection />,
    '/sa/billing': <BillingSection />,
    '/sa/audit': <div style={{ fontFamily: 'var(--ub-font-body)', color: 'var(--ub-color-on-surface-variant)', padding: 24 }}>Audit log — uses AuditLogRow components (same as Audit tab in operator admin)</div>,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar variant="superadmin" navItems={saNav} activePath={active} brand={{ name: 'UNIICY', id: 'sa' }} brands={[]} onBrandChange={() => {}} onNavigate={setActive} agentName="UNIICY Admin" agentRole="Super Admin" />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          {impersonating && <ImpersonationBanner orgName="Tipico GmbH" agentName="UNIICY Admin" startedAt={secondsAgo(impStartedSecondsAgo)} onEndSession={() => {}} onSessionExpired={() => {}} />}
          <AdminTopNav pageTitle="Super Admin" breadcrumbs={[{ label: 'Super Admin' }]} primaryAction={active === '/sa/orgs' ? { label: 'Onboard brand \u2192', onClick: () => setWizardOpen(true) } : undefined} notificationCount={0} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Organisations" value="12" change="2 trial \u00b7 1 suspended" changeVariant="positive" status="ok" />
              <KpiCard label="Active players" value="84,291" change="across all brands" changeVariant="positive" status="ok" />
              <KpiCard label="API calls today" value="2,847,441" change={'\u2191 14%'} changeVariant="positive" status="ok" />
              <KpiCard label="Active incidents" value="1" change="kyc service degraded" changeVariant="warning" status="warning" />
            </KpiRow>
            {content[active] ?? content['/sa/orgs']}
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* storybook */
const meta = {
  title: 'Pages/SuperAdmin', component: SAPage,
  argTypes: { section: { control: 'select', options: ['/sa/orgs', '/sa/health', '/sa/impersonate', '/sa/billing'] }, sidebarCollapsed: { control: 'boolean' }, panelOpen: { control: 'boolean' }, wizardOpen: { control: 'boolean' }, impersonating: { control: 'boolean' }, impStartedSecondsAgo: { control: 'number' } },
  args: { section: '/sa/orgs', sidebarCollapsed: false, panelOpen: true, wizardOpen: false, impersonating: false, impStartedSecondsAgo: 76 },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SAPage>

export default meta; type Story = StoryObj<typeof meta>

export const Organisations: Story = {}
export const OrgsImpersonating: Story = { args: { impersonating: true, impStartedSecondsAgo: 76 } }
export const OrgsCritical: Story = { args: { impersonating: true, impStartedSecondsAgo: 1753 } }
export const SystemHealth: Story = { args: { section: '/sa/health', panelOpen: false } }
export const BrandOnboarding: Story = { args: { wizardOpen: true } }
export const Impersonation: Story = { args: { section: '/sa/impersonate', panelOpen: false } }
export const CollapsedSidebar: Story = { args: { sidebarCollapsed: true } }
