import type { Meta, StoryObj } from '@storybook/react'
import { BulkActionBar } from './bulk-action-bar'

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
  { id: 'a-3', name: 'Lisa Hoffmann' },
]

const meta = {
  title: 'Components/BulkActionBar',
  component: BulkActionBar,
  argTypes: {
    selectedCount: { control: 'number' },
    visible: { control: 'boolean' },
  },
  args: {
    selectedCount: 3,
    agents,
    visible: true,
    onAssignToMe: () => {},
    onAssignTo: () => {},
    onExport: () => {},
    onClearSelection: () => {},
  },
} satisfies Meta<typeof BulkActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {}

export const Hidden: Story = {
  args: { visible: false },
}

export const SingleSelected: Story = {
  args: { selectedCount: 1 },
}

export const ManySelected: Story = {
  args: { selectedCount: 50 },
}
