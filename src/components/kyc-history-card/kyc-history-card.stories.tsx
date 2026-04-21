import type { Meta, StoryObj } from '@storybook/react'
import { KycHistoryCard, type KycVerification } from './kyc-history-card'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function minutesFromNow(m: number): string { return new Date(Date.now() + m * 60_000).toISOString() }
function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }

const approved: KycVerification = {
  id: 'kyc-003',
  attemptNumber: 3,
  status: 'approved',
  documentType: 'passport',
  provider: 'onfido',
  submittedAt: daysAgo(1),
  resolvedAt: hoursAgo(20),
  confidence: 0.96,
}

const rejected: KycVerification = {
  id: 'kyc-002',
  attemptNumber: 2,
  status: 'rejected',
  documentType: 'id_card',
  provider: 'jumio',
  submittedAt: daysAgo(3),
  resolvedAt: daysAgo(2.5),
  rejectionReason: 'Image quality too low \u2014 document partially obscured, unable to read MRZ zone.',
}

const manualReview: KycVerification = {
  id: 'kyc-004',
  attemptNumber: 4,
  status: 'manual_review',
  documentType: 'passport',
  provider: 'onfido',
  submittedAt: hoursAgo(1.5),
  slaCreatedAt: hoursAgo(1.5),
  slaDeadline: minutesFromNow(12),
}

const pending: KycVerification = {
  id: 'kyc-005',
  attemptNumber: 1,
  status: 'pending',
  documentType: 'driving_licence',
  provider: 'manual',
  submittedAt: hoursAgo(0.5),
  slaCreatedAt: hoursAgo(0.5),
  slaDeadline: hoursFromNow(5.5),
}

const expired: KycVerification = {
  id: 'kyc-001',
  attemptNumber: 1,
  status: 'expired',
  documentType: 'passport',
  provider: 'onfido',
  submittedAt: daysAgo(7),
}

const meta = {
  title: 'Components/KycHistoryCard',
  component: KycHistoryCard,
  args: {
    verification: approved,
    isLatest: true,
  },
} satisfies Meta<typeof KycHistoryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Approved: Story = {}

export const Rejected: Story = {
  args: { verification: rejected, isLatest: false },
}

export const ManualReview: Story = {
  args: { verification: manualReview, isLatest: true },
}

export const Pending: Story = {
  args: { verification: pending, isLatest: true },
}

export const Expired: Story = {
  args: { verification: expired, isLatest: false },
}

export const PlayerHistory: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 480 }}>
      <KycHistoryCard verification={approved} isLatest />
      <KycHistoryCard verification={{ ...rejected, attemptNumber: 2 }} />
      <KycHistoryCard verification={{ ...expired, attemptNumber: 1 }} />
    </div>
  ),
  args: { verification: approved },
}
