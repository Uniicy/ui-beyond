import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { TabBar } from '../components/tab-bar'
import { RgRiskDistributionBar } from '../components/rg-risk-distribution-bar'
import { RiskScore } from '../components/risk-score'
import { Avatar } from '../components/avatar'
import { Badge } from '../components/badge'
import { InterventionCard, type Intervention } from '../components/intervention-card'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { LimitBar } from '../components/limit-bar'
import { LimitOverridePanel } from '../components/limit-override-panel'
import { ExclusionList, type Exclusion } from '../components/exclusion-card'
import { Pagination } from '../components/pagination'
import { AffordabilityRow, type AffordabilityCheck } from '../components/affordability-row'
import { OasisLogRow, type OasisLogEntry } from '../components/oasis-log-row'
import { LugasSyncPanel } from '../components/lugas-sync-panel'
import { Surface } from '../components/surface'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'

/* ── Helpers ── */
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const brands = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]

/* ── Overview fixtures ── */
const riskBands = [
  { label: 'Low' as const, count: 9121, percentage: 71, trend: -8 },
  { label: 'Medium' as const, count: 2441, percentage: 19, trend: -3 },
  { label: 'Elevated' as const, count: 900, percentage: 7, trend: 4 },
  { label: 'High' as const, count: 385, percentage: 3, trend: 12 },
]

const highRiskPlayers = [
  { name: 'Klaus Wagner', score: 88, kyc: 'approved' },
  { name: 'Mohammed Al-Rashid', score: 91, kyc: 'manual_review' },
  { name: 'Stefan Koch', score: 82, kyc: 'approved' },
  { name: 'Peter Schmidt', score: 76, kyc: 'approved' },
  { name: 'Frank M\u00fcller', score: 71, kyc: 'approved' },
]

const interventions: Intervention[] = [
  { id: 'iv-1', type: 'panic_button', player: { id: 'p1', name: 'Peter Schmidt' }, triggeredBy: 'system', sentAt: minutesAgo(15), outcome: 'accepted', outcomeAt: minutesAgo(14), note: 'Self-exclusion 6 months applied.' },
  { id: 'iv-2', type: 'affordability_nudge', player: { id: 'p2', name: 'Thomas Huber' }, triggeredBy: 'system', sentAt: hoursAgo(2), outcome: 'pending' },
  { id: 'iv-3', type: 'deposit_limit_suggestion', player: { id: 'p3', name: 'Anna Fischer' }, triggeredBy: 'agent', agentName: 'Sarah Klein', sentAt: hoursAgo(4), outcome: 'accepted', outcomeAt: hoursAgo(3) },
  { id: 'iv-4', type: 'reality_check', player: { id: 'p4', name: 'Lisa Bauer' }, triggeredBy: 'system', sentAt: hoursAgo(8), outcome: 'dismissed', outcomeAt: hoursAgo(7) },
  { id: 'iv-5', type: 'cooling_off_suggestion', player: { id: 'p5', name: 'Markus Weber' }, triggeredBy: 'system', sentAt: hoursAgo(24), outcome: 'expired', outcomeAt: hoursAgo(12) },
]

/* ── Limits fixtures ── */
const limitColumns: TableColumn[] = [
  { key: 'player', label: 'Player', width: '200px', sortable: true },
  { key: 'kyc', label: 'KYC', width: '90px' },
  { key: 'deposit', label: 'Monthly deposit', width: '160px' },
  { key: 'loss', label: 'Weekly loss', width: '140px' },
  { key: 'source', label: 'Source', width: '100px' },
  { key: 'action', label: '', width: '90px' },
]

const limitPlayers = [
  { name: 'Thomas Huber', kyc: 'approved', depCur: 840, depMax: 1000, lossCur: 110, lossMax: 200, src: 'lugas' as const },
  { name: 'Anna Fischer', kyc: 'approved', depCur: 950, depMax: 1000, lossCur: 80, lossMax: 200, src: 'lugas' as const },
  { name: 'Klaus Wagner', kyc: 'approved', depCur: 1000, depMax: 1000, lossCur: 190, lossMax: 200, src: 'lugas' as const },
  { name: 'Lisa Bauer', kyc: 'approved', depCur: 300, depMax: 500, lossCur: 40, lossMax: 100, src: 'player' as const },
  { name: 'Peter Schmidt', kyc: 'approved', depCur: 200, depMax: 1000, lossCur: 20, lossMax: 200, src: 'lugas' as const },
  { name: 'Julia Richter', kyc: 'pending', depCur: 0, depMax: 1000, lossCur: 0, lossMax: 200, src: 'lugas' as const },
  { name: 'Markus Weber', kyc: 'approved', depCur: 600, depMax: 1000, lossCur: 150, lossMax: 200, src: 'lugas' as const },
  { name: 'Ingrid M\u00fcller', kyc: 'approved', depCur: 880, depMax: 1000, lossCur: 180, lossMax: 200, src: 'lugas' as const },
]

/* ── Exclusion fixtures ── */
const exclusions: Array<{ exclusion: Exclusion }> = [
  { exclusion: { id: 'ex-1', source: 'player', duration: '1_year', appliedAt: daysAgo(30), expiresAt: daysFromNow(335), oasisRef: 'OASIS-DE-882211', status: 'active' } },
  { exclusion: { id: 'ex-2', source: 'oasis', duration: 'indefinite', appliedAt: daysAgo(90), oasisRef: 'OASIS-DE-771100', status: 'active' } },
  { exclusion: { id: 'ex-3', source: 'operator', duration: '6_months', appliedAt: daysAgo(60), expiresAt: daysFromNow(120), status: 'active' } },
  { exclusion: { id: 'ex-4', source: 'player', duration: '3_months', appliedAt: daysAgo(200), expiresAt: daysAgo(110), status: 'expired' } },
  { exclusion: { id: 'ex-5', source: 'oasis', duration: '6_months', appliedAt: daysAgo(300), expiresAt: daysAgo(120), liftedAt: daysAgo(150), oasisRef: 'OASIS-DE-660088', status: 'lifted' } },
  { exclusion: { id: 'ex-6', source: 'player', duration: '1_year', appliedAt: daysAgo(400), expiresAt: daysAgo(35), status: 'expired' } },
]

/* ── Affordability fixtures ── */
const affordChecks: AffordabilityCheck[] = [
  { id: 'afc-1', player: { id: 'p1', name: 'Thomas Huber', email: 't.huber@example.de' }, triggerType: 'deposit_threshold', thresholdAmount: 2000, currency: 'EUR', deadline: hoursAgo(4), createdAt: daysAgo(3), documentsUploaded: 1, documentsRequired: 2, status: 'pending', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } },
  { id: 'afc-2', player: { id: 'p2', name: 'Anna Fischer', email: 'anna.f@example.de' }, triggerType: 'loss_threshold', thresholdAmount: 1500, currency: 'EUR', deadline: hoursAgo(8), createdAt: daysAgo(5), documentsUploaded: 0, documentsRequired: 2, status: 'pending' },
  { id: 'afc-3', player: { id: 'p3', name: 'Klaus Wagner', email: 'klaus.w@example.de' }, triggerType: 'deposit_threshold', thresholdAmount: 2000, currency: 'EUR', deadline: hoursFromNow(48), createdAt: hoursAgo(24), documentsUploaded: 1, documentsRequired: 2, status: 'pending', assignedAgent: { id: 'a-2', name: 'Max Mustermann' } },
  { id: 'afc-4', player: { id: 'p4', name: 'Lisa Bauer', email: 'lisa.b@example.de' }, triggerType: 'risk_flag', deadline: hoursFromNow(72), createdAt: hoursAgo(12), documentsUploaded: 0, documentsRequired: 2, status: 'pending' },
  { id: 'afc-5', player: { id: 'p5', name: 'Markus Weber', email: 'markus.w@example.de' }, triggerType: 'deposit_threshold', thresholdAmount: 2000, currency: 'EUR', deadline: hoursFromNow(24), createdAt: daysAgo(1), documentsUploaded: 2, documentsRequired: 2, status: 'submitted', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } },
  { id: 'afc-6', player: { id: 'p6', name: 'Julia Richter', email: 'julia.r@example.de' }, triggerType: 'deposit_threshold', thresholdAmount: 2000, currency: 'EUR', deadline: daysAgo(1), createdAt: daysAgo(4), documentsUploaded: 2, documentsRequired: 2, status: 'approved', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } },
]

/* ── OASIS fixtures ── */
const oasisEntries: OasisLogEntry[] = [
  { id: 'oa-1', checkedAt: minutesAgo(2), player: { id: 'p1', name: 'Lisa Hoffmann' }, result: 'clear', responseTimeMs: 145, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa01' },
  { id: 'oa-2', checkedAt: minutesAgo(4), player: { id: 'p2', name: 'Markus Weber' }, result: 'clear', responseTimeMs: 210, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa02' },
  { id: 'oa-3', checkedAt: minutesAgo(6), player: { id: 'p3', name: 'Julia Richter' }, result: 'clear', responseTimeMs: 390, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa03' },
  { id: 'oa-4', checkedAt: minutesAgo(8), player: { id: 'p4', name: 'Mohammed Al-Rashid' }, result: 'hit', oasisRef: 'OASIS-DE-882211', responseTimeMs: 312, sessionOutcome: 'blocked', market: 'de', checkId: 'chk_aa04' },
  { id: 'oa-5', checkedAt: minutesAgo(10), player: { id: 'p5', name: 'Stefan Koch' }, result: 'clear', responseTimeMs: 175, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa05' },
  { id: 'oa-6', checkedAt: minutesAgo(14), player: { id: 'p6', name: 'Claudia Schulz' }, result: 'clear', responseTimeMs: 520, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa06' },
  { id: 'oa-7', checkedAt: minutesAgo(18), player: { id: 'p7', name: 'Frank M\u00fcller' }, result: 'clear', responseTimeMs: 198, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa07' },
  { id: 'oa-8', checkedAt: minutesAgo(22), player: { id: 'p8', name: 'Ingrid Braun' }, result: 'clear', responseTimeMs: 165, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa08' },
]

/* ── LUGAS fixtures ── */
const lugasHistory = Array.from({ length: 8 }, (_, i) => ({ syncedAt: minutesAgo(i * 30 + 2), playersSynced: 8400 + Math.floor(Math.random() * 100), failures: i === 3 ? 2 : 0, durationMs: 800 + Math.floor(Math.random() * 600) }))
const lugasPlayersAtLimit = [
  { id: 'lp1', name: 'Klaus Wagner', amount: 1000, resetAt: daysFromNow(18) },
  { id: 'lp2', name: 'Ingrid M\u00fcller', amount: 1000, resetAt: daysFromNow(18) },
  { id: 'lp3', name: 'Peter Schmidt', amount: 1000, resetAt: daysFromNow(18) },
]

/* ── Tabs ── */
const rgTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'limits', label: 'Limits' },
  { value: 'exclusions', label: 'Exclusions' },
  { value: 'affordability', label: 'Affordability' },
  { value: 'oasis', label: 'OASIS' },
  { value: 'lugas', label: 'LUGAS' },
]

const s: React.CSSProperties = { fontFamily: 'var(--ub-font-body)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 12 }
const linkStyle: React.CSSProperties = { fontFamily: 'var(--ub-font-body)', fontSize: 11, fontWeight: 600, color: 'var(--ub-color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 8, display: 'block' }

/* ── Tab content components ── */

function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        <div style={s}>Risk distribution</div>
        <RgRiskDistributionBar bands={riskBands} total={12847} />
        <div style={{ ...s, marginTop: 24 }}>Elevated and high risk players</div>
        {highRiskPlayers.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '0.5px solid var(--ub-ghost-border)', fontSize: 13 }}>
            <Avatar name={p.name} size="sm" />
            <span style={{ flex: 1, fontWeight: 500, color: 'var(--ub-color-on-surface)' }}>{p.name}</span>
            <RiskScore score={p.score} mode="inline" />
            <Badge variant={p.kyc as 'approved'} size="sm" />
            <button type="button" style={linkStyle}>View {'\u2192'}</button>
          </div>
        ))}
        <button type="button" style={linkStyle}>View all 1,285 {'\u2192'}</button>
      </div>
      <div>
        <div style={s}>Recent interventions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {interventions.map((iv) => <InterventionCard key={iv.id} intervention={iv} onViewPlayer={() => {}} />)}
        </div>
        <button type="button" style={linkStyle}>View all interventions {'\u2192'}</button>
      </div>
    </div>
  )
}

function LimitsTab({ overrideOpen, setOverrideOpen }: { overrideOpen: boolean; setOverrideOpen: (v: boolean) => void }) {
  const rows = limitPlayers.map((p, i) => (
    <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 200px 90px 160px 140px 100px 90px', alignItems: 'center', height: 52, padding: '6px 0', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)' }}>
      <div />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px' }}><Avatar name={p.name} size="sm" /><span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ub-color-on-surface)' }}>{p.name}</span></div>
      <div style={{ padding: '0 6px' }}><Badge variant={p.kyc as 'approved'} size="sm" /></div>
      <div style={{ padding: '0 6px' }}><LimitBar limitType="deposit" period="monthly" currentAmount={p.depCur} limitAmount={p.depMax} currency="EUR" source={p.src} periodResetAt={daysFromNow(18)} /></div>
      <div style={{ padding: '0 6px' }}><LimitBar limitType="loss" period="weekly" currentAmount={p.lossCur} limitAmount={p.lossMax} currency="EUR" source="player" periodResetAt={daysFromNow(4)} /></div>
      <div style={{ padding: '0 6px' }}><Badge variant={p.src === 'lugas' ? 'rejected' : 'low'} size="sm" label={p.src === 'lugas' ? 'LUGAS' : 'Self-set'} /></div>
      <div style={{ padding: '0 6px' }}><button type="button" style={linkStyle} onClick={() => setOverrideOpen(true)}>Override {'\u2192'}</button></div>
    </div>
  ))
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 12847 }, { value: 'near', label: 'Near-limit', count: 892 }, { value: 'at', label: 'At-limit', count: 134 }, { value: 'lugas', label: 'LUGAS-enforced', count: 8441 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}><DataTable columns={limitColumns} rows={rows} page={1} pageSize={25} total={12847} onPageChange={() => {}} /></div>
      <LimitOverridePanel open={overrideOpen} onClose={() => setOverrideOpen(false)} onSubmit={async () => { await new Promise((r) => setTimeout(r, 1000)) }} player={{ id: 'usr_1a4d', name: 'Thomas Huber' }} currentLimits={[{ limitType: 'deposit', period: 'monthly', currentAmount: 840, limitAmount: 1000, currency: 'EUR', source: 'lugas', periodResetAt: daysFromNow(18) }, { limitType: 'loss', period: 'weekly', currentAmount: 110, limitAmount: 200, currency: 'EUR', source: 'player', periodResetAt: daysFromNow(4), canEdit: true }]} agentId="agent_sk_01" />
    </>
  )
}

function ExclusionsTab() {
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 89 }, { value: 'active', label: 'Active', count: 72 }, { value: 'expired', label: 'Expired', count: 14 }, { value: 'lifted', label: 'Lifted', count: 3 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}><ExclusionList exclusions={exclusions} /></div>
      <div style={{ marginTop: 16 }}><Pagination page={1} pageSize={25} total={89} onPageChange={() => {}} /></div>
    </>
  )
}

function AffordabilityTab() {
  const [sel, setSel] = useState<string[]>(['afc-1', 'afc-2'])
  const affColumns: TableColumn[] = [{ key: 'player', label: 'Player', width: '200px' }, { key: 'trigger', label: 'Trigger', width: '150px' }, { key: 'docs', label: 'Docs', width: '90px' }, { key: 'deadline', label: 'Deadline', width: '130px' }, { key: 'status', label: 'Status', width: '100px' }, { key: 'agent', label: 'Agent', width: '70px' }, { key: 'actions', label: '', width: '40px' }]
  const rows = affordChecks.map((c) => <AffordabilityRow key={c.id} check={c} selected={sel.includes(c.id)} onSelect={(id, v) => setSel((p) => v ? [...p, id] : p.filter((x) => x !== id))} onClick={() => {}} onAction={() => {}} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 18 }, { value: 'pending', label: 'Pending', count: 11 }, { value: 'submitted', label: 'Submitted', count: 4 }, { value: 'overdue', label: 'Overdue', count: 4 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}>
        <DataTable columns={affColumns} rows={rows} selectable selectedIds={sel} onSelectAll={() => setSel(sel.length > 0 ? [] : affordChecks.map((c) => c.id))} page={1} pageSize={25} total={18} onPageChange={() => {}} bulkActions={{ selectedCount: sel.length, agents: [{ id: 'a-1', name: 'Sarah Klein' }], visible: sel.length > 0, onAssignToMe: () => {}, onAssignTo: () => {}, onExport: () => {}, onClearSelection: () => setSel([]) }} />
      </div>
    </>
  )
}

function OasisTab() {
  const rows = oasisEntries.map((e) => <OasisLogRow key={e.id} entry={e} onViewPlayer={() => {}} />)
  const oasisColumns: TableColumn[] = [{ key: 'time', label: 'Time', width: '160px' }, { key: 'player', label: 'Player', width: '200px' }, { key: 'result', label: 'Result', width: '130px' }, { key: 'response', label: 'Response', width: '100px' }, { key: 'session', label: 'Session', width: '100px' }, { key: 'checkId', label: 'Check ID', width: '130px' }]
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 3847 }, { value: 'clear', label: 'Clear', count: 3846 }, { value: 'hit', label: 'Hit', count: 1 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}><DataTable columns={oasisColumns} rows={rows} page={1} pageSize={50} total={3847} onPageChange={() => {}} /></div>
    </>
  )
}

function LugasTab({ syncStatus, failuresToday }: { syncStatus: 'healthy' | 'failed'; failuresToday: number }) {
  return (
    <LugasSyncPanel syncStatus={syncStatus} lastSyncAt={minutesAgo(2)} lastSyncDurationMs={1240} playersSynced={8441} playersAtLimit={3} failuresToday={failuresToday} syncHistory={lugasHistory} playersAtLimitList={lugasPlayersAtLimit} brandMarket="de" onRetrySync={() => {}} />
  )
}

/* ── Page ── */

interface RgPageProps {
  initialTab: string
  sidebarCollapsed: boolean
  overrideOpen: boolean
  lugasSyncStatus: 'healthy' | 'failed'
  lugasFailures: number
}

function RgPage({ initialTab, sidebarCollapsed, overrideOpen: initOverride, lugasSyncStatus, lugasFailures }: RgPageProps) {
  const [tab, setTab] = useState(initialTab)
  const [overrideOpen, setOverrideOpen] = useState(initOverride)

  const tabContent: Record<string, React.JSX.Element> = {
    overview: <OverviewTab />,
    limits: <LimitsTab overrideOpen={overrideOpen} setOverrideOpen={setOverrideOpen} />,
    exclusions: <ExclusionsTab />,
    affordability: <AffordabilityTab />,
    oasis: <OasisTab />,
    lugas: <LugasTab syncStatus={lugasSyncStatus} failuresToday={lugasFailures} />,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar activePath="/rg" brand={brands[0]!} brands={brands} onBrandChange={() => {}} onNavigate={() => {}} agentName="Sarah Klein" agentRole="Compliance Lead" badgeCounts={{ kyc: 6, aml: 2 }} />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="Responsible Gaming" breadcrumbs={[{ label: 'Responsible Gaming' }]} notificationCount={1} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="At-risk players" value="134" change={'\u2191 12 moved to High this week'} changeVariant="warning" status="warning" />
              <KpiCard label="Active exclusions" value="89" change="3 applied today" changeVariant="neutral" status="neutral" />
              <KpiCard label="Affordability checks" value="18" change="4 overdue" changeVariant="negative" status="error" />
              <KpiCard label="OASIS checks today" value="3,847" change="1 hit blocked" changeVariant="positive" status="ok" />
            </KpiRow>
            <TabBar tabs={rgTabs} activeTab={tab} onTabChange={setTab} bordered />
            <div>{tabContent[tab] ?? <OverviewTab />}</div>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/ResponsibleGaming',
  component: RgPage,
  argTypes: {
    initialTab: { control: 'select', options: ['overview', 'limits', 'exclusions', 'affordability', 'oasis', 'lugas'] },
    sidebarCollapsed: { control: 'boolean' },
    overrideOpen: { control: 'boolean' },
    lugasSyncStatus: { control: 'select', options: ['healthy', 'failed'] },
    lugasFailures: { control: 'number' },
  },
  args: { initialTab: 'overview', sidebarCollapsed: false, overrideOpen: false, lugasSyncStatus: 'healthy', lugasFailures: 0 },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof RgPage>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
export const LimitsWithOverride: Story = { args: { initialTab: 'limits', overrideOpen: true } }
export const Exclusions: Story = { args: { initialTab: 'exclusions' } }
export const AffordabilityQueue: Story = { args: { initialTab: 'affordability' } }
export const OasisLog: Story = { args: { initialTab: 'oasis' } }
export const Lugas: Story = { args: { initialTab: 'lugas' } }
export const LugasFailed: Story = { args: { initialTab: 'lugas', lugasSyncStatus: 'failed', lugasFailures: 3 } }
export const CollapsedSidebar: Story = { args: { sidebarCollapsed: true } }
