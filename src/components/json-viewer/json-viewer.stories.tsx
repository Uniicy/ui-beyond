import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'
import { JsonViewer } from './json-viewer'

const meta = {
  title: 'Components/JsonViewer',
  component: JsonViewer,
  argTypes: {
    initialDepth: { control: 'number' },
    searchable: { control: 'boolean' },
    copyable: { control: 'boolean' },
    maxHeight: { control: 'text' },
    theme: { control: 'select', options: ['dark', 'light'] },
  },
  args: {
    theme: 'dark',
    initialDepth: 2,
    copyable: true,
    searchable: false,
  },
  decorators: [
    (Story, context) => (
      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          background: context.args.theme === 'light'
            ? 'var(--ub-color-surface)'
            : 'var(--ub-color-surface-container)',
          minWidth: 480,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JsonViewer>

export default meta
type Story = StoryObj<typeof meta>

/* ── Data fixtures ── */

const simpleObject = {
  id: 'usr_01J3X',
  name: 'Max Mustermann',
  verified: true,
  riskScore: 42,
  lastLogin: '2026-04-12T09:15:00Z',
}

const auditEventPayload = {
  eventId: 'evt_98a2f',
  type: 'player.limit_change',
  timestamp: '2026-04-13T14:22:31Z',
  actor: {
    id: 'admin_007',
    role: 'compliance_officer',
    ip: '10.0.12.44',
  },
  target: {
    playerId: 'usr_01J3X',
    market: 'DE',
    changes: {
      depositLimit: {
        previous: 1000,
        current: 500,
        currency: 'EUR',
      },
      reason: 'RG intervention — self-exclusion request',
    },
  },
  metadata: {
    correlationId: 'corr_x7f3',
    source: 'admin-ui',
    version: 3,
    flags: ['rg_triggered', 'auto_approved'],
    reviewed: false,
    notes: null,
  },
}

const transactionsList = [
  { txId: 'tx_001', amount: 25.0, currency: 'EUR', type: 'deposit', status: 'completed' },
  { txId: 'tx_002', amount: 100.0, currency: 'EUR', type: 'withdrawal', status: 'pending' },
  { txId: 'tx_003', amount: 10.5, currency: 'EUR', type: 'deposit', status: 'failed' },
]

const allTypesObject = {
  aString: 'hello world',
  aNumber: 3.14159,
  anInteger: 42,
  aBoolean: true,
  aFalse: false,
  aNull: null,
  anArray: [1, 'two', false, null],
  anObject: {
    nested: true,
    deep: {
      value: 'found it',
    },
  },
}

/* ── Stories ── */

export const SimpleObject: Story = {
  args: { data: simpleObject },
}

export const NestedAuditEvent: Story = {
  args: { data: auditEventPayload },
}

export const ArrayOfObjects: Story = {
  args: { data: transactionsList },
}

export const CollapsedAtDepth1: Story = {
  args: { data: auditEventPayload, initialDepth: 1 },
}

export const SearchableWithFilter: Story = {
  args: { data: auditEventPayload, searchable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Filter keys…')
    await userEvent.type(input, 'player', { delay: 80 })
  },
}

export const AllTypes: Story = {
  args: { data: allTypesObject },
}

export const MaxHeightScroll: Story = {
  args: { data: auditEventPayload, maxHeight: '300px', initialDepth: 4 },
}

export const LightTheme: Story = {
  args: { data: auditEventPayload, theme: 'light' },
}

export const CopyPathInteraction: Story = {
  args: { data: auditEventPayload, initialDepth: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByText('depositLimit')
    await userEvent.hover(row)
  },
}
