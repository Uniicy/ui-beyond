import type { Meta, StoryObj } from '@storybook/react'
import { KpiCard } from './kpi-card'

const meta = {
  title: 'Components/KpiCard',
  component: KpiCard,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'text' },
    changeVariant: {
      control: 'select',
      options: ['positive', 'negative', 'warning', 'neutral'],
    },
    status: {
      control: 'select',
      options: ['ok', 'warning', 'error', 'neutral'],
    },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Active players',
    value: '12,847',
  },
} satisfies Meta<typeof KpiCard>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: {
    label: 'Active players',
    value: '12,847',
    change: '\u2191 3.2%',
    changeVariant: 'positive',
    status: 'ok',
  },
}

/* ── Dashboard examples ── */

export const ActivePlayers: Story = {
  args: {
    label: 'Active players',
    value: '12,847',
    change: '\u2191 3.2%',
    changeVariant: 'positive',
    status: 'ok',
  },
}

export const PendingKyc: Story = {
  args: {
    label: 'Pending KYC',
    value: '23',
    change: '6 overdue',
    changeVariant: 'warning',
    status: 'warning',
  },
}

export const AmlAlerts: Story = {
  args: {
    label: 'AML alerts',
    value: '2',
    change: 'High severity unassigned',
    changeVariant: 'negative',
    status: 'error',
  },
}

export const OasisStatus: Story = {
  args: {
    label: 'OASIS status',
    value: 'All clear',
    status: 'ok',
  },
}

/* ── Loading ── */

export const Loading: Story = {
  args: { loading: true },
}

/* ── With action ── */

export const WithAction: Story = {
  args: {
    label: 'Pending KYC',
    value: '23',
    change: '6 overdue',
    changeVariant: 'warning',
    status: 'warning',
    action: { label: 'View all \u2192', onClick: () => {} },
  },
}

/* ── Dashboard grid ── */

export const DashboardGrid: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      maxWidth: 960,
    }}>
      <KpiCard
        label="Active players"
        value="12,847"
        change={'\u2191 3.2%'}
        changeVariant="positive"
        status="ok"
      />
      <KpiCard
        label="Pending KYC"
        value="23"
        change="6 overdue"
        changeVariant="warning"
        status="warning"
        action={{ label: 'View all \u2192', onClick: () => {} }}
      />
      <KpiCard
        label="AML alerts"
        value="2"
        change="High severity unassigned"
        changeVariant="negative"
        status="error"
      />
      <KpiCard
        label="OASIS status"
        value="All clear"
        status="ok"
      />
    </div>
  ),
}
