import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { TabBar } from '../components/tab-bar'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { AuditLogRow, type AuditEvent } from '../components/audit-log-row'
import { AuditDetailPanel } from '../components/audit-detail-panel'
import { ReportCard, type Report } from '../components/report-card'
import { ScheduleCard, type Schedule } from '../components/schedule-card'
import { ComplianceFlagCard, type ComplianceFlag } from '../components/compliance-flag-card'
import { RetentionRulesPanel, type RetentionRule } from '../components/retention-rule-row'
import { PurgeConfirmModal } from '../components/purge-confirm-modal'
import { Button } from '../components/button'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'
import type { AlertTimelineItem } from '../components/alert-timeline'

/* ── Helpers ── */
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const brands = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]
const agents = [{ id: 'a-1', name: 'Sarah Klein' }, { id: 'a-2', name: 'James Lawson' }]
const currentAgent = agents[0]!

const auditTabs = [
  { value: 'audit-log', label: 'Audit Log' }, { value: 'player-trail', label: 'Player Audit Trail' },
  { value: 'reports', label: 'Report Centre' }, { value: 'schedules', label: 'Scheduled Reports' },
  { value: 'flags', label: 'Compliance Flags' }, { value: 'retention', label: 'Data Retention' },
]

/* ── Audit Log fixtures ── */
const auditColumns: TableColumn[] = [
  { key: 'time', label: 'Time', width: '140px', sortable: true }, { key: 'event', label: 'Event', width: '200px', sortable: true },
  { key: 'source', label: 'Source', width: '80px' }, { key: 'player', label: 'Player', width: '140px' },
  { key: 'agent', label: 'Agent', width: '100px' }, { key: 'payload', label: 'Payload', width: '1fr' },
]

const auditEvents: AuditEvent[] = [
  { id: 'ae-1', occurredAt: minutesAgo(1), eventType: 'kyc.verification.completed', source: 'kyc', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_1a4d', playerName: 'Thomas Huber', agentId: 'a-1', agentName: 'Sarah K.', payloadPreview: '{"verificationId":"v_3c9d"...}', sha256: 'a1b2c3d4e5f6' },
  { id: 'ae-2', occurredAt: minutesAgo(2), eventType: 'aml.alert.created', source: 'aml', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_2b5e', playerName: 'Anna Fischer', agentName: 'system', payloadPreview: '{"alertId":"alt_88f"...}', sha256: 'b2c3d4e5f6a1' },
  { id: 'ae-3', occurredAt: minutesAgo(3), eventType: 'rg.limit.reached', source: 'rg', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_3c6f', playerName: 'Klaus Wagner', agentName: 'system', payloadPreview: '{"limitType":"deposit"...}', sha256: 'c3d4e5f6a1b2' },
  { id: 'ae-4', occurredAt: minutesAgo(4), eventType: 'psp.deposit.completed', source: 'psp', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_5e8h', playerName: 'Ingrid M\u00fcller', agentName: 'system', payloadPreview: '{"txId":"tx_9f2a"...}', sha256: 'd4e5f6a1b2c3' },
  { id: 'ae-5', occurredAt: minutesAgo(5), eventType: 'kyc.player.blocked', source: 'kyc', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_c4e2', playerName: 'Mohammed Al-Rashid', agentId: 'a-2', agentName: 'James L.', payloadPreview: '{"failureCount":3...}', sha256: 'e5f6a1b2c3d4' },
  { id: 'ae-6', occurredAt: minutesAgo(6), eventType: 'rg.exclusion.applied', source: 'rg', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_6f9i', playerName: 'Peter Schmidt', agentName: 'Peter S.', payloadPreview: '{"source":"player"...}', sha256: 'f6a1b2c3d4e5' },
  { id: 'ae-7', occurredAt: minutesAgo(7), eventType: 'aml.cdd.tier.changed', source: 'aml', tenantId: 'pfw', brandId: 'pfw', playerId: 'usr_7g0j', playerName: 'Lisa Bauer', agentName: 'system', payloadPreview: '{"newTier":"enhanced"...}', sha256: 'a1b2c3d4e5f7' },
  { id: 'ae-8', occurredAt: minutesAgo(8), eventType: 'tenant.package.activated', source: 'system', tenantId: 'pfw', brandId: 'pfw', agentName: 'Super Admin', payloadPreview: '{"package":"market-mu"...}', sha256: 'b2c3d4e5f6a8' },
]

const detailEvent = { ...auditEvents[0]!, payload: { verificationId: 'v_3c9d', provider: 'onfido', confidence: 0.96, documentType: 'passport', resolvedAt: minutesAgo(1) } }

/* ── Report Centre fixtures ── */
const reports: Report[] = [
  { id: 'rp-1', name: 'GGL monthly compliance report', description: 'German market-de', markets: ['de'], formats: ['pdf'], lastGeneratedAt: daysAgo(13), generationStatus: 'idle' },
  { id: 'rp-2', name: 'GRA quarterly report', description: 'Mauritius market-mu', markets: ['mu'], formats: ['pdf', 'csv'], lastGeneratedAt: daysAgo(74), generationStatus: 'idle' },
  { id: 'rp-3', name: 'AML activity summary', description: 'All markets', markets: ['de', 'mu'], formats: ['pdf', 'csv'], lastGeneratedAt: minutesAgo(30), generationStatus: 'ready', downloadUrls: { pdf: '#', csv: '#' } },
  { id: 'rp-4', name: 'KYC verification report', description: 'All markets', markets: ['de', 'mu'], formats: ['pdf'], generationStatus: 'idle' },
  { id: 'rp-5', name: 'Player exclusion report', description: 'All markets', markets: ['de', 'mu'], formats: ['pdf', 'csv'], lastGeneratedAt: daysAgo(9), generationStatus: 'generating' },
  { id: 'rp-6', name: 'UKGC quarterly report', description: 'UK market-gb', markets: ['gb'], formats: ['pdf'], generationStatus: 'idle' },
]

/* ── Scheduled Reports fixtures ── */
const schedules: Schedule[] = [
  { id: 'sc-1', reportName: 'GGL monthly', frequency: 'monthly', nextRunAt: daysFromNow(17), format: 'pdf', recipients: ['compliance@pferdewetten.de'], active: true },
  { id: 'sc-2', reportName: 'AML weekly summary', frequency: 'weekly', nextRunAt: daysFromNow(1), format: 'csv', recipients: ['aml-team@pferdewetten.de'], active: true },
  { id: 'sc-3', reportName: 'KYC daily digest', frequency: 'daily', nextRunAt: daysFromNow(1), format: 'csv', recipients: ['kyc@pferdewetten.de'], active: true },
  { id: 'sc-4', reportName: 'GRA quarterly', frequency: 'quarterly', nextRunAt: daysFromNow(107), format: 'pdf', recipients: ['gra@pferdewetten.de'], active: false },
]

/* ── Compliance Flags fixtures ── */
const flagTimeline: AlertTimelineItem[] = [
  { id: 'ft-1', type: 'note_added', agent: agents[0]!, timestamp: hoursAgo(1), content: 'Requested updated CDD documentation from player via email.' },
  { id: 'ft-2', type: 'created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(4) },
]

const flags: ComplianceFlag[] = [
  { id: 'fl-1', type: 'Missing CDD documentation', severity: 'critical', player: { id: 'usr_1a4d', name: 'Thomas Huber' }, raisedAt: hoursAgo(4), resolutionDeadline: hoursAgo(-3), resolutionCreatedAt: hoursAgo(4), status: 'open', notesCount: 2, timeline: flagTimeline },
  { id: 'fl-2', type: 'Overdue SAR submission', severity: 'high', player: { id: 'usr_2b5e', name: 'Anna Fischer' }, raisedAt: hoursAgo(12), resolutionDeadline: hoursAgo(-22), resolutionCreatedAt: hoursAgo(12), status: 'investigating', assignedAgent: agents[0], notesCount: 0, timeline: [] },
  { id: 'fl-3', type: 'KYC expiry approaching', severity: 'medium', player: { id: 'usr_3c6f', name: 'Klaus Wagner' }, raisedAt: daysAgo(2), resolutionDeadline: daysFromNow(8), resolutionCreatedAt: daysAgo(2), status: 'open', assignedAgent: agents[1], notesCount: 0, timeline: [] },
  { id: 'fl-4', type: 'Affordability check overdue', severity: 'low', player: { id: 'usr_5e8h', name: 'Ingrid M\u00fcller' }, raisedAt: daysAgo(5), resolutionDeadline: daysFromNow(2), resolutionCreatedAt: daysAgo(5), status: 'resolved', assignedAgent: agents[0], notesCount: 1, timeline: [] },
]

/* ── Retention fixtures ── */
const retentionRules: RetentionRule[] = [
  { id: 'rt-1', category: 'AML transaction records', retentionPeriod: '5 years', regulatoryBasis: 'GwG \u00a78', storageSizeGb: 12.4, locked: true, currentRetentionDays: 1825 },
  { id: 'rt-2', category: 'KYC verification data', retentionPeriod: '5 years', regulatoryBasis: 'GwG \u00a75', storageSizeGb: 8.2, locked: true, currentRetentionDays: 1825 },
  { id: 'rt-3', category: 'Player identity records', retentionPeriod: '5 years', regulatoryBasis: 'GDPR Art.17', storageSizeGb: 4.1, locked: true, currentRetentionDays: 1825 },
  { id: 'rt-4', category: 'Session logs', retentionPeriod: '90 days', regulatoryBasis: 'Internal', storageSizeGb: 2.8, locked: false, currentRetentionDays: 90 },
  { id: 'rt-5', category: 'System audit events', retentionPeriod: '7 years', regulatoryBasis: 'GwG \u00a78', storageSizeGb: 256.5, locked: true, currentRetentionDays: 2555 },
]

const purgeCats = [
  { id: 'pc-1', category: 'Session logs', storageSizeGb: 2.8, oldestRecordAt: daysAgo(400) },
  { id: 'pc-2', category: 'Marketing data', storageSizeGb: 1.2, oldestRecordAt: daysAgo(600) },
  { id: 'pc-3', category: 'Anonymised analytics', storageSizeGb: 14.8, oldestRecordAt: daysAgo(1200) },
]

/* ── Tab content ── */

function AuditLogTab({ panelOpen, setPanelOpen }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void }) {
  const rows = auditEvents.map((e) => <AuditLogRow key={e.id} event={e} onClick={() => setPanelOpen(true)} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 48291 }, { value: 'kyc', label: 'KYC', count: 12842 }, { value: 'aml', label: 'AML', count: 8441 }, { value: 'rg', label: 'RG', count: 19203 }, { value: 'psp', label: 'PSP', count: 7801 }, { value: 'system', label: 'System', count: 4 }]} activeTab="all" onTabChange={() => {}} activeFilterCount={1} onClearAll={() => {}} onSearchChange={() => {}} />
      <div style={{ marginTop: 16 }}>
        <DataTable columns={auditColumns} rows={rows} page={1} pageSize={50} total={48291} onPageChange={() => {}} />
      </div>
      <AuditDetailPanel event={detailEvent} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}

function PlayerTrailTab() {
  const playerEvents = auditEvents.filter((e) => e.playerName === 'Thomas Huber' || e.playerName === 'Klaus Wagner').slice(0, 6)
  const rows = playerEvents.map((e) => <AuditLogRow key={e.id} event={e} />)
  return (
    <>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <input style={{ flex: 1, height: 34, padding: '0 12px', border: '0.5px solid var(--ub-color-secondary-container)', borderRadius: 'var(--ub-radius-md)', backgroundColor: 'var(--ub-color-surface-container-low)', fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface)' }} placeholder="Search by player name or ID\u2026" defaultValue="Thomas Huber" />
        <Button variant="primary" size="sm">Export PDF {'\u2192'}</Button>
      </div>
      <DataTable columns={auditColumns} rows={rows} />
    </>
  )
}

function ReportCentreTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
      {reports.map((r) => <ReportCard key={r.id} report={r} onGenerate={() => {}} />)}
    </div>
  )
}

function ScheduledTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 700 }}>
      {schedules.map((s) => <ScheduleCard key={s.id} schedule={s} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />)}
    </div>
  )
}

function FlagsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
      {flags.map((f) => <ComplianceFlagCard key={f.id} flag={f} currentAgent={currentAgent} agents={agents} onAddNote={() => {}} onAssign={() => {}} onClose={() => {}} onDismiss={() => {}} />)}
    </div>
  )
}

function RetentionTab({ purgeOpen, setPurgeOpen }: { purgeOpen: boolean; setPurgeOpen: (v: boolean) => void }) {
  return (
    <>
      <RetentionRulesPanel rules={retentionRules} totalStorageGb={284} quotaGb={420} onManualPurge={() => setPurgeOpen(true)} onEditRule={() => {}} />
      <PurgeConfirmModal open={purgeOpen} onClose={() => setPurgeOpen(false)} onConfirm={async () => { await new Promise((r) => setTimeout(r, 1500)) }} availableCategories={purgeCats} currentAgent={currentAgent} />
    </>
  )
}

/* ── Page ── */

interface AuditPageProps { initialTab: string; sidebarCollapsed: boolean; panelOpen: boolean; purgeOpen: boolean }

function AuditPage({ initialTab, sidebarCollapsed, panelOpen: initPanel, purgeOpen: initPurge }: AuditPageProps) {
  const [tab, setTab] = useState(initialTab)
  const [panelOpen, setPanelOpen] = useState(initPanel)
  const [purgeOpen, setPurgeOpen] = useState(initPurge)

  const content: Record<string, React.JSX.Element> = {
    'audit-log': <AuditLogTab panelOpen={panelOpen} setPanelOpen={setPanelOpen} />,
    'player-trail': <PlayerTrailTab />,
    'reports': <ReportCentreTab />,
    'schedules': <ScheduledTab />,
    'flags': <FlagsTab />,
    'retention': <RetentionTab purgeOpen={purgeOpen} setPurgeOpen={setPurgeOpen} />,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar activePath="/audit" brand={brands[0]!} brands={brands} onBrandChange={() => {}} onNavigate={() => {}} agentName="Sarah Klein" agentRole="Compliance Lead" badgeCounts={{ kyc: 6, aml: 2 }} />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="Audit & Reporting" breadcrumbs={[{ label: 'Audit & Reporting' }]} notificationCount={1} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Events logged today" value="48,291" change={'\u2191 12% vs yesterday'} changeVariant="positive" status="ok" />
              <KpiCard label="Compliance flags" value="4 open" change="1 critical unassigned" changeVariant="negative" status="error" />
              <KpiCard label="Reports generated" value="12" change="3 scheduled this week" changeVariant="positive" status="ok" />
              <KpiCard label="Retention storage" value="284 GB" change="68% of 420 GB quota" changeVariant="warning" status="warning" />
            </KpiRow>
            <TabBar tabs={auditTabs} activeTab={tab} onTabChange={setTab} bordered />
            <div>{content[tab]}</div>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/AuditReporting',
  component: AuditPage,
  argTypes: {
    initialTab: { control: 'select', options: auditTabs.map((t) => t.value) },
    sidebarCollapsed: { control: 'boolean' },
    panelOpen: { control: 'boolean' },
    purgeOpen: { control: 'boolean' },
  },
  args: { initialTab: 'audit-log', sidebarCollapsed: false, panelOpen: true, purgeOpen: false },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuditPage>

export default meta
type Story = StoryObj<typeof meta>

export const AuditLog: Story = {}
export const PlayerAuditTrail: Story = { args: { initialTab: 'player-trail', panelOpen: false } }
export const ReportCentre: Story = { args: { initialTab: 'reports', panelOpen: false } }
export const ScheduledReports: Story = { args: { initialTab: 'schedules', panelOpen: false } }
export const ComplianceFlags: Story = { args: { initialTab: 'flags', panelOpen: false } }
export const DataRetention: Story = { args: { initialTab: 'retention', panelOpen: false } }
export const PurgeModalStep2: Story = { args: { initialTab: 'retention', panelOpen: false, purgeOpen: true } }
export const CollapsedSidebar: Story = { args: { sidebarCollapsed: true } }
