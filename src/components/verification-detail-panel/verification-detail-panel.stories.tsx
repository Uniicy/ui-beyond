import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { VerificationDetailPanel } from './verification-detail-panel'
import { Button } from '../button'
import type { Verification } from '../verification-row'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}
function minutesFromNow(m: number): string {
  return new Date(Date.now() + m * 60_000).toISOString()
}
function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3_600_000).toISOString()
}

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const pendingVerification: Verification = {
  id: 'V-001',
  player: { id: 'P-1842', name: 'Thomas Huber', email: 'thomas.huber@example.de' },
  status: 'pending',
  documentType: 'passport',
  provider: 'onfido',
  slaCreatedAt: hoursAgo(2),
  slaDeadline: hoursFromNow(4),
  market: 'de',
}

const manualReviewVerification: Verification = {
  id: 'V-002',
  player: { id: 'P-2291', name: 'Jan de Vries', email: 'jan.devries@example.nl' },
  status: 'manual_review',
  documentType: 'id_card',
  provider: 'jumio',
  slaCreatedAt: hoursAgo(1.5),
  slaDeadline: minutesFromNow(12),
  slaPaused: true,
  assignedAgent: { name: 'Sarah Klein', id: 'a-1' },
  market: 'nl',
}

const meta = {
  title: 'Components/VerificationDetailPanel',
  component: VerificationDetailPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    verification: pendingVerification,
    agents,
    open: false,
    onClose: () => {},
    onApprove: () => {},
    onReject: () => {},
    onRequestInfo: () => {},
    onAssign: () => {},
  },
} satisfies Meta<typeof VerificationDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open pending verification</Button>
        <VerificationDetailPanel {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const ManualReview: Story = {
  args: { verification: manualReviewVerification },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open manual review</Button>
        <VerificationDetailPanel {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: { open: true, verification: pendingVerification },
}
