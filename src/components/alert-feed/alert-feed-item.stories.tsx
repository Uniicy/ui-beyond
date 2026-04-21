import type { Meta, StoryObj } from '@storybook/react'
import { AlertFeedItem } from './alert-feed-item'

const meta = {
  title: 'Components/AlertFeedItem',
  component: AlertFeedItem,
  argTypes: {
    type: {
      control: 'select',
      options: ['kyc_approved', 'kyc_rejected', 'kyc_manual', 'aml_alert', 'exclusion_applied', 'lugas_failure', 'oasis_hit', 'player_created'],
    },
    severity: {
      control: 'select',
      options: ['high', 'medium', 'low'],
    },
    playerName: { control: 'text' },
    playerId: { control: 'text' },
    description: { control: 'text' },
    timestamp: { control: 'text' },
  },
  args: {
    type: 'kyc_approved',
    playerName: 'Max Mustermann',
    description: 'Document verification completed successfully',
    timestamp: '2 min ago',
  },
} satisfies Meta<typeof AlertFeedItem>

export default meta
type Story = StoryObj<typeof meta>

export const KycApproved: Story = {
  args: {
    type: 'kyc_approved',
    playerName: 'Max Mustermann',
    description: 'Document verification completed successfully',
    timestamp: '2 min ago',
  },
}

export const KycRejected: Story = {
  args: {
    type: 'kyc_rejected',
    playerName: 'Jan de Vries',
    description: 'ID document expired \u00b7 Passport NL',
    timestamp: '5 min ago',
    severity: 'medium',
  },
}

export const KycManual: Story = {
  args: {
    type: 'kyc_manual',
    playerName: 'Sarah Schmidt',
    description: 'Address proof requires manual review \u00b7 Utility bill',
    timestamp: '8 min ago',
  },
}

export const AmlAlertHigh: Story = {
  args: {
    type: 'aml_alert',
    playerName: 'Thomas M\u00fcller',
    description: 'Rapid deposit sequence \u00b7 3\u00d7 Trustly \u00b7 \u20ac600 in 10 min',
    timestamp: '1 min ago',
    severity: 'high',
  },
}

export const AmlAlertMedium: Story = {
  args: {
    type: 'aml_alert',
    playerName: 'Anna Bakker',
    description: 'Unusual withdrawal pattern detected',
    timestamp: '12 min ago',
    severity: 'medium',
  },
}

export const ExclusionApplied: Story = {
  args: {
    type: 'exclusion_applied',
    playerName: 'Peter Fischer',
    description: 'Self-exclusion 6 months \u00b7 Player-initiated',
    timestamp: '15 min ago',
  },
}

export const LugasFailure: Story = {
  args: {
    type: 'lugas_failure',
    description: 'LUGAS sync failed \u00b7 Timeout after 30s \u00b7 Retry scheduled',
    timestamp: '3 min ago',
    severity: 'high',
  },
}

export const OasisHit: Story = {
  args: {
    type: 'oasis_hit',
    playerName: 'Klaus Weber',
    description: 'OASIS match found \u00b7 National exclusion register',
    timestamp: '20 min ago',
    severity: 'high',
  },
}

export const PlayerCreated: Story = {
  args: {
    type: 'player_created',
    playerName: 'Lisa Hoffmann',
    description: 'New registration \u00b7 DE market \u00b7 KYC pending',
    timestamp: '30 sec ago',
  },
}

export const Clickable: Story = {
  args: {
    type: 'aml_alert',
    playerName: 'Thomas M\u00fcller',
    description: 'Rapid deposit sequence \u00b7 3\u00d7 Trustly \u00b7 \u20ac600 in 10 min',
    timestamp: '1 min ago',
    severity: 'high',
    onClick: () => {},
  },
}
