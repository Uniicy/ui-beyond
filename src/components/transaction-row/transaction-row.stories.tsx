import type { Meta, StoryObj } from '@storybook/react'
import { TransactionRow, type TransactionEntry } from './transaction-row'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }

const completedDeposit: TransactionEntry = {
  id: 'tx-001', occurredAt: minutesAgo(5), type: 'deposit',
  player: { id: 'p1', name: 'Thomas Huber' }, amount: 20000, currency: 'EUR',
  provider: 'trustly', providerRef: 'TRS-88291-A',
  status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' },
}

const heldWithdrawal: TransactionEntry = {
  id: 'tx-002', occurredAt: minutesAgo(12), type: 'withdrawal',
  player: { id: 'p2', name: 'Anna Fischer' }, amount: 150000, currency: 'EUR',
  provider: 'nuvei', providerRef: 'NUV-44102-B',
  status: 'held', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'warn' },
}

const failedLimit: TransactionEntry = {
  id: 'tx-003', occurredAt: minutesAgo(20), type: 'deposit',
  player: { id: 'p3', name: 'Klaus Wagner' }, amount: 50000, currency: 'EUR',
  provider: 'trustly', providerRef: 'TRS-55008-C',
  status: 'rejected', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'fail' },
}

const noOasis: TransactionEntry = {
  id: 'tx-004', occurredAt: hoursAgo(1), type: 'withdrawal',
  player: { id: 'p4', name: 'Priya Ramgoolam' }, amount: 8000, currency: 'MUR',
  provider: 'mcb_juice', providerRef: 'MCB-77201-D',
  status: 'completed', complianceChecks: { kyc: 'pass', limit: 'pass' },
}

const pending: TransactionEntry = {
  id: 'tx-005', occurredAt: minutesAgo(2), type: 'deposit',
  player: { id: 'p5', name: 'Lisa Bauer' }, amount: 10000, currency: 'EUR',
  provider: 'paysafe', providerRef: 'PSF-66119-E',
  status: 'pending', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' },
}

const allRows: TransactionEntry[] = [
  completedDeposit,
  { id: 'tx-m1', occurredAt: minutesAgo(8), type: 'deposit', player: { id: 'p6', name: 'Markus Weber' }, amount: 5000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-33456-F', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  heldWithdrawal,
  { id: 'tx-m2', occurredAt: minutesAgo(15), type: 'deposit', player: { id: 'p7', name: 'Julia Richter' }, amount: 20000, currency: 'EUR', provider: 'zimpler', providerRef: 'ZMP-11234-G', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  failedLimit,
  { id: 'tx-m3', occurredAt: minutesAgo(25), type: 'withdrawal', player: { id: 'p8', name: 'Stefan Koch' }, amount: 3000, currency: 'EUR', provider: 'nuvei', providerRef: 'NUV-22345-H', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-m4', occurredAt: minutesAgo(30), type: 'deposit', player: { id: 'p9', name: 'Claudia Schulz' }, amount: 15000, currency: 'EUR', provider: 'paypal', providerRef: 'PPL-99410-I', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
  { id: 'tx-m5', occurredAt: hoursAgo(1), type: 'deposit', player: { id: 'p10', name: 'Frank M\u00fcller' }, amount: 8000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-88932-J', status: 'completed', complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' } },
]

const meta = {
  title: 'Components/TransactionRow',
  component: TransactionRow,
  args: { tx: completedDeposit, onClick: () => {}, onAction: () => {} },
} satisfies Meta<typeof TransactionRow>

export default meta
type Story = StoryObj<typeof meta>

export const CompletedDeposit: Story = {}
export const HeldWithdrawal: Story = { args: { tx: heldWithdrawal } }
export const FailedLimitCheck: Story = { args: { tx: failedLimit } }
export const OasisSkip: Story = { args: { tx: noOasis } }
export const Pending: Story = { args: { tx: pending } }

export const FullMonitor: Story = {
  render: () => (
    <div>{allRows.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={() => {}} onAction={() => {}} />)}</div>
  ),
  args: { tx: completedDeposit },
}
