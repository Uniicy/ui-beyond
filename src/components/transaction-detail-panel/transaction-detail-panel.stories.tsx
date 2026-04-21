import type { Meta, StoryObj } from '@storybook/react'
import { TransactionDetailPanel } from './transaction-detail-panel'
import type { TransactionEntry } from '../transaction-row'

const baseTx: TransactionEntry = {
  id: 'tx-001',
  occurredAt: new Date(Date.now() - 3_600_000).toISOString(),
  type: 'deposit',
  player: { id: 'PLR-29481', name: 'Martin Richter' },
  amount: 25000,
  currency: 'EUR',
  provider: 'trustly',
  providerRef: 'TRS-88291-XK',
  status: 'completed',
  complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'pass' },
}

const meta = {
  title: 'Components/TransactionDetailPanel',
  component: TransactionDetailPanel,
  args: {
    tx: baseTx,
    open: true,
    onClose: () => {},
    onHold: () => {},
    onApprove: () => {},
    onReject: () => {},
  },
} satisfies Meta<typeof TransactionDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

export const DepositAllPass: Story = {}

export const WithdrawalPending: Story = {
  args: {
    tx: { ...baseTx, type: 'withdrawal', status: 'pending', amount: 180000 },
  },
}

export const WithdrawalHeld: Story = {
  args: {
    tx: { ...baseTx, type: 'withdrawal', status: 'held', amount: 50000, complianceChecks: { oasis: 'pass', kyc: 'pass', limit: 'warn' } },
  },
}
