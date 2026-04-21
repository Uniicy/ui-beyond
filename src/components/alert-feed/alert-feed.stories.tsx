import type { Meta, StoryObj } from '@storybook/react'
import { AlertFeed } from './alert-feed'

const realisticItems = [
  {
    type: 'aml_alert' as const,
    playerName: 'Thomas M\u00fcller',
    description: 'Rapid deposit sequence \u00b7 3\u00d7 Trustly \u00b7 \u20ac600 in 10 min',
    timestamp: '1 min ago',
    severity: 'high' as const,
  },
  {
    type: 'kyc_approved' as const,
    playerName: 'Max Mustermann',
    description: 'Document verification completed successfully',
    timestamp: '2 min ago',
  },
  {
    type: 'oasis_hit' as const,
    playerName: 'Klaus Weber',
    description: 'OASIS match found \u00b7 National exclusion register',
    timestamp: '5 min ago',
    severity: 'high' as const,
  },
  {
    type: 'player_created' as const,
    playerName: 'Lisa Hoffmann',
    description: 'New registration \u00b7 DE market \u00b7 KYC pending',
    timestamp: '8 min ago',
  },
  {
    type: 'kyc_manual' as const,
    playerName: 'Sarah Schmidt',
    description: 'Address proof requires manual review \u00b7 Utility bill',
    timestamp: '12 min ago',
  },
  {
    type: 'lugas_failure' as const,
    description: 'LUGAS sync failed \u00b7 Timeout after 30s \u00b7 Retry scheduled',
    timestamp: '15 min ago',
    severity: 'medium' as const,
  },
  {
    type: 'exclusion_applied' as const,
    playerName: 'Peter Fischer',
    description: 'Self-exclusion 6 months \u00b7 Player-initiated',
    timestamp: '22 min ago',
  },
  {
    type: 'kyc_rejected' as const,
    playerName: 'Jan de Vries',
    description: 'ID document expired \u00b7 Passport NL',
    timestamp: '30 min ago',
    severity: 'medium' as const,
  },
]

const meta = {
  title: 'Components/AlertFeed',
  component: AlertFeed,
  argTypes: {
    title: { control: 'text' },
    maxItems: { control: 'number' },
  },
  args: {
    title: 'Recent activity',
    items: realisticItems,
    maxItems: 5,
  },
} satisfies Meta<typeof AlertFeed>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {
  args: {
    items: realisticItems,
    maxItems: 5,
    onViewAll: () => {},
  },
}

export const AllVisible: Story = {
  args: {
    items: realisticItems,
    maxItems: 10,
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}
