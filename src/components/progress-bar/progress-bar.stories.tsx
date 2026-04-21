import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './progress-bar'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    height: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    intent: { control: 'select', options: ['success', 'warning', 'danger', 'primary', 'neutral'] },
    animated: { control: 'boolean' },
    striped: { control: 'boolean' },
    rounded: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    value: 65,
    height: 'sm',
    intent: 'primary',
    rounded: true,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {}

/* ── All intents at 65% ── */

export const Intents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 400 }}>
      <ProgressBar value={65} intent="success" />
      <ProgressBar value={65} intent="warning" />
      <ProgressBar value={65} intent="danger" />
      <ProgressBar value={65} intent="primary" />
      <ProgressBar value={65} intent="neutral" />
    </div>
  ),
}

/* ── Heights ── */

export const Heights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 400 }}>
      <ProgressBar value={60} height="xs" />
      <ProgressBar value={60} height="sm" />
      <ProgressBar value={60} height="md" />
      <ProgressBar value={60} height="lg" />
    </div>
  ),
}

/* ── Value steps ── */

export const ValueSteps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 400 }}>
      {[0, 25, 50, 75, 95, 100].map((v) => (
        <ProgressBar key={v} value={v} label={`${v}%`} intent="primary" height="md" />
      ))}
    </div>
  ),
}

/* ── Striped (over-limit) ── */

export const Striped: Story = {
  args: { value: 100, striped: true, intent: 'danger', height: 'md', label: 'Limit breached' },
}

/* ── Animated (checking) ── */

export const Animated: Story = {
  args: { value: 45, animated: true, intent: 'primary', height: 'md', label: 'Checking...' },
}

/* ── With label ── */

export const WithLabel: Story = {
  args: { value: 42, intent: 'warning', height: 'md', label: '\u20ac420 of \u20ac1,000' },
}

/* ── Transition demo ── */

export const TransitionDemo: Story = {
  render: () => {
    const steps = [0, 25, 50, 75, 95, 100]
    const [index, setIndex] = useState(0)
    const value = steps[index % steps.length]!

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 400 }}>
        <ProgressBar value={value} intent="primary" height="md" label={`${value}%`} />
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--ub-color-surface-container-high)',
            color: 'var(--ub-color-on-surface)',
            fontFamily: 'var(--ub-font-body)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Next: {steps[(index + 1) % steps.length]}%
        </button>
      </div>
    )
  },
}
