import type { Meta, StoryObj } from '@storybook/react'
import { FlaggedItemsPanel } from './flagged-items-panel'

const meta = {
  title: 'Components/FlaggedItemsPanel',
  component: FlaggedItemsPanel,
  args: {
    title: 'Flagged items',
    items: [
      {
        category: 'KYC SLA breaches',
        count: 6,
        severity: 'error',
        detail: 'Oldest: 2h 14m overdue',
        cta: { label: 'Review queue \u2192', onClick: () => {} },
      },
      {
        category: 'LUGAS sync failures',
        count: 2,
        severity: 'warning',
        detail: 'Last failure: 12 min ago',
      },
      {
        category: 'Pending document reviews',
        count: 14,
        severity: 'info',
        detail: 'Average wait: 35 min',
      },
    ],
  },
} satisfies Meta<typeof FlaggedItemsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {}
