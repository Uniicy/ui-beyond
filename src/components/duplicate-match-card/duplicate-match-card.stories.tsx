import type { Meta, StoryObj } from '@storybook/react'
import { DuplicateMatchCard, type DuplicateMatch } from './duplicate-match-card'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const highConf: DuplicateMatch = {
  id: 'dup-001',
  confidence: 0.94,
  detectedAt: hoursAgo(2),
  status: 'pending',
  playerA: { id: 'usr_1a4d', name: 'Thomas Huber', email: 't.huber@example.de', kycStatus: 'approved', createdAt: daysAgo(365), market: 'de' },
  playerB: { id: 'usr_8f2c', name: 'Thomas M. Huber', email: 'th.huber@example.de', kycStatus: 'pending', createdAt: daysAgo(14), market: 'de' },
  signals: [
    { field: 'name', similarity: 0.91, label: 'Name similarity 91%' },
    { field: 'date_of_birth', similarity: 1.0, label: 'Same date of birth' },
    { field: 'device', similarity: 0.95, label: 'Same device fingerprint' },
    { field: 'ip_subnet', similarity: 0.88, label: 'Same IP subnet' },
  ],
}

const medConf: DuplicateMatch = {
  id: 'dup-002',
  confidence: 0.78,
  detectedAt: hoursAgo(8),
  status: 'pending',
  playerA: { id: 'usr_a1b2', name: 'Anna Becker', email: 'anna.b@example.de', kycStatus: 'approved', createdAt: daysAgo(200), market: 'de' },
  playerB: { id: 'usr_c3d4', name: 'A. Becker', email: 'a.becker@example.de', kycStatus: 'unverified', createdAt: daysAgo(3), market: 'de' },
  signals: [
    { field: 'name', similarity: 0.72, label: 'Name similarity 72%' },
    { field: 'email_domain', similarity: 0.85, label: 'Same email domain' },
  ],
}

const lowConf: DuplicateMatch = {
  id: 'dup-003',
  confidence: 0.61,
  detectedAt: daysAgo(1),
  status: 'pending',
  playerA: { id: 'usr_e5f6', name: 'Peter Schmidt', email: 'peter.s@example.de', kycStatus: 'approved', createdAt: daysAgo(400), market: 'de' },
  playerB: { id: 'usr_g7h8', name: 'P. Schmidt', email: 'schmidt.p@example.mu', kycStatus: 'pending', createdAt: daysAgo(10), market: 'mu' },
  signals: [
    { field: 'name', similarity: 0.65, label: 'Name similarity 65%' },
  ],
}

const dismissed: DuplicateMatch = {
  ...medConf,
  id: 'dup-004',
  status: 'dismissed',
}

const confirmed: DuplicateMatch = {
  ...highConf,
  id: 'dup-005',
  status: 'confirmed',
}

const meta = {
  title: 'Components/DuplicateMatchCard',
  component: DuplicateMatchCard,
  args: {
    match: highConf,
    onConfirmMerge: () => {},
    onDismiss: () => {},
  },
} satisfies Meta<typeof DuplicateMatchCard>

export default meta
type Story = StoryObj<typeof meta>

export const HighConfidence: Story = {}

export const MediumConfidence: Story = {
  args: { match: medConf },
}

export const LowConfidence: Story = {
  args: { match: lowConf },
}

export const Dismissed: Story = {
  args: { match: dismissed },
}

export const Confirmed: Story = {
  args: { match: confirmed },
}

export const RealisticPair: Story = {
  args: { match: highConf },
}
