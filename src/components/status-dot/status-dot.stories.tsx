import type { Meta, StoryObj } from '@storybook/react'
import { StatusDot } from './status-dot'

const meta = {
  title: 'Components/StatusDot',
  component: StatusDot,
  argTypes: {
    status: {
      control: 'select',
      options: ['live', 'ok', 'warning', 'error', 'inactive', 'pending'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    pulse: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    status: 'ok',
  },
} satisfies Meta<typeof StatusDot>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: { status: 'live', size: 'md', label: 'Connected' },
}

/* ── All statuses at md ── */

export const Live: Story = {
  args: { status: 'live' },
}

export const Ok: Story = {
  args: { status: 'ok' },
}

export const Warning: Story = {
  args: { status: 'warning' },
}

export const Error: Story = {
  args: { status: 'error' },
}

export const Inactive: Story = {
  args: { status: 'inactive' },
}

export const Pending: Story = {
  args: { status: 'pending' },
}

/* ── Sizes ── */

export const Small: Story = {
  args: { status: 'ok', size: 'sm' },
}

export const Medium: Story = {
  args: { status: 'ok', size: 'md' },
}

export const Large: Story = {
  args: { status: 'ok', size: 'lg' },
}

/* ── Pulse control ── */

export const PulseOn: Story = {
  args: { status: 'ok', pulse: true },
}

export const PulseOff: Story = {
  args: { status: 'live', pulse: false },
}

/* ── With labels ── */

export const LabelAllClear: Story = {
  args: { status: 'ok', label: 'All clear' },
}

export const LabelFailures: Story = {
  args: { status: 'error', label: '2 failures' },
}

export const LabelChecking: Story = {
  args: { status: 'pending', pulse: true, label: 'Checking...' },
}
