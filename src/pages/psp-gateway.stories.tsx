import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { TabBar } from '../components/tab-bar'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { TransactionRow, type TransactionEntry } from '../components/transaction-row'
import { TransactionDetailPanel } from '../components/transaction-detail-panel'
import { RoutingRuleEditor } from '../components/routing-rule-editor'
import type { RoutingRule } from '../components/routing-rule-card'
import { ReconciliationRow, type ReconciliationEntry } from '../components/reconciliation-row'
import { ChargebackRow, type ChargebackEntry } from '../components/chargeback-row'
import { ChargebackDetailPanel } from '../components/chargeback-detail-panel'
import type { UploadedFile } from '../components/file-uploader'
import { CemsStatusPanel } from '../components/cems-status-panel'
import { Pagination } from '../components/pagination'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'

/* ── Helpers ── */
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const brands = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]
const pspTabs = [
  { value: 'transactions', label: 'Transactions' },
  { value: 'routing', label: 'Routing' },
  { value: 'reconciliation', label: 'Reconciliation' },
  { value: 'chargebacks', label: 'Chargebacks' },
  { value: 'cems', label: 'CEMS' },
]

/* ── Transaction fixtures ── */
const txColumns: TableColumn[] = [
  { key: 'time', label: 'Time', width: '150px', sortable: true },
  { key: 'player', label: 'Player', width: '180px', sortable: true },
  { key: 'type', label: 'Type', width: '90px' },
  { key: 'amount', label: 'Amount', width: '120px', sortable: true },
  { key: 'provider', label: 'Provider', width: '110px' },
  { key: 'compliance', label: 'Compliance', width: '110px' },
  { key: 'status', label: 'Status', width: '100px' },
  { key: 'actions', label: '', width: '40px' },
]

const txs: TransactionEntry[] = [
  { id: 'tx-1', occurredAt: minutesAgo(5), type: 'deposit', player: { id: 'p1', name: 'Thomas Huber' }, amount: 20000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-88291-A', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-2', occurredAt: minutesAgo(8), type: 'deposit', player: { id: 'p2', name: 'Anna Fischer' }, amount: 50000, currency: 'EUR', provider: 'nuvei', providerRef: 'NUV-44102-B', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-3', occurredAt: minutesAgo(12), type: 'withdrawal', player: { id: 'p3', name: 'Klaus Wagner' }, amount: 15000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-55008-C', status: 'held', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'warn' } },
  { id: 'tx-4', occurredAt: minutesAgo(15), type: 'deposit', player: { id: 'p4', name: 'Mohammed Al-Rashid' }, amount: 120000, currency: 'EUR', provider: 'paysafe', providerRef: 'PSF-33801-D', status: 'rejected', complianceChecks: { oasis: 'fail', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-5', occurredAt: minutesAgo(20), type: 'deposit', player: { id: 'p5', name: 'Ingrid M\u00fcller' }, amount: 8000, currency: 'EUR', provider: 'mcb_juice', providerRef: 'MCB-77201-E', status: 'completed', complianceChecks: { kyc: 'pass', limit: 'pass' } },
  { id: 'tx-6', occurredAt: minutesAgo(25), type: 'withdrawal', player: { id: 'p6', name: 'Lisa Bauer' }, amount: 40000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-66119-F', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-7', occurredAt: minutesAgo(30), type: 'deposit', player: { id: 'p7', name: 'Stefan Koch' }, amount: 5000, currency: 'EUR', provider: 'paypal', providerRef: 'PPL-99410-G', status: 'pending', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-8', occurredAt: minutesAgo(40), type: 'deposit', player: { id: 'p8', name: 'Peter Schmidt' }, amount: 75000, currency: 'EUR', provider: 'nuvei', providerRef: 'NUV-88932-H', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
]

/* ── Routing fixtures ── */
const routingRules: RoutingRule[] = [
  { id: 'rr-1', priority: 1, name: 'High value deposits', conditions: [{ field: 'amount', operator: 'greater_than', value: 1000 }, { field: 'currency', operator: 'is', value: 'EUR' }], targetProvider: 'nuvei', active: true },
  { id: 'rr-2', priority: 2, name: 'Mauritius players', conditions: [{ field: 'country', operator: 'in_list', value: ['MU'] }, { field: 'currency', operator: 'is', value: 'MUR' }], targetProvider: 'mcb_juice', active: true },
  { id: 'rr-3', priority: 3, name: 'German standard', conditions: [{ field: 'country', operator: 'is', value: ['DE'] }], targetProvider: 'trustly', active: true },
  { id: 'rr-4', priority: 4, name: 'Fallback PaySafe', conditions: [], targetProvider: 'paysafe', active: true },
]
const providers = ['trustly', 'nuvei', 'paysafe', 'mcb_juice', 'zimpler', 'paypal']

/* ── Reconciliation fixtures ── */
const recs: ReconciliationEntry[] = [
  { id: 'rec-1', date: '10 Apr 2026', provider: 'trustly', expectedAmount: 4520000, actualAmount: 4520000, delta: 0, currency: 'EUR', status: 'reconciled' },
  { id: 'rec-2', date: '10 Apr 2026', provider: 'nuvei', expectedAmount: 3280000, actualAmount: 3156000, delta: -124000, currency: 'EUR', status: 'mismatch' },
  { id: 'rec-3', date: '10 Apr 2026', provider: 'paysafe', expectedAmount: 1890000, actualAmount: 1890000, delta: 0, currency: 'EUR', status: 'reconciled' },
  { id: 'rec-4', date: '09 Apr 2026', provider: 'trustly', expectedAmount: 5100000, actualAmount: 5100000, delta: 0, currency: 'EUR', status: 'reconciled' },
  { id: 'rec-5', date: '09 Apr 2026', provider: 'nuvei', expectedAmount: 2950000, actualAmount: 2950000, delta: 0, currency: 'EUR', status: 'reconciled' },
]
const recColumns: TableColumn[] = [
  { key: 'date', label: 'Date', width: '120px' }, { key: 'provider', label: 'Provider', width: '110px' },
  { key: 'expected', label: 'Expected', width: '130px' }, { key: 'actual', label: 'Actual', width: '130px' },
  { key: 'delta', label: 'Delta', width: '130px' }, { key: 'status', label: 'Status', width: '100px' },
  { key: 'agent', label: 'Agent', width: '70px' }, { key: 'action', label: '', width: '100px' },
]

/* ── Chargeback fixtures ── */
const cbs: ChargebackEntry[] = [
  { id: 'cb-1', player: { id: 'p1', name: 'Thomas Huber' }, originalAmount: 20000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-88291', reasonCode: '4853', reasonLabel: 'Cardholder dispute', evidenceDeadline: hoursAgo(2), evidenceCreatedAt: daysAgo(5), evidenceUploaded: 0, evidenceRequired: 3, status: 'open', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } },
  { id: 'cb-2', player: { id: 'p2', name: 'Anna Fischer' }, originalAmount: 50000, currency: 'EUR', provider: 'nuvei', providerRef: 'NUV-44102', reasonCode: '4863', reasonLabel: 'Not as described', evidenceDeadline: hoursFromNow(120), evidenceCreatedAt: daysAgo(3), evidenceUploaded: 2, evidenceRequired: 3, status: 'open', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } },
  { id: 'cb-3', player: { id: 'p3', name: 'Klaus Wagner' }, originalAmount: 15000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-55008', reasonCode: '4853', reasonLabel: 'Cardholder dispute', evidenceDeadline: hoursFromNow(48), evidenceCreatedAt: daysAgo(2), evidenceUploaded: 3, evidenceRequired: 3, status: 'disputed' },
  { id: 'cb-4', player: { id: 'p4', name: 'Mohammed Al-Rashid' }, originalAmount: 8000, currency: 'EUR', provider: 'paysafe', providerRef: 'PSF-33801', reasonCode: '4853', reasonLabel: 'Cardholder dispute', evidenceDeadline: daysAgo(3), evidenceCreatedAt: daysAgo(10), evidenceUploaded: 0, evidenceRequired: 3, status: 'accepted' },
]
const cbColumns: TableColumn[] = [
  { key: 'player', label: 'Player', width: '200px' }, { key: 'reason', label: 'Reason', width: '180px' },
  { key: 'provider', label: 'Provider', width: '100px' }, { key: 'evidence', label: 'Evidence', width: '90px' },
  { key: 'deadline', label: 'Deadline', width: '130px' }, { key: 'status', label: 'Status', width: '90px' },
  { key: 'agent', label: 'Agent', width: '70px' }, { key: 'actions', label: '', width: '40px' },
]

/* ── CEMS fixtures ── */
const cemsHistory = Array.from({ length: 6 }, (_, i) => ({ reportedAt: minutesAgo(i * 60 + 4), transactionCount: 130 + Math.floor(Math.random() * 30), status: 'success' as const, durationMs: 400 + Math.floor(Math.random() * 300) }))

/* ── Tab content ── */

function TransactionsTab({ panelOpen, setPanelOpen, panelTx, setPanelTx }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void; panelTx: TransactionEntry; setPanelTx: (tx: TransactionEntry) => void }) {
  const rows = txs.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={(id) => { const t = txs.find((x) => x.id === id); if (t) { setPanelTx(t); setPanelOpen(true) } }} onAction={() => {}} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 1847 }, { value: 'deposits', label: 'Deposits', count: 1203 }, { value: 'withdrawals', label: 'Withdrawals', count: 644 }, { value: 'held', label: 'Held', count: 3 }, { value: 'failed', label: 'Failed', count: 12 }]} activeTab="all" onTabChange={() => {}} activeProvider="Trustly" onProviderChange={() => {}} activeFilterCount={1} onClearAll={() => {}} />
      <div style={{ marginTop: 16 }}>
        <DataTable columns={txColumns} rows={rows} page={1} pageSize={50} total={1847} onPageChange={() => {}} sortKey="time" sortDir="desc" onSort={() => {}} />
      </div>
      <TransactionDetailPanel tx={panelTx} open={panelOpen} onClose={() => setPanelOpen(false)} onHold={() => {}} onApprove={() => {}} onReject={() => {}} />
    </>
  )
}

function RoutingTab({ editRuleId }: { editRuleId?: string }) {
  const [rules, setRules] = useState<RoutingRule[]>([...routingRules])
  return <RoutingRuleEditor rules={rules} onRulesChange={setRules} onSave={async () => { await new Promise((r) => setTimeout(r, 1000)) }} onDiscard={() => setRules([...routingRules])} providers={providers} isDirty={false} />
}

function ReconciliationTab() {
  const rows = recs.map((r) => <ReconciliationRow key={r.id} rec={r} onInvestigate={() => {}} />)
  return <DataTable columns={recColumns} rows={rows} page={1} pageSize={25} total={5} onPageChange={() => {}} />
}

function ChargebacksTab({ panelOpen, setPanelOpen }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 'uf1', name: 'bank_statement.pdf', sizeMb: 2.4, status: 'complete' },
    { id: 'uf2', name: 'player_comms.pdf', sizeMb: 1.1, status: 'complete' },
  ])
  const rows = cbs.map((cb) => <ChargebackRow key={cb.id} cb={cb} onClick={(id) => { if (id === 'cb-2') setPanelOpen(true) }} onSelect={() => {}} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 4 }, { value: 'open', label: 'Open', count: 3 }, { value: 'disputed', label: 'Disputed', count: 1 }, { value: 'accepted', label: 'Accepted', count: 0 }, { value: 'won', label: 'Won', count: 0 }]} activeTab="all" onTabChange={() => {}} />
      <div style={{ marginTop: 16 }}><DataTable columns={cbColumns} rows={rows} selectable page={1} pageSize={25} total={4} onPageChange={() => {}} /></div>
      <ChargebackDetailPanel chargeback={cbs[1]!} originalTransaction={{ id: 'tx-orig', occurredAt: daysAgo(10), type: 'deposit', amount: 50000, currency: 'EUR', provider: 'Nuvei', balanceAfter: 50000 }} files={files} onFilesChange={setFiles} onDispute={() => {}} onAccept={() => {}} onSubmitEvidence={() => {}} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}

function CemsTab({ status, failures }: { status: 'healthy' | 'failed'; failures: number }) {
  return <CemsStatusPanel reportStatus={status} lastReportAt={minutesAgo(4)} reportsToday={24} transactionsReported={142} failuresToday={failures} reportHistory={cemsHistory} brandMarket="mu" onManualReport={() => {}} />
}

/* ── Page ── */

interface PSPPageProps {
  initialTab: string
  sidebarCollapsed: boolean
  txPanelOpen: boolean
  cbPanelOpen: boolean
  cemsStatus: 'healthy' | 'failed'
  cemsFailures: number
}

function PSPPage({ initialTab, sidebarCollapsed, txPanelOpen: initTxPanel, cbPanelOpen: initCbPanel, cemsStatus, cemsFailures }: PSPPageProps) {
  const [tab, setTab] = useState(initialTab)
  const [txPanelOpen, setTxPanelOpen] = useState(initTxPanel)
  const [txPanelTx, setTxPanelTx] = useState(txs[2]!)
  const [cbPanelOpen, setCbPanelOpen] = useState(initCbPanel)

  const content: Record<string, React.JSX.Element> = {
    transactions: <TransactionsTab panelOpen={txPanelOpen} setPanelOpen={setTxPanelOpen} panelTx={txPanelTx} setPanelTx={setTxPanelTx} />,
    routing: <RoutingTab />,
    reconciliation: <ReconciliationTab />,
    chargebacks: <ChargebacksTab panelOpen={cbPanelOpen} setPanelOpen={setCbPanelOpen} />,
    cems: <CemsTab status={cemsStatus} failures={cemsFailures} />,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar activePath="/psp" brand={brands[0]!} brands={brands} onBrandChange={() => {}} onNavigate={() => {}} agentName="Sarah Klein" agentRole="PSP Operations" badgeCounts={{ kyc: 6, aml: 2 }} />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="PSP Gateway" breadcrumbs={[{ label: 'PSP Gateway' }]} notificationCount={1} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Volume today" value="\u20ac284,320" change={'\u2191 12% vs yesterday'} changeVariant="positive" status="ok" />
              <KpiCard label="Transactions" value="1,847" change="3 held awaiting review" changeVariant="warning" status="warning" />
              <KpiCard label="Reconciliation" value="1 mismatch" change="Nuvei \u2013\u20ac1,240" changeVariant="negative" status="error" />
              <KpiCard label="Chargebacks" value="4 open" change="1 evidence overdue" changeVariant="warning" status="warning" />
            </KpiRow>
            <TabBar tabs={pspTabs} activeTab={tab} onTabChange={setTab} bordered />
            <div>{content[tab]}</div>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/PSPGateway',
  component: PSPPage,
  argTypes: {
    initialTab: { control: 'select', options: ['transactions', 'routing', 'reconciliation', 'chargebacks', 'cems'] },
    sidebarCollapsed: { control: 'boolean' },
    txPanelOpen: { control: 'boolean' },
    cbPanelOpen: { control: 'boolean' },
    cemsStatus: { control: 'select', options: ['healthy', 'failed'] },
    cemsFailures: { control: 'number' },
  },
  args: { initialTab: 'transactions', sidebarCollapsed: false, txPanelOpen: true, cbPanelOpen: false, cemsStatus: 'healthy', cemsFailures: 0 },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PSPPage>

export default meta
type Story = StoryObj<typeof meta>

export const Transactions: Story = {}

export const RoutingEditor: Story = {
  args: { initialTab: 'routing', txPanelOpen: false },
}

export const ReconciliationMismatch: Story = {
  args: { initialTab: 'reconciliation', txPanelOpen: false },
}

export const Chargebacks: Story = {
  args: { initialTab: 'chargebacks', txPanelOpen: false, cbPanelOpen: true },
}

export const CemsHealthy: Story = {
  args: { initialTab: 'cems', txPanelOpen: false },
}

export const CemsFailed: Story = {
  args: { initialTab: 'cems', txPanelOpen: false, cemsStatus: 'failed', cemsFailures: 3 },
}

export const CollapsedSidebar: Story = {
  args: { sidebarCollapsed: true },
}
