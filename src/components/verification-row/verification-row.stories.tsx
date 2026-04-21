import type { Meta, StoryObj } from '@storybook/react'
import { VerificationRow, type Verification } from './verification-row'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}
function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString()
}
function minutesFromNow(m: number): string {
  return new Date(Date.now() + m * 60_000).toISOString()
}

const base: Verification = {
  id: 'v-001',
  player: { id: 'p-001', name: 'Thomas Huber', email: 'thomas.huber@example.de' },
  status: 'pending',
  documentType: 'passport',
  provider: 'onfido',
  slaCreatedAt: hoursAgo(2),
  slaDeadline: hoursFromNow(4),
  market: 'de',
}

const meta = {
  title: 'Components/VerificationRow',
  component: VerificationRow,
  args: {
    verification: base,
    onSelect: () => {},
    onClick: () => {},
    onActionMenu: () => {},
  },
} satisfies Meta<typeof VerificationRow>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: { verification: { ...base, status: 'pending' } },
}

export const ManualReview: Story = {
  args: {
    verification: {
      ...base,
      id: 'v-002',
      status: 'manual_review',
      provider: 'jumio',
      slaCreatedAt: hoursAgo(1.5),
      slaDeadline: minutesFromNow(12),
      slaPaused: true,
      assignedAgent: { name: 'Sarah Klein', id: 'a-001' },
    },
  },
}

export const Rejected: Story = {
  args: {
    verification: {
      ...base,
      id: 'v-003',
      status: 'rejected',
      documentType: 'id_card',
      provider: 'onfido',
      player: { id: 'p-003', name: 'Jan de Vries', email: 'jan.devries@example.nl' },
      market: 'nl',
    },
  },
}

export const Approved: Story = {
  args: {
    verification: {
      ...base,
      id: 'v-004',
      status: 'approved',
      player: { id: 'p-004', name: 'Lisa Hoffmann', email: 'lisa.h@example.de' },
      assignedAgent: { name: 'Max Mustermann', id: 'a-002' },
    },
  },
}

export const Expired: Story = {
  args: {
    verification: {
      ...base,
      id: 'v-005',
      status: 'expired',
      documentType: 'driving_licence',
      provider: 'manual',
      player: { id: 'p-005', name: 'Peter Fischer', email: 'peter.f@example.mu' },
      market: 'mu',
    },
  },
}

export const Selected: Story = {
  args: {
    verification: base,
    selected: true,
  },
}

export const SlaBreached: Story = {
  args: {
    verification: {
      ...base,
      id: 'v-006',
      status: 'manual_review',
      slaCreatedAt: hoursAgo(6),
      slaDeadline: hoursAgo(2),
      assignedAgent: { name: 'Sarah Klein', id: 'a-001' },
    },
  },
}

export const Unassigned: Story = {
  args: {
    verification: {
      ...base,
      assignedAgent: undefined,
    },
  },
}

export const WithAssignedAgent: Story = {
  args: {
    verification: {
      ...base,
      assignedAgent: { name: 'Sarah Klein', id: 'a-001' },
    },
  },
}

export const RealisticRow: Story = {
  args: {
    verification: {
      id: 'v-100',
      player: { id: 'p-100', name: 'Thomas Huber', email: 'thomas.huber@example.de' },
      status: 'manual_review',
      documentType: 'passport',
      provider: 'onfido',
      slaCreatedAt: hoursAgo(1.5),
      slaDeadline: minutesFromNow(12),
      assignedAgent: { name: 'Sarah Klein', id: 'a-001' },
      market: 'de',
    },
  },
}
