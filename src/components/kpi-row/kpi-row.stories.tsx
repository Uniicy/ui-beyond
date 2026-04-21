import type { Meta, StoryObj } from '@storybook/react'
import { KpiRow } from './kpi-row'
import { KpiCard } from '../kpi-card'

const meta = {
  title: 'Layout/KpiRow',
  component: KpiRow,
  argTypes: {
    minItemWidth: { control: { type: 'number', min: 120, max: 400, step: 10 } },
  },
  args: {
    minItemWidth: 200,
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof KpiRow>

export default meta
type Story = StoryObj<typeof meta>

export const FourCards: Story = {
  render: (args) => (
    <KpiRow {...args}>
      <KpiCard label="Active players" value="12,847" change="\u2191 3.2%" changeVariant="positive" status="ok" />
      <KpiCard label="Pending KYC" value="23" change="6 overdue" changeVariant="warning" status="warning" />
      <KpiCard label="AML alerts" value="2" change="Unassigned" changeVariant="negative" status="error" />
      <KpiCard label="OASIS" value="All clear" status="ok" />
    </KpiRow>
  ),
}

export const SixCards: Story = {
  render: (args) => (
    <KpiRow {...args}>
      <KpiCard label="KPI 1" value="42" />
      <KpiCard label="KPI 2" value="17" />
      <KpiCard label="KPI 3" value="3" />
      <KpiCard label="KPI 4" value="99" />
      <KpiCard label="KPI 5" value="12" />
      <KpiCard label="KPI 6" value="7" />
    </KpiRow>
  ),
}

export const WideItems: Story = {
  args: { minItemWidth: 280 },
  render: (args) => (
    <KpiRow {...args}>
      <KpiCard label="Wide A" value="100" />
      <KpiCard label="Wide B" value="200" />
      <KpiCard label="Wide C" value="300" />
    </KpiRow>
  ),
}
