import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PageShell } from './page-shell'
import { AdminSidebar } from '../admin-sidebar'
import { AdminTopNav } from '../admin-top-nav'
import { KpiRow } from '../kpi-row'
import { Split } from '../split'
import { Stack } from '../stack'
import { SectionTitle } from '../section-title'
import { KpiCard } from '../kpi-card'
import { Surface } from '../surface'

const brands = [
  { name: 'Pferdewetten', id: 'pfw' },
  { name: 'BetBird', id: 'bb' },
]

function ShellDemo({
  defaultSidebarCollapsed,
  defaultDetailPanelOpen,
}: {
  defaultSidebarCollapsed: boolean
  defaultDetailPanelOpen: boolean
}) {
  const [active, setActive] = useState('/dashboard')

  return (
    <PageShell
      defaultSidebarCollapsed={defaultSidebarCollapsed}
      defaultDetailPanelOpen={defaultDetailPanelOpen}
    >
      <PageShell.Sidebar>
        <AdminSidebar
          activePath={active}
          brand={brands[0]!}
          brands={brands}
          onBrandChange={() => {}}
          onNavigate={setActive}
          agentName="Sarah Klein"
          agentRole="Compliance Lead"
          badgeCounts={{ kyc: 6, aml: 2 }}
        />
      </PageShell.Sidebar>

      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="PageShell demo" notificationCount={3} />
        </PageShell.Header>

        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="KPI A" value="42" status="ok" />
              <KpiCard label="KPI B" value="17" status="warning" />
              <KpiCard label="KPI C" value="3" status="error" />
              <KpiCard label="KPI D" value="99" status="ok" />
            </KpiRow>

            <Split ratio="2-1" collapseBelow="lg">
              <Stack gap="md">
                <Surface elevation="low" style={{ padding: 16 }}>
                  <SectionTitle>Main column</SectionTitle>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
                    Left side (2fr). Collapses to full width below lg.
                  </p>
                </Surface>
                <Surface elevation="low" style={{ padding: 16 }}>
                  <SectionTitle>Secondary</SectionTitle>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
                    Another card.
                  </p>
                </Surface>
              </Stack>
              <Surface elevation="low" style={{ padding: 16 }}>
                <SectionTitle>Aside</SectionTitle>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
                  Right side (1fr). Stacks under main column on narrow screens.
                </p>
              </Surface>
            </Split>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>

      <PageShell.DetailPanel>
        <div style={{ padding: 16 }}>
          <SectionTitle>Detail panel</SectionTitle>
          <p style={{ fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
            Toggle with the <code>ub-detail-panel</code> checkbox. Full-screen on mobile.
          </p>
        </div>
      </PageShell.DetailPanel>
    </PageShell>
  )
}

const meta = {
  title: 'Layout/PageShell',
  component: ShellDemo,
  argTypes: {
    defaultSidebarCollapsed: { control: 'boolean' },
    defaultDetailPanelOpen: { control: 'boolean' },
  },
  args: {
    defaultSidebarCollapsed: false,
    defaultDetailPanelOpen: false,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ShellDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SidebarCollapsed: Story = {
  args: { defaultSidebarCollapsed: true },
}

export const WithDetailPanel: Story = {
  args: { defaultDetailPanelOpen: true },
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}
