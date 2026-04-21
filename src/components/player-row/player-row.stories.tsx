import type { Meta, StoryObj } from '@storybook/react'
import { PlayerRow, type PlayerListItem } from './player-row'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const verified: PlayerListItem = {
  id: 'usr_1a4d', name: 'Thomas Huber', email: 't.huber@example.de', externalId: 'user_88291',
  kycStatus: 'approved', amlRiskTier: 'standard', amlRiskScore: 22,
  rgIsExcluded: false, hasNearLimitWarning: false,
  markets: ['de'], lastActivityAt: hoursAgo(2), createdAt: daysAgo(365),
}

const highRisk: PlayerListItem = {
  id: 'usr_9f2c', name: 'Klaus Wagner', email: 'klaus.w@example.de', externalId: 'user_44102',
  kycStatus: 'approved', amlRiskTier: 'high_risk', amlRiskScore: 88,
  rgIsExcluded: true, hasNearLimitWarning: false,
  markets: ['de', 'mu'], lastActivityAt: hoursAgo(5), createdAt: daysAgo(180),
}

const unverified: PlayerListItem = {
  id: 'usr_b3e1', name: 'Priya Ramgoolam', email: 'priya.r@example.mu', externalId: 'user_77201',
  kycStatus: 'unverified', amlRiskTier: 'standard', amlRiskScore: 10,
  rgIsExcluded: false, hasNearLimitWarning: false,
  markets: ['mu'], lastActivityAt: hoursAgo(0.5), createdAt: hoursAgo(12),
}

const blocked: PlayerListItem = {
  id: 'usr_d4f0', name: 'Stefan Koch', email: 'stefan.k@example.de', externalId: 'user_55008',
  kycStatus: 'blocked', amlRiskTier: 'high_risk', amlRiskScore: 95,
  rgIsExcluded: true, hasNearLimitWarning: false,
  markets: ['de'], lastActivityAt: daysAgo(14), createdAt: daysAgo(400),
}

const nearLimit: PlayerListItem = {
  id: 'usr_e5g1', name: 'Anna Fischer', email: 'anna.f@example.de', externalId: 'user_66119',
  kycStatus: 'approved', amlRiskTier: 'enhanced', amlRiskScore: 55,
  rgIsExcluded: false, hasNearLimitWarning: true,
  markets: ['de'], lastActivityAt: hoursAgo(1), createdAt: daysAgo(90),
}

const allPlayers: PlayerListItem[] = [
  verified,
  highRisk,
  { id: 'usr_f6h2', name: 'Lisa Hoffmann', email: 'lisa.h@example.de', externalId: 'user_11234', kycStatus: 'approved', amlRiskTier: 'standard', amlRiskScore: 18, rgIsExcluded: false, hasNearLimitWarning: false, markets: ['de'], lastActivityAt: hoursAgo(3), createdAt: daysAgo(200) },
  nearLimit,
  unverified,
  { id: 'usr_g7i3', name: 'Jan de Vries', email: 'jan.dv@example.nl', externalId: 'user_22345', kycStatus: 'pending', amlRiskTier: 'standard', amlRiskScore: 15, rgIsExcluded: false, hasNearLimitWarning: false, markets: ['nl'], lastActivityAt: hoursAgo(6), createdAt: daysAgo(5) },
  blocked,
  { id: 'usr_h8j4', name: 'Markus Weber', email: 'markus.w@example.de', externalId: 'user_33456', kycStatus: 'approved', amlRiskTier: 'enhanced', amlRiskScore: 62, rgIsExcluded: false, hasNearLimitWarning: false, markets: ['de', 'mu'], lastActivityAt: daysAgo(1), createdAt: daysAgo(150) },
]

const meta = {
  title: 'Components/PlayerRow',
  component: PlayerRow,
  args: {
    player: verified,
    onSelect: () => {},
    onClick: () => {},
    onAction: () => {},
  },
} satisfies Meta<typeof PlayerRow>

export default meta
type Story = StoryObj<typeof meta>

export const Verified: Story = {}

export const HighRiskExcluded: Story = {
  args: { player: highRisk },
}

export const Unverified: Story = {
  args: { player: unverified },
}

export const Blocked: Story = {
  args: { player: blocked },
}

export const NearLimit: Story = {
  args: { player: nearLimit },
}

export const Selected: Story = {
  args: { selected: true },
}

export const ActionMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('[aria-label="Actions"]') as HTMLButtonElement | null
    btn?.click()
  },
}

export const RealisticTable: Story = {
  render: () => (
    <div>
      {allPlayers.map((p) => (
        <PlayerRow key={p.id} player={p} onClick={() => {}} onSelect={() => {}} onAction={() => {}} />
      ))}
    </div>
  ),
  args: { player: verified },
}
