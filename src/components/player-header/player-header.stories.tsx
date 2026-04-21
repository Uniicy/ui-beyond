import type { Meta, StoryObj } from '@storybook/react'
import { PlayerHeader, type PlayerHeaderPlayer } from './player-header'

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

const newPlayer: PlayerHeaderPlayer = {
  id: 'usr_e81b',
  externalId: 'user_99410',
  name: 'Lisa Hoffmann',
  email: 'lisa.h@example.de',
  dateOfBirth: '1996-01-30',
  kycStatus: 'pending',
  amlRiskTier: 'standard',
  rgIsExcluded: false,
  markets: ['de'],
  createdAt: '2026-04-10T14:00:00Z',
}

const meta = {
  title: 'Components/PlayerHeader',
  component: PlayerHeader,
  args: {
    player: verifiedPlayer,
    onNewVerification: () => {},
    onFlagPlayer: () => {},
    onMoreActions: () => {},
  },
} satisfies Meta<typeof PlayerHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Verified: Story = {}

export const HighRiskExcluded: Story = {
  args: { player: highRiskPlayer },
}

export const NewUnverified: Story = {
  args: { player: newPlayer },
}

export const CopyId: Story = {
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button')
    const copyBtn = Array.from(buttons).find((b) => b.getAttribute('aria-label')?.includes('Copy'))
    copyBtn?.click()
  },
}
