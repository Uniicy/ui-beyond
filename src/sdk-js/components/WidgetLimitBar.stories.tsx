import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { WidgetLimitBar } from './WidgetLimitBar'

const meta = {
  title: 'SDK/WidgetLimitBar',
  component: WidgetLimitBar,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Monthly deposit',
    used: 0,
    limit: 1000,
    source: 'self',
    periodResetLabel: 'Resets 1 May',
  },
} satisfies Meta<typeof WidgetLimitBar>

export default meta
type Story = StoryObj<typeof meta>

const cardStyle: CSSProperties = {
  width: 368,
  padding: 16,
  background: 'var(--sdk-bg)',
  borderRadius: 14,
  boxShadow: 'var(--sdk-shadow)',
  fontFamily: 'var(--sdk-font)',
  boxSizing: 'border-box',
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={cardStyle}>{children}</div>
}

export const SelfHealthy: Story = {
  name: 'Self-set healthy (42%)',
  args: {
    label: 'Monthly deposit',
    used: 420,
    limit: 1000,
    currency: 'EUR',
    source: 'self',
    periodResetLabel: 'Resets 1 May',
    canChange: true,
  },
  render: (args) => (
    <Card>
      <WidgetLimitBar {...args} />
    </Card>
  ),
}

export const NearLimit: Story = {
  name: 'Near limit warning (88%)',
  args: {
    label: 'Monthly deposit',
    used: 880,
    limit: 1000,
    currency: 'EUR',
    source: 'regulatory',
    periodResetLabel: 'Resets 1 May',
  },
  render: (args) => (
    <Card>
      <WidgetLimitBar {...args} />
    </Card>
  ),
}

export const Breached: Story = {
  name: 'Breached (104%)',
  args: {
    label: 'Monthly deposit',
    used: 1040,
    limit: 1000,
    currency: 'EUR',
    source: 'regulatory',
    periodResetLabel: 'Resets 1 May',
  },
  render: (args) => (
    <Card>
      <WidgetLimitBar {...args} />
    </Card>
  ),
}

export const TimeLimit: Story = {
  name: 'Time limit',
  args: {
    label: 'Daily session',
    used: 140,
    limit: 240,
    unit: 'min',
    source: 'self',
    periodResetLabel: 'Resets midnight',
    canChange: true,
  },
  render: (args) => (
    <Card>
      <WidgetLimitBar {...args} />
    </Card>
  ),
}

export const StackOfThree: Story = {
  name: 'Stack of 3',
  render: () => (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <WidgetLimitBar
          label="Monthly deposit"
          used={420}
          limit={1000}
          currency="EUR"
          source="self"
          periodResetLabel="Resets 1 May"
          canChange
        />
        <WidgetLimitBar
          label="Weekly loss"
          used={180}
          limit={200}
          currency="EUR"
          source="regulatory"
          periodResetLabel="Resets Monday"
        />
        <WidgetLimitBar
          label="Daily session"
          used={140}
          limit={240}
          unit="min"
          source="self"
          periodResetLabel="Resets midnight"
          canChange
        />
      </div>
    </Card>
  ),
}
