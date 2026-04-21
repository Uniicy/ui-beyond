import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'
import type { TableColumn } from '../table-header'

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

const fakeRow = (text: string, i: number) => (
  <div
    key={i}
    style={{
      display: 'grid',
      gridTemplateColumns: '40px 200px 110px 110px 90px 130px 80px 60px 40px',
      alignItems: 'center',
      height: 52,
      padding: '6px 0',
      borderBottom: '0.5px solid rgba(198,198,205,0.15)',
      fontFamily: 'var(--ub-font-body)',
      fontSize: 13,
      color: 'var(--ub-color-on-surface)',
    }}
  >
    <div />
    <div style={{ padding: '0 6px' }}>{text}</div>
    <div style={{ padding: '0 6px', fontSize: 11, color: 'var(--ub-color-on-surface-variant)' }}>Pending</div>
    <div style={{ padding: '0 6px', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Passport</div>
    <div style={{ padding: '0 6px', fontSize: 11 }}>Onfido</div>
    <div style={{ padding: '0 6px', fontSize: 10, color: 'var(--ub-color-on-surface-variant)' }}>3h 22m</div>
    <div style={{ padding: '0 6px', fontSize: 10 }}>SK</div>
    <div style={{ padding: '0 6px', fontSize: 10 }}>DE</div>
    <div style={{ padding: '0 6px' }}>{'\u00B7\u00B7\u00B7'}</div>
  </div>
)

const agents = [
  { id: 'a-1', name: 'Sarah Klein' },
  { id: 'a-2', name: 'Max Mustermann' },
]

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  args: {
    columns,
    rows: [
      fakeRow('Thomas Huber', 0),
      fakeRow('Jan de Vries', 1),
      fakeRow('Lisa Hoffmann', 2),
    ],
    selectable: true,
    onSelectAll: () => {},
    onSort: () => {},
    page: 1,
    pageSize: 25,
    total: 47,
    onPageChange: () => {},
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Populated: Story = {}

export const Loading: Story = {
  args: { loading: true, rows: [] },
}

export const Empty: Story = {
  args: {
    empty: true,
    rows: [],
    emptyProps: {
      variant: 'no-results',
      title: 'No verifications match your filters',
      description: 'Try adjusting the status filter or search query.',
      action: { label: 'Clear filters', onClick: () => {} },
    },
  },
}

export const Sorted: Story = {
  args: { sortKey: 'sla', sortDir: 'asc' },
}

export const BulkSelection: Story = {
  args: {
    selectedIds: ['v-001', 'v-002', 'v-003'],
    bulkActions: {
      selectedCount: 3,
      agents,
      visible: true,
      onAssignToMe: () => {},
      onAssignTo: () => {},
      onExport: () => {},
      onClearSelection: () => {},
    },
  },
}
