import type { Meta, StoryObj } from '@storybook/react'
import { DuplicatePanel } from './duplicate-panel'
import type { DuplicateMatch } from '../duplicate-match-card'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const matches: DuplicateMatch[] = [
  {
    id: 'dup-001', confidence: 0.94, detectedAt: hoursAgo(2), status: 'pending',
    playerA: { id: 'usr_1a4d', name: 'Thomas Huber', email: 't.huber@example.de', kycStatus: 'approved', createdAt: daysAgo(365), market: 'de' },
    playerB: { id: 'usr_8f2c', name: 'Thomas M. Huber', email: 'th.huber@example.de', kycStatus: 'pending', createdAt: daysAgo(14), market: 'de' },
    signals: [
      { field: 'name', similarity: 0.91, label: 'Name similarity 91%' },
      { field: 'date_of_birth', similarity: 1.0, label: 'Same date of birth' },
      { field: 'device', similarity: 0.95, label: 'Same device fingerprint' },
      { field: 'ip_subnet', similarity: 0.88, label: 'Same IP subnet' },
    ],
  },
  {
    id: 'dup-002', confidence: 0.92, detectedAt: hoursAgo(5), status: 'pending',
    playerA: { id: 'usr_a1b2', name: 'Klaus Wagner', email: 'klaus.w@example.de', kycStatus: 'approved', createdAt: daysAgo(200), market: 'de' },
    playerB: { id: 'usr_c3d4', name: 'K. Wagner', email: 'k.wagner@example.de', kycStatus: 'unverified', createdAt: daysAgo(2), market: 'de' },
    signals: [
      { field: 'name', similarity: 0.88, label: 'Name similarity 88%' },
      { field: 'document', similarity: 0.96, label: 'Same document number' },
      { field: 'ip_subnet', similarity: 0.92, label: 'Same IP subnet' },
    ],
  },
  {
    id: 'dup-003', confidence: 0.78, detectedAt: hoursAgo(12), status: 'pending',
    playerA: { id: 'usr_e5f6', name: 'Anna Becker', email: 'anna.b@example.de', kycStatus: 'approved', createdAt: daysAgo(100), market: 'de' },
    playerB: { id: 'usr_g7h8', name: 'A. Becker', email: 'a.becker@example.de', kycStatus: 'pending', createdAt: daysAgo(5), market: 'de' },
    signals: [
      { field: 'name', similarity: 0.72, label: 'Name similarity 72%' },
      { field: 'email_domain', similarity: 0.85, label: 'Same email domain' },
    ],
  },
  {
    id: 'dup-004', confidence: 0.74, detectedAt: daysAgo(1), status: 'pending',
    playerA: { id: 'usr_i9j0', name: 'Lisa Hoffmann', email: 'lisa.h@example.de', kycStatus: 'approved', createdAt: daysAgo(180), market: 'de' },
    playerB: { id: 'usr_k1l2', name: 'L. Hoffmann', email: 'hoffmann.l@example.mu', kycStatus: 'pending', createdAt: daysAgo(8), market: 'mu' },
    signals: [
      { field: 'name', similarity: 0.75, label: 'Name similarity 75%' },
      { field: 'date_of_birth', similarity: 1.0, label: 'Same date of birth' },
    ],
  },
  {
    id: 'dup-005', confidence: 0.61, detectedAt: daysAgo(3), status: 'pending',
    playerA: { id: 'usr_m3n4', name: 'Peter Schmidt', email: 'peter.s@example.de', kycStatus: 'approved', createdAt: daysAgo(300), market: 'de' },
    playerB: { id: 'usr_o5p6', name: 'P. Schmidt', email: 'schmidt.p@example.mu', kycStatus: 'pending', createdAt: daysAgo(10), market: 'mu' },
    signals: [
      { field: 'name', similarity: 0.65, label: 'Name similarity 65%' },
    ],
  },
]

const allDismissed = matches.map((m) => ({ ...m, status: 'dismissed' as const }))

const afterMerge: DuplicateMatch[] = [
  { ...matches[0]!, status: 'confirmed' },
  ...matches.slice(1),
]

const meta = {
  title: 'Components/DuplicatePanel',
  component: DuplicatePanel,
  args: {
    matches,
    onConfirmMerge: () => {},
    onDismiss: () => {},
    onBack: () => {},
  },
} satisfies Meta<typeof DuplicatePanel>

export default meta
type Story = StoryObj<typeof meta>

export const AllMatches: Story = {}

export const HighConfidenceTab: Story = {
  play: async ({ canvasElement }) => {
    const tabs = canvasElement.querySelectorAll('[role="tab"]')
    const highTab = Array.from(tabs).find((t) => t.textContent?.includes('High'))
    if (highTab instanceof HTMLElement) highTab.click()
  },
}

export const AllDismissed: Story = {
  args: { matches: allDismissed },
}

export const Loading: Story = {
  args: { loading: true, matches: [] },
}

export const AfterMerge: Story = {
  args: { matches: afterMerge },
}
