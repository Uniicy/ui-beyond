import type { Meta, StoryObj } from '@storybook/react'
import { SlaCountdown } from './sla-countdown'

/* Helper: create dates relative to now */
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString()
}

function minutesFromNow(m: number): string {
  return new Date(Date.now() + m * 60_000).toISOString()
}

function secondsFromNow(s: number): string {
  return new Date(Date.now() + s * 1_000).toISOString()
}

const meta = {
  title: 'Components/SlaCountdown',
  component: SlaCountdown,
  argTypes: {
    mode: { control: 'select', options: ['inline', 'full'] },
    paused: { control: 'boolean' },
  },
  args: {
    mode: 'inline',
  },
} satisfies Meta<typeof SlaCountdown>

export default meta
type Story = StoryObj<typeof meta>

/* ── Healthy: 35% elapsed, ~3h 22m remaining ── */

export const Healthy: Story = {
  args: {
    createdAt: hoursAgo(3),
    deadline: hoursFromNow(3.37),
    mode: 'full',
  },
}

/* ── Warning: 68% elapsed, ~58m remaining ── */

export const Warning: Story = {
  args: {
    createdAt: hoursAgo(2.1),
    deadline: minutesFromNow(58),
    mode: 'full',
  },
}

/* ── Critical: 88% elapsed, ~12m remaining ── */

export const Critical: Story = {
  args: {
    createdAt: hoursAgo(1.5),
    deadline: minutesFromNow(12),
    mode: 'full',
  },
}

/* ── Breached: overdue by ~2h 14m ── */

export const Breached: Story = {
  args: {
    createdAt: hoursAgo(6),
    deadline: hoursAgo(2.23),
    mode: 'full',
  },
}

/* ── Paused ── */

export const Paused: Story = {
  args: {
    createdAt: hoursAgo(1),
    deadline: hoursFromNow(2),
    paused: true,
    mode: 'full',
  },
}

/* ── Inline vs Full comparison ── */

export const InlineVsFull: Story = {
  args: {
    createdAt: hoursAgo(1.5),
    deadline: hoursFromNow(1),
  },
  render: () => {
    const createdAt = hoursAgo(1.5)
    const deadline = hoursFromNow(1)
    return (
      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: '10px', color: 'var(--ub-color-on-surface-variant)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inline</div>
          <SlaCountdown createdAt={createdAt} deadline={deadline} mode="inline" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: '10px', color: 'var(--ub-color-on-surface-variant)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full</div>
          <SlaCountdown createdAt={createdAt} deadline={deadline} mode="full" />
        </div>
      </div>
    )
  },
}

/* ── Live: deadline 30 seconds from now — watch it update ── */

export const Live: Story = {
  args: {
    createdAt: hoursAgo(0.01),
    deadline: secondsFromNow(30),
    mode: 'full',
  },
}
