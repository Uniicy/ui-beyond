import type { Meta, StoryObj } from '@storybook/react'
import { LimitBar, LimitGroup } from './limit-bar'

function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86_400_000).toISOString()
}

const meta = {
  title: 'Components/LimitBar',
  component: LimitBar,
  args: {
    limitType: 'deposit',
    period: 'monthly',
    currentAmount: 420,
    limitAmount: 1000,
    currency: 'EUR',
    source: 'player',
    periodResetAt: daysFromNow(18),
  },
} satisfies Meta<typeof LimitBar>

export default meta
type Story = StoryObj<typeof meta>

export const SelfSet42Percent: Story = {
  args: {
    currentAmount: 420,
    limitAmount: 1000,
    source: 'player',
    canEdit: true,
  },
}

export const LugasWarning88Percent: Story = {
  args: {
    currentAmount: 880,
    limitAmount: 1000,
    source: 'lugas',
  },
}

export const LugasBreached: Story = {
  args: {
    currentAmount: 1040,
    limitAmount: 1000,
    source: 'lugas',
  },
}

export const SessionTime: Story = {
  args: {
    limitType: 'session_time',
    period: 'daily',
    currentAmount: 95,
    limitAmount: 120,
    currency: undefined,
    source: 'player',
    canEdit: true,
  },
}

export const CanEdit: Story = {
  args: {
    currentAmount: 300,
    limitAmount: 1000,
    source: 'player',
    canEdit: true,
  },
}

export const Group: Story = {
  render: () => (
    <LimitGroup
      limits={[
        { limitType: 'deposit', period: 'monthly', currentAmount: 420, limitAmount: 1000, currency: 'EUR', source: 'lugas', periodResetAt: daysFromNow(18) },
        { limitType: 'loss', period: 'weekly', currentAmount: 180, limitAmount: 500, currency: 'EUR', source: 'player', periodResetAt: daysFromNow(4), canEdit: true },
        { limitType: 'session_time', period: 'daily', currentAmount: 95, limitAmount: 120, source: 'operator', periodResetAt: daysFromNow(1) },
      ]}
    />
  ),
  args: {
    limitType: 'deposit',
    period: 'monthly',
    currentAmount: 420,
    limitAmount: 1000,
    currency: 'EUR',
    source: 'lugas',
    periodResetAt: daysFromNow(18),
  },
}
