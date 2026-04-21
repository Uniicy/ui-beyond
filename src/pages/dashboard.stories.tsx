import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { FlaggedItemsPanel } from '../components/flagged-items'
import { AlertFeed } from '../components/alert-feed'
import { MarketStatusPanel } from '../components/market-status'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Split } from '../components/split'
import { Stack } from '../components/stack'

/* ── Fixture data ── */

const brands = [
  { name: 'Pferdewetten', id: 'pfw' },
  { name: 'BetBird', id: 'bb' },
]

const kpis = {
  activePlayers: { label: 'Active players', value: '12,847', change: '\u2191 3.2%', changeVariant: 'positive' as const, status: 'ok' as const },
  pendingKyc: { label: 'Pending KYC', value: '23', change: '6 overdue', changeVariant: 'warning' as const, status: 'warning' as const },
  amlAlerts: { label: 'AML alerts', value: '2', change: 'High severity unassigned', changeVariant: 'negative' as const, status: 'error' as const },
  oasis: { label: 'OASIS status', value: 'All clear', status: 'ok' as const },
}

const flaggedItems = [
  { category: 'KYC SLA breaches', count: 6, severity: 'error' as const, detail: 'Oldest: 2h 14m overdue', cta: { label: 'Review queue \u2192', onClick: () => {} } },
  { category: 'LUGAS sync failures', count: 2, severity: 'warning' as const, detail: 'Last failure: 12 min ago' },
  { category: 'Scheduled reports', count: 1, severity: 'info' as const, detail: 'Monthly GGL export due in 3 days' },
]

const alertItems = [
  { type: 'aml_alert' as const, playerName: 'Thomas M\u00fcller', description: 'Rapid deposit sequence \u00b7 3\u00d7 Trustly \u00b7 \u20ac600 in 10 min', timestamp: '1 min ago', severity: 'high' as const },
  { type: 'kyc_approved' as const, playerName: 'Max Mustermann', description: 'Document verification completed successfully', timestamp: '2 min ago' },
  { type: 'oasis_hit' as const, playerName: 'Klaus Weber', description: 'OASIS match found \u00b7 National exclusion register', timestamp: '5 min ago', severity: 'high' as const },
  { type: 'player_created' as const, playerName: 'Lisa Hoffmann', description: 'New registration \u00b7 DE market \u00b7 KYC pending', timestamp: '8 min ago' },
  { type: 'kyc_manual' as const, playerName: 'Sarah Schmidt', description: 'Address proof requires manual review \u00b7 Utility bill', timestamp: '12 min ago' },
  { type: 'lugas_failure' as const, description: 'LUGAS sync failed \u00b7 Timeout after 30s \u00b7 Retry scheduled', timestamp: '15 min ago', severity: 'medium' as const },
  { type: 'exclusion_applied' as const, playerName: 'Peter Fischer', description: 'Self-exclusion 6 months \u00b7 Player-initiated', timestamp: '22 min ago' },
  { type: 'kyc_rejected' as const, playerName: 'Jan de Vries', description: 'ID document expired \u00b7 Passport NL', timestamp: '30 min ago', severity: 'medium' as const },
]

const marketRows = [
  { market: 'de' as const, status: 'live' as const, checks: [{ name: 'OASIS', ok: true }, { name: 'LUGAS', ok: true }, { name: 'CEMS', ok: true }, { name: 'Safe Server', ok: true }], lastChecked: '2 min ago' },
  { market: 'mu' as const, status: 'live' as const, lastChecked: '1 min ago' },
  { market: 'nl' as const, status: 'beta' as const, checks: [{ name: 'KSA Portal', ok: true }, { name: 'CRUKS', ok: true }, { name: 'CEMS', ok: false }], lastChecked: '30 sec ago' },
  { market: 'gb' as const, status: 'beta' as const, lastChecked: '5 min ago' },
]

/* ── Page shell ── */

interface DashboardPageProps {
  sidebarCollapsed: boolean
  activePath: string
  notificationCount: number
  badgeCounts: { kyc?: number; aml?: number }
}

function DashboardPage({ sidebarCollapsed, activePath, notificationCount, badgeCounts }: DashboardPageProps) {
  const [active, setActive] = useState(activePath)

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar
          activePath={active}
          brand={brands[0]!}
          brands={brands}
          onBrandChange={() => {}}
          onNavigate={setActive}
          agentName="Thorbjorn Tasche"
          agentRole="Compliance Admin"
          badgeCounts={badgeCounts}
        />
      </PageShell.Sidebar>

      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav
            pageTitle="Dashboard"
            notificationCount={notificationCount}
          />
        </PageShell.Header>

        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard {...kpis.activePlayers} />
              <KpiCard {...kpis.pendingKyc} action={{ label: 'Review queue \u2192', onClick: () => {} }} />
              <KpiCard {...kpis.amlAlerts} />
              <KpiCard {...kpis.oasis} />
            </KpiRow>

            <Split ratio="2-1" collapseBelow="lg">
              <Stack gap="lg">
                <FlaggedItemsPanel items={flaggedItems} />
                <AlertFeed items={alertItems} maxItems={5} onViewAll={() => {}} />
              </Stack>
              <MarketStatusPanel rows={marketRows} />
            </Split>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook meta ── */

const meta = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  argTypes: {
    sidebarCollapsed: { control: 'boolean' },
    activePath: {
      control: 'select',
      options: ['/dashboard', '/players', '/kyc', '/aml', '/rg', '/psp', '/audit', '/notifications', '/tenant', '/api-keys'],
    },
    notificationCount: { control: 'number' },
    badgeCounts: { control: 'object' },
  },
  args: {
    sidebarCollapsed: false,
    activePath: '/dashboard',
    notificationCount: 3,
    badgeCounts: { kyc: 6, aml: 2 },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const CollapsedSidebar: Story = {
  args: {
    sidebarCollapsed: true,
  },
}
