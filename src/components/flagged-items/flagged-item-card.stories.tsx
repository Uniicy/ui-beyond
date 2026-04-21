import type { Meta, StoryObj } from '@storybook/react'
import { FlaggedItemCard } from './flagged-item-card'

const meta = {
  title: 'Components/FlaggedItemCard',
  component: FlaggedItemCard,
  argTypes: {
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info'],
    },
    category: { control: 'text' },
    count: { control: 'number' },
    detail: { control: 'text' },
  },
  args: {
    category: 'KYC SLA breaches',
    count: 6,
    severity: 'error',
  },
} satisfies Meta<typeof FlaggedItemCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    category: 'KYC SLA breaches',
    count: 6,
    severity: 'error',
    detail: 'Oldest: 2h 14m overdue',
    cta: { label: 'Review queue \u2192', onClick: () => {} },
  },
}

export const Error: Story = {
  args: {
    category: 'KYC SLA breaches',
    count: 6,
    severity: 'error',
    detail: 'Oldest: 2h 14m overdue',
  },
}

export const Warning: Story = {
  args: {
    category: 'LUGAS sync failures',
    count: 2,
    severity: 'warning',
    detail: 'Last failure: 12 min ago',
  },
}

export const Info: Story = {
  args: {
    category: 'Pending document reviews',
    count: 14,
    severity: 'info',
    detail: 'Average wait: 35 min',
  },
}

export const WithCta: Story = {
  args: {
    category: 'KYC SLA breaches',
    count: 6,
    severity: 'error',
    detail: 'Oldest: 2h 14m overdue',
    cta: { label: 'Review queue \u2192', onClick: () => {} },
  },
}
