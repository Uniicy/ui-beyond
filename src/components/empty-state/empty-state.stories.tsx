import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './empty-state'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    variant: { control: 'select', options: ['no-results', 'no-data', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    variant: 'no-results',
    title: 'No results found',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    title: 'No results found',
    description: 'Try adjusting your filters or search terms.',
    action: { label: 'Clear filters', onClick: () => {} },
  },
}

export const NoData: Story = {
  args: {
    variant: 'no-data',
    title: 'No verifications yet',
    description: 'New KYC verifications will appear here as players register.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Something went wrong',
    description: 'We couldn\u2019t load the verification queue. Please try again.',
    action: { label: 'Retry', onClick: () => {} },
  },
}
