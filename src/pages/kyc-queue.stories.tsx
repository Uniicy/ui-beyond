import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { VerificationRow, type Verification } from '../components/verification-row'
import { VerificationDetailPanel } from '../components/verification-detail-panel'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'

/* ── Helpers ── */

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}
function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString()
}
function minutesFromNow(m: number): string {
  return new Date(Date.now() + m * 60_000).toISOString()
}

/* ── Fixture data ── */

const brands = [
  { name: 'Pferdewetten', id: 'pfw' },
  { name: 'BetBird', id: 'bb' },
]

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const statusCounts = { all: 47, pending: 23, manual_review: 8, rejected: 12, approved: 4, expired: 0 }

const columns: TableColumn[] = [
  { key: 'player', label: 'Player', width: '200px', sortable: true },
  { key: 'status', label: 'Status', width: '110px', sortable: true },
  { key: 'document', label: 'Document', width: '110px' },
  { key: 'provider', label: 'Provider', width: '90px' },
  { key: 'sla', label: 'SLA', width: '130px', sortable: true },
  { key: 'agent', label: 'Agent', width: '80px' },
  { key: 'market', label: 'Market', width: '60px' },
  { key: 'actions', label: '', width: '40px' },
]

const verifications: Verification[] = [
  {
    id: 'V-101', player: { id: 'P-1842', name: 'Thomas Huber', email: 'thomas.huber@example.de' },
    status: 'manual_review', documentType: 'passport', provider: 'onfido',
    slaCreatedAt: hoursAgo(1.5), slaDeadline: minutesFromNow(12),
    assignedAgent: { name: 'Sarah Klein', id: 'a-1' }, market: 'de',
  },
  {
    id: 'V-102', player: { id: 'P-2291', name: 'Max Huber', email: 'max.huber@example.de' },
    status: 'manual_review', documentType: 'passport', provider: 'onfido',
    slaCreatedAt: hoursAgo(1.2), slaDeadline: minutesFromNow(18), slaPaused: true,
    assignedAgent: { name: 'Max Mustermann', id: 'a-2' }, market: 'de',
  },
  {
    id: 'V-103', player: { id: 'P-3104', name: 'Anna Becker', email: 'anna.b@example.de' },
    status: 'manual_review', documentType: 'id_card', provider: 'jumio',
    slaCreatedAt: hoursAgo(2), slaDeadline: hoursFromNow(1),
    assignedAgent: { name: 'Lisa Hoffmann', id: 'a-3' }, market: 'de',
  },
  {
    id: 'V-104', player: { id: 'P-4420', name: 'Stefan Braun', email: 'stefan.braun@example.de' },
    status: 'manual_review', documentType: 'passport', provider: 'onfido',
    slaCreatedAt: hoursAgo(6), slaDeadline: hoursAgo(2.23),
    assignedAgent: { name: 'Sarah Klein', id: 'a-1' }, market: 'de',
  },
  {
    id: 'V-105', player: { id: 'P-5512', name: 'Julia Richter', email: 'julia.r@example.de' },
    status: 'pending', documentType: 'id_card', provider: 'onfido',
    slaCreatedAt: hoursAgo(0.5), slaDeadline: hoursFromNow(5.5),
    market: 'de',
  },
  {
    id: 'V-106', player: { id: 'P-6678', name: 'Markus Weber', email: 'markus.w@example.de' },
    status: 'pending', documentType: 'driving_licence', provider: 'jumio',
    slaCreatedAt: hoursAgo(0.3), slaDeadline: hoursFromNow(5.7),
    assignedAgent: { name: 'Max Mustermann', id: 'a-2' }, market: 'de',
  },
  {
    id: 'V-107', player: { id: 'P-7801', name: 'Claudia Schulz', email: 'claudia.s@example.de' },
    status: 'rejected', documentType: 'passport', provider: 'onfido',
    slaCreatedAt: hoursAgo(3), slaDeadline: hoursAgo(0.5),
    market: 'de',
  },
  {
    id: 'V-108', player: { id: 'P-8932', name: 'Frank M\u00fcller', email: 'frank.m@example.de' },
    status: 'pending', documentType: 'id_card', provider: 'onfido',
    slaCreatedAt: hoursAgo(4), slaDeadline: hoursAgo(1),
    assignedAgent: { name: 'Lisa Hoffmann', id: 'a-3' }, market: 'de',
  },
]

/* ── Page shell ── */

interface KYCQueuePageProps {
  sidebarCollapsed: boolean
  loading: boolean
  empty: boolean
  searchQuery: string
  panelOpen: boolean
  panelVerificationIndex: number
}

function KYCQueuePage({
  sidebarCollapsed,
  loading,
  empty,
  searchQuery,
  panelOpen: initialPanelOpen,
  panelVerificationIndex,
}: KYCQueuePageProps) {
  const [active, setActive] = useState('/kyc')
  const [selectedIds, setSelectedIds] = useState<string[]>(['V-101', 'V-103', 'V-105'])
  const [panelOpen, setPanelOpen] = useState(initialPanelOpen)
  const [activeVerification, setActiveVerification] = useState(verifications[panelVerificationIndex] ?? verifications[1]!)

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const handleRowClick = (id: string) => {
    const v = verifications.find((x) => x.id === id)
    if (v) {
      setActiveVerification(v)
      setPanelOpen(true)
    }
  }

  const rows = verifications.map((v) => (
    <VerificationRow
      key={v.id}
      verification={v}
      selected={selectedIds.includes(v.id)}
      onSelect={toggleSelect}
      onClick={handleRowClick}
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
          agentRole="Compliance Lead"
          badgeCounts={{ kyc: 23, aml: 2 }}
        />
      </PageShell.Sidebar>

      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav
            pageTitle="KYC Verifications"
            breadcrumbs={[{ label: 'Compliance' }, { label: 'KYC', path: '/kyc' }]}
            primaryAction={{ label: 'Review oldest \u2192', onClick: () => {} }}
            onSearch={() => {}}
            notificationCount={2}
          />
        </PageShell.Header>

        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Pending review" value="23" change="6 overdue SLA" changeVariant="warning" status="warning" />
              <KpiCard label="Auto-approved today" value="41" change="90.1% rate" changeVariant="positive" status="ok" />
              <KpiCard label="Avg review time" value="2h 14m" change={'\u2191 18m vs yesterday'} changeVariant="warning" status="warning" />
              <KpiCard label="SLA breaches" value="6" change="2 critical" changeVariant="negative" status="error" />
            </KpiRow>

            <FilterBar
              tabs={[
                { value: 'all', label: 'All', count: statusCounts.all },
                { value: 'pending', label: 'Pending', count: statusCounts.pending },
                { value: 'manual_review', label: 'Manual review', count: statusCounts.manual_review },
                { value: 'rejected', label: 'Rejected', count: statusCounts.rejected },
                { value: 'approved', label: 'Approved', count: statusCounts.approved },
              ]}
              activeTab="manual_review"
              onTabChange={() => {}}
              activeProvider="Onfido"
              onProviderChange={() => {}}
              activeMarkets={['DE']}
              onMarketsChange={() => {}}
              searchQuery={searchQuery}
              onSearchChange={() => {}}
              activeFilterCount={2}
              onClearAll={() => {}}
            />

            <DataTable
              columns={columns}
              rows={empty ? [] : (loading ? [] : rows)}
              selectable
              selectedIds={selectedIds}
              onSelectAll={() => setSelectedIds(selectedIds.length > 0 ? [] : verifications.map((v) => v.id))}
              sortKey="sla"
              sortDir="asc"
              onSort={() => {}}
              loading={loading}
              empty={empty}
              emptyProps={{
                variant: 'no-results',
                title: 'No verifications match your filters',
                description: `No results for "${searchQuery}". Try adjusting your search or filters.`,
                action: { label: 'Clear filters', onClick: () => {} },
              }}
              page={1}
              pageSize={25}
              total={empty ? 0 : 47}
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
      <VerificationDetailPanel
        verification={activeVerification}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onApprove={() => setPanelOpen(false)}
        onReject={() => setPanelOpen(false)}
        onRequestInfo={() => {}}
        onAssign={() => {}}
        agents={agents}
      />
    </PageShell>
  )
}

/* ── Storybook meta ── */

const meta = {
  title: 'Pages/KYCQueue',
  component: KYCQueuePage,
  argTypes: {
    sidebarCollapsed: { control: 'boolean' },
    loading: { control: 'boolean' },
    empty: { control: 'boolean' },
    searchQuery: { control: 'text' },
    panelOpen: { control: 'boolean' },
    panelVerificationIndex: { control: { type: 'range', min: 0, max: 7 } },
  },
  args: {
    sidebarCollapsed: false,
    loading: false,
    empty: false,
    searchQuery: '',
    panelOpen: true,
    panelVerificationIndex: 1,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof KYCQueuePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoResults: Story = {
  args: {
    empty: true,
    searchQuery: 'xyz123',
    panelOpen: false,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    panelOpen: false,
  },
}

export const CollapsedSidebar: Story = {
  args: {
    sidebarCollapsed: true,
  },
}
