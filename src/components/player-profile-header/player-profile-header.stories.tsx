import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PlayerProfileHeader } from './player-profile-header'
import type { PlayerHeaderPlayer } from '../player-header'

const verifiedPlayer: PlayerHeaderPlayer = {
  id: 'usr_1a4d',
  externalId: 'user_88291',
  name: 'Thomas Huber',
  email: 'thomas.huber@example.de',
  dateOfBirth: '1988-03-12',
  phone: '+49 170 1234567',
  kycStatus: 'approved',
  amlRiskTier: 'standard',
  rgIsExcluded: false,
  markets: ['de', 'mu'],
  createdAt: '2024-04-15T10:00:00Z',
}

const highRiskPlayer: PlayerHeaderPlayer = {
  id: 'usr_9f2c',
  externalId: 'user_44102',
  name: 'Klaus Wagner',
  email: 'klaus.w@example.de',
  dateOfBirth: '1975-08-22',
  kycStatus: 'manual_review',
  amlRiskTier: 'high_risk',
  rgIsExcluded: true,
  markets: ['de'],
  createdAt: '2023-11-01T08:00:00Z',
}

const defaultTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'kyc', label: 'KYC' },
  { value: 'aml', label: 'AML' },
  { value: 'rg', label: 'RG' },
  { value: 'payments', label: 'Payments' },
  { value: 'timeline', label: 'Timeline' },
]

const badgeTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'kyc', label: 'KYC', badge: 1 },
  { value: 'aml', label: 'AML', badge: 2 },
  { value: 'rg', label: 'RG' },
  { value: 'payments', label: 'Payments' },
  { value: 'timeline', label: 'Timeline' },
]

const meta = {
  title: 'Components/PlayerProfileHeader',
  component: PlayerProfileHeader,
  args: {
    player: verifiedPlayer,
    tabs: defaultTabs,
    activeTab: 'overview',
    onTabChange: () => {},
    onNewVerification: () => {},
    onFlagPlayer: () => {},
  },
} satisfies Meta<typeof PlayerProfileHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBadges: Story = {
  args: { tabs: badgeTabs },
}

export const HighRisk: Story = {
  args: { player: highRiskPlayer },
}

export const Interactive: Story = {
  args: { tabs: badgeTabs },
  render: (args) => {
    const [tab, setTab] = useState(args.activeTab)
    return (
      <PlayerProfileHeader {...args} activeTab={tab} onTabChange={setTab} />
    )
  },
}

export const Scrolled: Story = {
  args: { tabs: badgeTabs },
  render: (args) => {
    const [tab, setTab] = useState(args.activeTab)
    return (
      <div style={{ height: '200vh' }}>
        <div style={{ height: 64, background: 'var(--ub-color-surface)', borderBottom: '0.5px solid var(--ub-ghost-border)', display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: 'var(--ub-font-body)', fontSize: 15, fontWeight: 500, color: 'var(--ub-color-on-surface)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
          Admin Top Nav placeholder
        </div>
        <div style={{ paddingTop: 64 }}>
          <PlayerProfileHeader {...args} activeTab={tab} onTabChange={setTab} />
          <div style={{ padding: '24px 32px' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{ height: 60, marginBottom: 12, borderRadius: 8, background: 'var(--ub-color-surface-container-low)', display: 'flex', alignItems: 'center', paddingLeft: 16, fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
                Content row {i + 1} — scroll to see sticky header
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  parameters: { layout: 'fullscreen' },
}
