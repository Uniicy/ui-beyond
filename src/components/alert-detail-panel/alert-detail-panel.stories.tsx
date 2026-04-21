import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AlertDetailPanel } from './alert-detail-panel'
import { Button } from '../button'
import type { AmlAlert } from '../alert-row'
import type { Transaction } from '../transaction-summary-table'
import type { AlertTimelineItem } from '../alert-timeline'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const currentAgent = agents[0]!

const openAlert: AmlAlert = {
  id: 'AML-042',
  ruleName: 'Rapid deposit sequence',
  alertType: 'Transaction monitoring',
  status: 'open',
  severity: 'high',
  player: { id: 'P-1842', name: 'Thomas Huber' },
  riskScore: 82,
  totalAmount: 60000,
  currency: 'EUR',
  transactionCount: 3,
  createdAt: hoursAgo(2),
}

const investigatingAlert: AmlAlert = {
  ...openAlert,
  id: 'AML-043',
  status: 'investigating',
  assignedAgent: { id: 'a-1', name: 'Sarah Klein' },
}

const transactions: Transaction[] = [
  { id: 'tx-1', occurredAt: minutesAgo(12), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 22000, flagged: true },
  { id: 'tx-2', occurredAt: minutesAgo(8), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 42000, flagged: true },
  { id: 'tx-3', occurredAt: minutesAgo(3), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 62000, flagged: true },
]

const timeline: AlertTimelineItem[] = [
  { id: 'tl-1', type: 'note_added', agent: agents[0]!, timestamp: minutesAgo(10), content: 'Checked OASIS \u2014 no match. Requesting source-of-funds documentation.' },
  { id: 'tl-2', type: 'status_changed', agent: agents[1]!, timestamp: minutesAgo(45), metadata: { previousStatus: 'Open', newStatus: 'Investigating' } },
  { id: 'tl-3', type: 'assigned', agent: agents[1]!, timestamp: minutesAgo(46), content: 'Assigned to Sarah Klein' },
  { id: 'tl-4', type: 'created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(2) },
]

const meta = {
  title: 'Components/AlertDetailPanel',
  component: AlertDetailPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    alert: openAlert,
    transactions,
    timeline: [timeline[3]!],
    agents,
    currentAgent,
    open: false,
    onClose: () => {},
    onDismiss: () => {},
    onEscalate: () => {},
    onCreateSAR: () => {},
    onAssign: () => {},
    onAddNote: () => {},
  },
} satisfies Meta<typeof AlertDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

export const OpenNoAssignment: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open alert (unassigned)</Button>
        <AlertDetailPanel {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const Investigating: Story = {
  args: {
    alert: investigatingAlert,
    timeline,
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open alert (investigating)</Button>
        <AlertDetailPanel {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: {
    alert: investigatingAlert,
    timeline,
    open: true,
  },
}
