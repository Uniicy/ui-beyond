import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { AlertRow, type AmlAlert } from '../components/alert-row'
import { AlertDetailPanel } from '../components/alert-detail-panel'
import { SARWizard } from '../components/sar-wizard'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'
import type { Transaction } from '../components/transaction-summary-table'
import type { AlertTimelineItem } from '../components/alert-timeline'

/* ── Helpers ── */

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

/* ── Fixture data ── */

const brands = [
  { name: 'Pferdewetten', id: 'pfw' },
  { name: 'BetBird', id: 'bb' },
]

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'James Lawson' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const currentAgent = agents[0]!

const columns: TableColumn[] = [
  { key: 'rule', label: 'Rule', width: '220px', sortable: true },
  { key: 'player', label: 'Player', width: '160px', sortable: true },
  { key: 'risk', label: 'Risk', width: '90px', sortable: true },
  { key: 'amount', label: 'Amount', width: '130px', sortable: true },
  { key: 'severity', label: 'Severity', width: '90px', sortable: true },
  { key: 'agent', label: 'Agent', width: '80px' },
  { key: 'time', label: 'Time', width: '80px', sortable: true },
  { key: 'actions', label: '', width: '40px' },
]

const alerts: AmlAlert[] = [
  { id: 'AML-042', ruleName: 'Rapid deposit sequence', alertType: 'Transaction monitoring', status: 'open', severity: 'high', player: { id: 'P-1842', name: 'Thomas Huber' }, riskScore: 82, totalAmount: 60000, currency: 'EUR', transactionCount: 3, createdAt: hoursAgo(2) },
  { id: 'AML-041', ruleName: 'Structuring pattern', alertType: 'Transaction monitoring', status: 'open', severity: 'high', player: { id: 'P-2105', name: 'Anna Fischer' }, riskScore: 71, totalAmount: 240000, currency: 'EUR', transactionCount: 8, assignedAgent: agents[0], createdAt: hoursAgo(5) },
  { id: 'AML-040', ruleName: 'PEP match', alertType: 'Screening', status: 'open', severity: 'critical', player: { id: 'P-3380', name: 'Mohammed Al-Rashid' }, riskScore: 91, totalAmount: 15000, currency: 'EUR', transactionCount: 1, createdAt: hoursAgo(1) },
  { id: 'AML-039', ruleName: 'Rapid withdrawal', alertType: 'Transaction monitoring', status: 'open', severity: 'medium', player: { id: 'P-4412', name: 'Klaus Wagner' }, riskScore: 45, totalAmount: 80000, currency: 'EUR', transactionCount: 2, assignedAgent: agents[1], createdAt: daysAgo(1) },
  { id: 'AML-038', ruleName: 'Cross-border transfer', alertType: 'Transaction monitoring', status: 'open', severity: 'high', player: { id: 'P-5590', name: 'Ingrid M\u00fcller' }, riskScore: 68, totalAmount: 320000, currency: 'EUR', transactionCount: 4, assignedAgent: agents[0], createdAt: daysAgo(2) },
  { id: 'AML-037', ruleName: 'Cash equivalent', alertType: 'Transaction monitoring', status: 'open', severity: 'low', player: { id: 'P-6678', name: 'Peter Schmidt' }, riskScore: 38, totalAmount: 49000, currency: 'EUR', transactionCount: 1, createdAt: daysAgo(3) },
  { id: 'AML-036', ruleName: 'Velocity check', alertType: 'Transaction monitoring', status: 'investigating', severity: 'medium', player: { id: 'P-7701', name: 'Lisa Bauer' }, riskScore: 55, totalAmount: 92000, currency: 'EUR', transactionCount: 5, assignedAgent: agents[1], createdAt: daysAgo(3) },
  { id: 'AML-035', ruleName: 'Unusual hours', alertType: 'Behavioral', status: 'dismissed', severity: 'low', player: { id: 'P-8832', name: 'Stefan Koch' }, riskScore: 29, totalAmount: 20000, currency: 'EUR', transactionCount: 1, assignedAgent: agents[0], createdAt: daysAgo(4) },
]

const detailTransactions: Transaction[] = [
  { id: 'tx-1', occurredAt: minutesAgo(12), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 22000, flagged: true },
  { id: 'tx-2', occurredAt: minutesAgo(8), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 42000, flagged: true },
  { id: 'tx-3', occurredAt: minutesAgo(3), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 62000, flagged: true },
]

const detailTimeline: AlertTimelineItem[] = [
  { id: 'tl-1', type: 'note_added', agent: { name: 'System', id: 'system' }, timestamp: minutesAgo(5), content: 'Auto-flagged: 3 deposits totalling \u20ac600 within 10 minutes via same payment method.' },
  { id: 'tl-2', type: 'created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(2) },
]

const sarAlerts = alerts.map((a) => ({ id: a.id, ruleName: a.ruleName, severity: a.severity, createdAt: a.createdAt, player: { name: a.player.name } }))

const sarPlayer = {
  id: 'P-1842',
  name: 'Thomas Huber',
  email: 'thomas.huber@example.de',
  kycStatus: 'approved',
  amlRiskTier: 'enhanced',
  dateOfBirth: '14 Mar 1988',
  address: 'Berliner Str. 42, 80331 M\u00fcnchen, Germany',
}

const amlTabs = [
  { value: 'all', label: 'All', count: 84 },
  { value: 'open', label: 'Open', count: 31 },
  { value: 'investigating', label: 'Investigating', count: 18 },
  { value: 'escalated', label: 'Escalated', count: 5 },
  { value: 'dismissed', label: 'Dismissed', count: 30 },
]

/* ── Page ── */

interface AMLQueuePageProps {
  sidebarCollapsed: boolean
  loading: boolean
  empty: boolean
  panelOpen: boolean
  sarWizardOpen: boolean
}

function AMLQueuePage({ sidebarCollapsed, loading, empty, panelOpen: initialPanel, sarWizardOpen: initialSar }: AMLQueuePageProps) {
  const [active, setActive] = useState('/aml')
  const [selectedIds, setSelectedIds] = useState<string[]>(['AML-042', 'AML-041'])
  const [panelOpen, setPanelOpen] = useState(initialPanel)
  const [panelAlert, setPanelAlert] = useState(alerts[0]!)
  const [sarOpen, setSarOpen] = useState(initialSar)

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id))
  }

  const handleRowClick = (id: string) => {
    const a = alerts.find((x) => x.id === id)
    if (a) { setPanelAlert(a); setPanelOpen(true) }
  }

  const rows = alerts.map((a) => (
    <AlertRow
      key={a.id}
      alert={a}
      selected={selectedIds.includes(a.id)}
      onSelect={toggleSelect}
      onClick={handleRowClick}
      onAction={() => {}}
    />
  ))

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar
          activePath={active}
          brand={brands[0]!}
          brands={brands}
          onBrandChange={() => {}}
          onNavigate={setActive}
          agentName="Sarah Klein"
          agentRole="AML Compliance Officer"
          badgeCounts={{ kyc: 6, aml: 2 }}
        />
      </PageShell.Sidebar>

      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav
            pageTitle="AML Alerts"
            breadcrumbs={[{ label: 'Compliance' }, { label: 'AML', path: '/aml' }]}
            primaryAction={{ label: 'Create SAR \u2192', onClick: () => setSarOpen(true) }}
            onSearch={() => {}}
            notificationCount={2}
          />
        </PageShell.Header>

        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Open alerts" value="31" change="2 unassigned high severity" changeVariant="negative" status="error" />
              <KpiCard label="Avg resolution" value="4h 22m" change={'\u2193 38m vs last week'} changeVariant="positive" status="ok" />
              <KpiCard label="SAR pending" value="3" change="1 overdue submission" changeVariant="warning" status="warning" />
              <KpiCard label="Dismissed this week" value="18" change="78% false positive rate" changeVariant="neutral" status="neutral" />
            </KpiRow>

            <FilterBar
              tabs={amlTabs}
              activeTab="open"
              onTabChange={() => {}}
              onSearchChange={() => {}}
              onMarketsChange={() => {}}
              activeMarkets={[]}
              activeFilterCount={2}
              onClearAll={() => {}}
            />

            <DataTable
              columns={columns}
              rows={empty ? [] : (loading ? [] : rows)}
              selectable
              selectedIds={selectedIds}
              onSelectAll={() => setSelectedIds(selectedIds.length > 0 ? [] : alerts.map((a) => a.id))}
              sortKey="time"
              sortDir="desc"
              onSort={() => {}}
              loading={loading}
              empty={empty}
              emptyProps={{
                variant: 'no-results',
                title: 'No alerts match your filters',
                description: 'Try adjusting severity or status filters.',
                action: { label: 'Clear filters', onClick: () => {} },
              }}
              page={1}
              pageSize={25}
              total={empty ? 0 : 31}
              onPageChange={() => {}}
              bulkActions={{
                selectedCount: selectedIds.length,
                agents,
                visible: selectedIds.length > 0,
                onAssignToMe: () => {},
                onAssignTo: () => {},
                onExport: () => {},
                onClearSelection: () => setSelectedIds([]),
              }}
            />
          </Stack>
        </PageShell.Main>
      </PageShell.Body>

      {/* Detail panel (fixed overlay) */}
      <AlertDetailPanel
        alert={panelAlert}
        transactions={detailTransactions}
        timeline={detailTimeline}
        agents={agents}
        currentAgent={currentAgent}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onDismiss={() => setPanelOpen(false)}
        onEscalate={() => setPanelOpen(false)}
        onCreateSAR={() => { setPanelOpen(false); setSarOpen(true) }}
        onAssign={() => {}}
        onAddNote={() => {}}
      />

      {/* SAR Wizard (fixed overlay) */}
      <SARWizard
        open={sarOpen}
        onClose={() => setSarOpen(false)}
        onSubmit={async () => { await new Promise((r) => setTimeout(r, 1500)) }}
        prelinkedAlerts={['AML-042']}
        allAlerts={sarAlerts}
        player={sarPlayer}
        currentAgent={currentAgent}
      />
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/AMLQueue',
  component: AMLQueuePage,
  argTypes: {
    sidebarCollapsed: { control: 'boolean' },
    loading: { control: 'boolean' },
    empty: { control: 'boolean' },
    panelOpen: { control: 'boolean' },
    sarWizardOpen: { control: 'boolean' },
  },
  args: {
    sidebarCollapsed: false,
    loading: false,
    empty: false,
    panelOpen: true,
    sarWizardOpen: false,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AMLQueuePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SarWizardOpen: Story = {
  args: { panelOpen: false, sarWizardOpen: true },
}

export const NoResults: Story = {
  args: { empty: true, panelOpen: false },
}

export const CollapsedSidebar: Story = {
  args: { sidebarCollapsed: true },
}
