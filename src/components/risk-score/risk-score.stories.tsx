import type { Meta, StoryObj } from '@storybook/react'
import { RiskScore } from './risk-score'

const meta = {
  title: 'Components/RiskScore',
  component: RiskScore,
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    mode: { control: 'select', options: ['inline', 'full'] },
    showLabel: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
  args: {
    score: 55,
    mode: 'inline',
  },
} satisfies Meta<typeof RiskScore>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { score: 55, mode: 'full', showLabel: true },
}

/* ── All 4 bands ── */

export const LowRisk: Story = {
  args: { score: 20, mode: 'full', showLabel: true },
}

export const Medium: Story = {
  args: { score: 55, mode: 'full', showLabel: true },
}

export const HighRisk: Story = {
  args: { score: 76, mode: 'full', showLabel: true },
}

export const Critical: Story = {
  args: { score: 92, mode: 'full', showLabel: true },
}

/* ── Inline vs Full ── */

export const InlineVsFull: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: '10px', color: 'var(--ub-color-on-surface-variant)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inline</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <RiskScore score={20} mode="inline" />
          <RiskScore score={55} mode="inline" />
          <RiskScore score={76} mode="inline" />
          <RiskScore score={92} mode="inline" />
        </div>
      </div>
      <div style={{ width: 200 }}>
        <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: '10px', color: 'var(--ub-color-on-surface-variant)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full</div>
        <RiskScore score={76} mode="full" showLabel />
      </div>
    </div>
  ),
  args: { score: 76 },
}

/* ── Animated ── */

export const Animated: Story = {
  args: { score: 82, mode: 'full', showLabel: true, animated: true },
}

/* ── Edge cases ── */

export const ScoreZero: Story = {
  args: { score: 0, mode: 'full', showLabel: true },
}

export const ScoreHundred: Story = {
  args: { score: 100, mode: 'full', showLabel: true },
}
