import type { Meta, StoryObj } from '@storybook/react'
import { FilterChip } from './filter-chip'

const meta = {
  title: 'Components/FilterChip',
  component: FilterChip,
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'primary'] },
  },
  args: {
    label: 'Provider: Onfido',
    onRemove: () => {},
  },
} satisfies Meta<typeof FilterChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Primary: Story = {
  args: { variant: 'primary', label: 'Status: Pending' },
}

export const MultipleChips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      <FilterChip label="Provider: Onfido" onRemove={() => {}} />
      <FilterChip label="Market: DE" onRemove={() => {}} />
      <FilterChip label="Date: 01 Apr \u2013 13 Apr" onRemove={() => {}} />
    </div>
  ),
}
