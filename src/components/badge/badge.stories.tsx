import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const textVariants = [
  'approved',
  'pending',
  'rejected',
  'manual_review',
  'blocked',
  'expired',
  'high',
  'medium',
  'low',
  'critical',
  'standard',
  'enhanced',
  'high_risk',
  'live',
  'beta',
  'inactive',
  'fail_closed',
  'fail_open',
] as const

const allVariants = [...textVariants, 'count'] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: [...allVariants],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    dot: { control: 'boolean' },
    label: { control: 'text' },
    count: { control: 'number', description: 'Number to display when variant is "count"' },
  },
  args: {
    variant: 'approved',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/* ── Playground ── */

export const Playground: Story = {
  args: { variant: 'approved', size: 'md', dot: true },
}

/* ── All variants at md ── */

export const Approved: Story = { args: { variant: 'approved' } }
export const Pending: Story = { args: { variant: 'pending' } }
export const Rejected: Story = { args: { variant: 'rejected' } }
export const ManualReview: Story = { args: { variant: 'manual_review' } }
export const Blocked: Story = { args: { variant: 'blocked' } }
export const Expired: Story = { args: { variant: 'expired' } }
export const High: Story = { args: { variant: 'high' } }
export const Medium: Story = { args: { variant: 'medium' } }
export const Low: Story = { args: { variant: 'low' } }
export const Critical: Story = { args: { variant: 'critical' } }
export const Standard: Story = { args: { variant: 'standard' } }
export const Enhanced: Story = { args: { variant: 'enhanced' } }
export const HighRisk: Story = { args: { variant: 'high_risk' } }
export const Live: Story = { args: { variant: 'live' } }
export const Beta: Story = { args: { variant: 'beta' } }
export const Inactive: Story = { args: { variant: 'inactive' } }
export const FailClosed: Story = { args: { variant: 'fail_closed' } }
export const FailOpen: Story = { args: { variant: 'fail_open' } }

/* ── Count variant ── */

export const Count1: Story = {
  args: { variant: 'count', count: 1 },
}

export const Count3: Story = {
  args: { variant: 'count', count: 3 },
}

export const Count12: Story = {
  args: { variant: 'count', count: 12 },
}

export const Count99: Story = {
  args: { variant: 'count', count: 99 },
}

export const Count150: Story = {
  args: { variant: 'count', count: 150 },
}

export const CountInline: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--ub-font-body)', fontSize: '13px', color: 'var(--ub-color-on-surface)' }}>
      <Badge variant="count" count={3} /> selected
    </div>
  ),
}

/* ── All text variants at sm ── */

export const AllSmall: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {textVariants.map((v) => (
        <Badge key={v} variant={v} size="sm" />
      ))}
    </div>
  ),
}

/* ── Dot on/off ── */

export const WithDot: Story = {
  args: { variant: 'approved', dot: true },
}

export const WithoutDot: Story = {
  args: { variant: 'approved', dot: false },
}

/* ── Custom label ── */

export const CustomLabel: Story = {
  args: { variant: 'pending', label: 'Awaiting docs' },
}

/* ── Compliance group ── */

export const ComplianceStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Badge variant="approved" dot />
      <Badge variant="pending" dot />
      <Badge variant="rejected" dot />
      <Badge variant="manual_review" dot />
      <Badge variant="blocked" dot />
      <Badge variant="expired" dot />
    </div>
  ),
}

/* ── Risk levels ── */

export const RiskLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Badge variant="low" dot />
      <Badge variant="medium" dot />
      <Badge variant="high" dot />
      <Badge variant="critical" dot />
    </div>
  ),
}

/* ── Fail modes ── */

export const FailModes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge variant="fail_closed" dot />
      <Badge variant="fail_open" dot />
    </div>
  ),
}
