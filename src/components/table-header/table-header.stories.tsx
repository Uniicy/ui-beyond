import type { Meta, StoryObj } from '@storybook/react'
import { TableHeader, type TableColumn } from './table-header'

const columns: TableColumn[] = [
  { key: 'player', label: 'Player', width: '200px', sortable: true },
  { key: 'status', label: 'Status', width: '110px', sortable: true },
  { key: 'document', label: 'Document', width: '110px' },
  { key: 'provider', label: 'Provider', width: '90px' },
  { key: 'sla', label: 'SLA', width: '130px', sortable: true },
  { key: 'agent', label: 'Agent', width: '80px' },
  { key: 'market', label: 'Market', width: '60px' },
  { key: 'actions', label: '', width: '40px' },
]

const meta = {
  title: 'Components/TableHeader',
  component: TableHeader,
  args: {
    columns,
  },
} satisfies Meta<typeof TableHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSort: Story = {
  args: { sortKey: 'sla', sortDir: 'desc', onSort: () => {} },
}

export const Selectable: Story = {
  args: { selectable: true, selectState: 'none', onSelectAll: () => {} },
}

export const SelectableSome: Story = {
  args: { selectable: true, selectState: 'some', onSelectAll: () => {} },
}

export const SelectableAll: Story = {
  args: { selectable: true, selectState: 'all', onSelectAll: () => {} },
}
