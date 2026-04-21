import type { Meta, StoryObj } from '@storybook/react'
import { AffordabilityRow, type AffordabilityCheck } from './affordability-row'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const pending: AffordabilityCheck = {
  id: 'afc-001', player: { id: 'usr_1a4d', name: 'Thomas Huber', email: 't.huber@example.de' },
  triggerType: 'deposit_threshold', thresholdAmount: 2000, currency: 'EUR',
  deadline: hoursFromNow(48), createdAt: hoursAgo(24),
  documentsUploaded: 1, documentsRequired: 2, status: 'pending',
  assignedAgent: { id: 'a-1', name: 'Sarah Klein' },
}

const breached: AffordabilityCheck = {
  ...pending, id: 'afc-002', deadline: hoursAgo(4), createdAt: daysAgo(3),
  player: { id: 'usr_2b5e', name: 'Anna Fischer', email: 'anna.f@example.de' },
}

const allDocs: AffordabilityCheck = {
  ...pending, id: 'afc-003', documentsUploaded: 2,
  player: { id: 'usr_3c6f', name: 'Klaus Wagner', email: 'klaus.w@example.de' },
}

const noDocs: AffordabilityCheck = {
  ...pending, id: 'afc-004', documentsUploaded: 0,
  player: { id: 'usr_4d7g', name: 'Lisa Bauer', email: 'lisa.b@example.de' },
  assignedAgent: undefined,
}

const submitted: AffordabilityCheck = {
  ...pending, id: 'afc-005', status: 'submitted', documentsUploaded: 2,
  player: { id: 'usr_5e8h', name: 'Markus Weber', email: 'markus.w@example.de' },
}

const approved: AffordabilityCheck = {
  ...pending, id: 'afc-006', status: 'approved', documentsUploaded: 2,
  player: { id: 'usr_6f9i', name: 'Julia Richter', email: 'julia.r@example.de' },
}

const rejected: AffordabilityCheck = {
  ...pending, id: 'afc-007', status: 'rejected', documentsUploaded: 2,
  player: { id: 'usr_7g0j', name: 'Stefan Koch', email: 'stefan.k@example.de' },
}

const expired: AffordabilityCheck = {
  ...pending, id: 'afc-008', status: 'expired', documentsUploaded: 0,
  deadline: daysAgo(2), createdAt: daysAgo(5),
  player: { id: 'usr_8h1k', name: 'Claudia Schulz', email: 'claudia.s@example.de' },
  assignedAgent: undefined,
}

const meta = {
  title: 'Components/AffordabilityRow',
  component: AffordabilityRow,
  args: {
    check: pending,
    onSelect: () => {},
    onClick: () => {},
    onAction: () => {},
  },
} satisfies Meta<typeof AffordabilityRow>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {}
export const Submitted: Story = { args: { check: submitted } }
export const Approved: Story = { args: { check: approved } }
export const Rejected: Story = { args: { check: rejected } }
export const Expired: Story = { args: { check: expired } }

export const SlaBreached: Story = { args: { check: breached } }
export const AllDocsUploaded: Story = { args: { check: allDocs } }
export const NoDocsUploaded: Story = { args: { check: noDocs } }
export const Selected: Story = { args: { selected: true } }

export const RealisticTable: Story = {
  render: () => (
    <div>
      {[allDocs, pending, submitted, breached, noDocs, expired].map((c) => (
        <AffordabilityRow key={c.id} check={c} onClick={() => {}} onSelect={() => {}} onAction={() => {}} />
      ))}
    </div>
  ),
  args: { check: pending },
}
