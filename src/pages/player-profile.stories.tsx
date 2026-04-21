import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { PlayerProfileHeader } from '../components/player-profile-header'
import { KpiCard } from '../components/kpi-card'
import { KycHistoryCard, type KycVerification } from '../components/kyc-history-card'
import { SlaCountdown } from '../components/sla-countdown'
import { RiskScore } from '../components/risk-score'
import { Badge } from '../components/badge'
import { AlertRow, type AmlAlert } from '../components/alert-row'
import { LimitGroup } from '../components/limit-bar'
import { ExclusionList } from '../components/exclusion-card'
import type { Exclusion } from '../components/exclusion-card'
import { TransactionSummaryTable, type Transaction } from '../components/transaction-summary-table'
import { AlertTimeline, type AlertTimelineItem } from '../components/alert-timeline'
import { Surface } from '../components/surface'
import { PageShell } from '../components/page-shell'
import { Split } from '../components/split'
import { Stack } from '../components/stack'
import { SectionTitle } from '../components/section-title'
import type { PlayerHeaderPlayer } from '../components/player-header'

/* ── Helpers ── */
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }
function monthsFromNow(m: number): string { return new Date(Date.now() + m * 30 * 86_400_000).toISOString() }
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

/* ── Fixture: Thomas Huber ── */
const thomas: PlayerHeaderPlayer = {
  id: 'usr_1a4d', externalId: 'user_88291', name: 'Thomas Huber', email: 't.huber@example.de',
  dateOfBirth: '1988-03-12', phone: '+49 171 8823991',
  kycStatus: 'approved', amlRiskTier: 'enhanced', rgIsExcluded: false,
  markets: ['de'], createdAt: '2024-04-15T10:00:00Z',
}

const highRiskPlayer: PlayerHeaderPlayer = {
  id: 'usr_c4e2', externalId: 'user_33801', name: 'Mohammed Al-Rashid', email: 'm.alrashid@example.de',
  dateOfBirth: '1980-06-20',
  kycStatus: 'manual_review', amlRiskTier: 'high_risk', rgIsExcluded: true,
  markets: ['de'], createdAt: '2025-01-10T08:00:00Z',
}

const brands = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]

/* ── KYC fixtures ── */
const kycCurrent: KycVerification = { id: 'kyc-003', attemptNumber: 3, status: 'approved', documentType: 'passport', provider: 'onfido', submittedAt: daysAgo(2), resolvedAt: daysAgo(2) + '', confidence: 0.96 }
const kycAttempt2: KycVerification = { id: 'kyc-002', attemptNumber: 2, status: 'rejected', documentType: 'id_card', provider: 'jumio', submittedAt: daysAgo(5), resolvedAt: daysAgo(4), rejectionReason: 'Image quality too low \u2014 document partially obscured, unable to read MRZ zone.' }
const kycAttempt1: KycVerification = { id: 'kyc-001', attemptNumber: 1, status: 'rejected', documentType: 'passport', provider: 'onfido', submittedAt: daysAgo(8), resolvedAt: daysAgo(7), rejectionReason: 'Poor lighting conditions. Glare on document surface.' }

/* ── AML fixtures ── */
const amlAlerts: AmlAlert[] = [
  { id: 'AML-042', ruleName: 'Rapid deposit sequence', alertType: 'Transaction monitoring', status: 'open', severity: 'high', player: { id: 'usr_1a4d', name: 'Thomas Huber' }, riskScore: 82, totalAmount: 60000, currency: 'EUR', transactionCount: 3, assignedAgent: { id: 'a-1', name: 'Sarah Klein' }, createdAt: hoursAgo(2) },
  { id: 'AML-028', ruleName: 'Velocity check', alertType: 'Transaction monitoring', status: 'dismissed', severity: 'medium', player: { id: 'usr_1a4d', name: 'Thomas Huber' }, riskScore: 45, totalAmount: 30000, currency: 'EUR', transactionCount: 5, createdAt: daysAgo(30) },
  { id: 'AML-014', ruleName: 'Large single transaction', alertType: 'Transaction monitoring', status: 'dismissed', severity: 'low', player: { id: 'usr_1a4d', name: 'Thomas Huber' }, riskScore: 22, totalAmount: 50000, currency: 'EUR', transactionCount: 1, createdAt: daysAgo(90) },
]

/* ── Limits ── */
const limits = [
  { limitType: 'deposit' as const, period: 'monthly' as const, currentAmount: 840, limitAmount: 1000, currency: 'EUR', source: 'lugas' as const, periodResetAt: daysFromNow(18) },
  { limitType: 'loss' as const, period: 'weekly' as const, currentAmount: 110, limitAmount: 200, currency: 'EUR', source: 'player' as const, periodResetAt: daysFromNow(4), canEdit: true },
  { limitType: 'session_time' as const, period: 'daily' as const, currentAmount: 140, limitAmount: 240, source: 'player' as const, periodResetAt: daysFromNow(1), canEdit: true },
]

/* ── Transactions ── */
const transactions: Transaction[] = [
  { id: 'tx-1', occurredAt: hoursAgo(3), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 62000, flagged: true },
  { id: 'tx-2', occurredAt: hoursAgo(3.1), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 42000, flagged: true },
  { id: 'tx-3', occurredAt: hoursAgo(3.2), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 22000, flagged: true },
  { id: 'tx-4', occurredAt: daysAgo(2), type: 'withdrawal', amount: 15000, currency: 'EUR', provider: 'PaySafe', balanceAfter: 2000 },
  { id: 'tx-5', occurredAt: daysAgo(5), type: 'deposit', amount: 10000, currency: 'EUR', provider: 'Trustly', balanceAfter: 17000 },
  { id: 'tx-6', occurredAt: daysAgo(8), type: 'deposit', amount: 5000, currency: 'EUR', provider: 'PaySafe', balanceAfter: 7000 },
  { id: 'tx-7', occurredAt: daysAgo(14), type: 'withdrawal', amount: 3000, currency: 'EUR', provider: 'PaySafe', balanceAfter: 2000 },
  { id: 'tx-8', occurredAt: daysAgo(20), type: 'deposit', amount: 5000, currency: 'EUR', provider: 'Trustly', balanceAfter: 5000 },
]

/* ── Timeline ── */
const timeline: AlertTimelineItem[] = [
  { id: 'tl-01', type: 'rg_limit_reached', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(1), module: 'rg', content: 'Monthly deposit limit \u20ac840 of \u20ac1,000 (84%).' },
  { id: 'tl-02', type: 'aml_alert_created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3), module: 'aml', content: 'Rapid deposit sequence \u2014 3\u00d7 Trustly \u20ac200 in 10 min.' },
  { id: 'tl-03', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.1), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'tl-04', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.2), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'tl-05', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.3), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'tl-06', type: 'kyc_approved', agent: { name: 'Sarah Klein', id: 'a-1' }, timestamp: daysAgo(2), module: 'kyc', content: 'Passport verified via Onfido. Confidence 96%.' },
  { id: 'tl-07', type: 'kyc_rejected', agent: { name: 'System', id: 'system' }, timestamp: daysAgo(5), module: 'kyc', content: 'ID card rejected \u2014 image quality too low.' },
  { id: 'tl-08', type: 'rg_limit_set', agent: { name: 'Thomas Huber', id: 'player' }, timestamp: daysAgo(10), module: 'rg', content: 'Set weekly loss limit to \u20ac200.' },
  { id: 'tl-09', type: 'kyc_rejected', agent: { name: 'System', id: 'system' }, timestamp: daysAgo(8), module: 'kyc', content: 'Passport rejected \u2014 poor lighting conditions.' },
  { id: 'tl-10', type: 'login', agent: { name: 'Thomas Huber', id: 'player' }, timestamp: daysAgo(14), module: 'system' },
  { id: 'tl-11', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: daysAgo(14), module: 'psp', content: '\u20ac50 via Trustly (first deposit)' },
  { id: 'tl-12', type: 'player_created', agent: { name: 'System', id: 'system' }, timestamp: daysAgo(14), module: 'system', content: 'Account registered from DE market.' },
]

/* ── High-risk exclusion ── */
const hrExclusion: Exclusion = { id: 'ex-hr-1', source: 'oasis', duration: 'indefinite', appliedAt: daysAgo(30), oasisRef: 'OASIS-DE-993311', status: 'active' }

/* ── Tabs ── */
const defaultTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'kyc', label: 'KYC' },
  { value: 'aml', label: 'AML', badge: 1 },
  { value: 'rg', label: 'RG' },
  { value: 'payments', label: 'Payments' },
  { value: 'timeline', label: 'Timeline' },
]

const hrTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'kyc', label: 'KYC' },
  { value: 'aml', label: 'AML', badge: 3 },
  { value: 'rg', label: 'RG', badge: 1 },
  { value: 'payments', label: 'Payments' },
  { value: 'timeline', label: 'Timeline' },
]

/* ── Shared styles ── */
const fieldRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)', fontSize: 13 }
const fieldLabel: React.CSSProperties = { color: 'var(--ub-color-on-surface-variant)' }
const fieldValue: React.CSSProperties = { color: 'var(--ub-color-on-surface)', fontWeight: 500 }

/* ── Tab content renderers ── */

function OverviewTab() {
  return (
    <Split ratio="2-1" collapseBelow="lg">
      <Stack gap="md">
        <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
          <SectionTitle>KYC Summary</SectionTitle>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <Badge variant="approved" size="sm" />
            <span style={{ fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Passport {'\u00b7'} Onfido {'\u00b7'} Verified 11 Apr {'\u00b7'} Valid Jun 2028</span>
          </div>
        </Surface>
        <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
          <SectionTitle>AML Summary</SectionTitle>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <Badge variant="enhanced" size="sm" />
            <span style={{ fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Risk score 71 {'\u00b7'} 1 open alert {'\u00b7'} Last checked today</span>
          </div>
        </Surface>
        <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
          <SectionTitle>RG Summary</SectionTitle>
          <span style={{ fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Monthly deposit limit 84% used {'\u00b7'} No exclusion</span>
        </Surface>
      </Stack>
      <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
        <SectionTitle>Identity</SectionTitle>
        {[['Name', 'Thomas Huber'], ['Email', 't.huber@example.de'], ['DOB', '12 Mar 1988'], ['Phone', '+49 171 8823991'], ['Address', 'Berliner Str. 42, M\u00fcnchen'], ['External ID', 'user_88291']].map(([l, v]) => (
          <div key={l} style={fieldRow}><span style={fieldLabel}>{l}</span><span style={fieldValue}>{v}</span></div>
        ))}
      </Surface>
    </Split>
  )
}

function KycTab() {
  return (
    <Stack gap="lg" style={{ maxWidth: 560 }}>
      <div>
        <SectionTitle>Current verification</SectionTitle>
        <KycHistoryCard verification={kycCurrent} isLatest />
      </div>
      <div>
        <SectionTitle>Next review due</SectionTitle>
        <SlaCountdown createdAt={daysAgo(2)} deadline={monthsFromNow(23)} mode="full" />
      </div>
      <div>
        <SectionTitle>Verification history</SectionTitle>
        <Stack gap="sm">
          <KycHistoryCard verification={kycAttempt2} />
          <KycHistoryCard verification={kycAttempt1} />
        </Stack>
      </div>
    </Stack>
  )
}

function AmlTab() {
  return (
    <Stack gap="lg" style={{ maxWidth: 700 }}>
      <div>
        <SectionTitle>Risk score</SectionTitle>
        <RiskScore score={71} mode="full" showLabel />
      </div>
      <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
        <SectionTitle>CDD tier</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="enhanced" size="sm" />
          <span style={{ fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Review due 11 Oct 2026</span>
        </div>
      </Surface>
      <div>
        <SectionTitle>Alert history</SectionTitle>
        {amlAlerts.map((a) => <AlertRow key={a.id} alert={a} />)}
      </div>
      <Surface elevation="low" style={{ padding: 16, borderRadius: 10 }}>
        <SectionTitle>Screening</SectionTitle>
        <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>
          <span>PEP: <strong style={{ color: 'var(--ub-color-tertiary-fixed)' }}>Clear</strong></span>
          <span>Sanctions: <strong style={{ color: 'var(--ub-color-tertiary-fixed)' }}>Clear</strong></span>
          <span>Adverse media: <strong style={{ color: 'var(--ub-color-warning)' }}>1 hit</strong></span>
        </div>
      </Surface>
    </Stack>
  )
}

function RgTab() {
  return (
    <Stack gap="lg" style={{ maxWidth: 560 }}>
      <LimitGroup limits={limits} />
      <div>
        <SectionTitle>Exclusions</SectionTitle>
        <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface-variant)', padding: '24px 0', textAlign: 'center' }}>
          No active or historical exclusions
        </div>
      </div>
    </Stack>
  )
}

function PaymentsTab() {
  return (
    <div style={{ maxWidth: 700 }}>
      <TransactionSummaryTable transactions={transactions} currency="EUR" totalAmount={102000} onViewAll={() => {}} />
    </div>
  )
}

function TimelineTab() {
  return (
    <div style={{ maxWidth: 560 }}>
      <AlertTimeline items={timeline} onAddNote={() => {}} currentAgent={{ name: 'Sarah Klein', id: 'a-1' }} />
    </div>
  )
}

const TAB_CONTENT: Record<string, () => React.JSX.Element> = {
  overview: OverviewTab,
  kyc: KycTab,
  aml: AmlTab,
  rg: RgTab,
  payments: PaymentsTab,
  timeline: TimelineTab,
}

/* ── Page component ── */

interface PlayerProfilePageProps {
  player: PlayerHeaderPlayer
  tabs: Array<{ value: string; label: string; badge?: number }>
  initialTab: string
  sidebarCollapsed: boolean
}

function PlayerProfilePage({ player, tabs, initialTab, sidebarCollapsed }: PlayerProfilePageProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const TabContent = TAB_CONTENT[activeTab] ?? OverviewTab

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar
          activePath="/players"
          brand={brands[0]!}
          brands={brands}
          onBrandChange={() => {}}
          onNavigate={() => {}}
          agentName="Sarah Klein"
          agentRole="Compliance Lead"
          badgeCounts={{ kyc: 6, aml: 2 }}
        />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav
            pageTitle={player.name}
            breadcrumbs={[{ label: 'Players', path: '/players' }, { label: player.name }]}
            primaryAction={{ label: 'New verification', onClick: () => {} }}
            notificationCount={2}
          />
        </PageShell.Header>
        <PageShell.Main style={{ padding: 0 }}>
          <PlayerProfileHeader
            player={player}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNewVerification={() => {}}
            onFlagPlayer={() => {}}
          />
          <div style={{ padding: 'var(--ub-page-padding)' }}>
            <TabContent />
          </div>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/PlayerProfile',
  component: PlayerProfilePage,
  argTypes: {
    initialTab: { control: 'select', options: ['overview', 'kyc', 'aml', 'rg', 'payments', 'timeline'] },
    sidebarCollapsed: { control: 'boolean' },
  },
  args: {
    player: thomas,
    tabs: defaultTabs,
    initialTab: 'kyc',
    sidebarCollapsed: false,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PlayerProfilePage>

export default meta
type Story = StoryObj<typeof meta>

export const KycTabStory: Story = {
  args: { initialTab: 'kyc' },
}

export const AmlTabStory: Story = {
  args: { initialTab: 'aml' },
}

export const RgTabStory: Story = {
  args: { initialTab: 'rg' },
}

export const OverviewTabStory: Story = {
  args: { initialTab: 'overview' },
}

export const TimelineTabStory: Story = {
  args: { initialTab: 'timeline' },
}

export const HighRiskPlayer: Story = {
  args: {
    player: highRiskPlayer,
    tabs: hrTabs,
    initialTab: 'aml',
  },
}
