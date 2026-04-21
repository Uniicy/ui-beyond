import type { Meta, StoryObj } from '@storybook/react'
import { ComplianceFlagCard, type ComplianceFlag } from './compliance-flag-card'
import type { AlertTimelineItem } from '../alert-timeline'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const currentAgent = { id: 'a-1', name: 'Sarah Klein' }
const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const timeline: AlertTimelineItem[] = [
  { id: 'tl-1', type: 'note_added', agent: { name: 'Sarah Klein', id: 'a-1' }, timestamp: minutesAgo(10), content: 'Requested CDD documentation from player via email. Deadline set for 48h.' },
  { id: 'tl-2', type: 'assigned', agent: { name: 'Max Mustermann', id: 'a-2' }, timestamp: hoursAgo(2), content: 'Assigned to Sarah Klein' },
  { id: 'tl-3', type: 'created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3), content: 'Compliance flag raised: Missing CDD documentation' },
]

const baseFlag: ComplianceFlag = {
  id: 'flg-1',
  type: 'Missing CDD documentation',
  severity: 'high',
  player: { id: 'PLR-29481', name: 'Thomas Huber' },
  raisedAt: hoursAgo(3),
  resolutionDeadline: daysFromNow(2),
  resolutionCreatedAt: hoursAgo(3),
  status: 'open',
  assignedAgent: { id: 'a-1', name: 'Sarah Klein' },
  notesCount: 1,
  timeline,
}

const meta = {
  title: 'Components/ComplianceFlagCard',
  component: ComplianceFlagCard,
  args: {
    flag: baseFlag,
    currentAgent,
    agents,
    onAddNote: () => {},
    onAssign: () => {},
    onClose: () => {},
    onDismiss: () => {},
  },
} satisfies Meta<typeof ComplianceFlagCard>

export default meta
type Story = StoryObj<typeof meta>

export const OpenCollapsed: Story = {}

export const OpenExpanded: Story = {
  name: 'Open + expanded (3 notes)',
}

export const Investigating: Story = {
  args: {
    flag: { ...baseFlag, status: 'investigating' },
  },
}

export const Resolved: Story = {
  args: {
    flag: { ...baseFlag, status: 'resolved', notesCount: 4 },
  },
}

export const Critical: Story = {
  args: {
    flag: { ...baseFlag, severity: 'critical', type: 'Suspected money laundering', resolutionDeadline: daysFromNow(0.5) },
  },
}

export const MixedStack: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 900 }}>
      <ComplianceFlagCard {...args} flag={baseFlag} />
      <ComplianceFlagCard {...args} flag={{ ...baseFlag, id: 'flg-2', type: 'Suspicious deposit pattern', severity: 'medium', status: 'investigating', player: { id: 'PLR-11002', name: 'Anna Fischer' }, assignedAgent: { id: 'a-2', name: 'Max Mustermann' }, notesCount: 3 }} />
      <ComplianceFlagCard {...args} flag={{ ...baseFlag, id: 'flg-3', type: 'KYC document expired', severity: 'low', status: 'resolved', player: { id: 'PLR-88100', name: 'Klaus Wagner' }, notesCount: 2, assignedAgent: undefined }} />
      <ComplianceFlagCard {...args} flag={{ ...baseFlag, id: 'flg-4', type: 'Source of funds unverified', severity: 'critical', status: 'open', player: { id: 'PLR-55023', name: 'Marie Schmidt' }, resolutionDeadline: daysFromNow(0.25), notesCount: 0, assignedAgent: undefined }} />
    </div>
  ),
}
