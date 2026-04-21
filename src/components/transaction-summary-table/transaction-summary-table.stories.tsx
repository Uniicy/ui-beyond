import type { Meta, StoryObj } from '@storybook/react'
import { TransactionSummaryTable, type Transaction } from './transaction-summary-table'

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString()
}

/* Rapid deposit sequence — Thomas Huber, 3× Trustly €200 in 10 min */
const rapidDeposits: Transaction[] = [
  { id: 'tx-1', occurredAt: minutesAgo(12), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 22000, flagged: true },
  { id: 'tx-2', occurredAt: minutesAgo(8), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 42000, flagged: true },
  { id: 'tx-3', occurredAt: minutesAgo(3), type: 'deposit', amount: 20000, currency: 'EUR', provider: 'Trustly', balanceAfter: 62000, flagged: true },
  { id: 'tx-4', occurredAt: minutesAgo(1), type: 'withdrawal', amount: 5000, currency: 'EUR', provider: 'Trustly', balanceAfter: 57000 },
]

const mixedTransactions: Transaction[] = [
  { id: 'tx-10', occurredAt: minutesAgo(45), type: 'deposit', amount: 50000, currency: 'EUR', provider: 'Nuvei', balanceAfter: 50000 },
  { id: 'tx-11', occurredAt: minutesAgo(30), type: 'withdrawal', amount: 15000, currency: 'EUR', provider: 'Nuvei', balanceAfter: 35000, flagged: true },
  { id: 'tx-12', occurredAt: minutesAgo(20), type: 'deposit', amount: 25000, currency: 'EUR', provider: 'Trustly', balanceAfter: 60000 },
  { id: 'tx-13', occurredAt: minutesAgo(10), type: 'withdrawal', amount: 40000, currency: 'EUR', provider: 'Nuvei', balanceAfter: 20000, flagged: true },
  { id: 'tx-14', occurredAt: minutesAgo(5), type: 'deposit', amount: 10000, currency: 'EUR', provider: 'Trustly', balanceAfter: 30000 },
]

const manyTransactions: Transaction[] = Array.from({ length: 14 }, (_, i) => ({
  id: `tx-m${i}`,
  occurredAt: minutesAgo(i * 15 + 5),
  type: (i % 3 === 0 ? 'withdrawal' : 'deposit') as 'deposit' | 'withdrawal',
  amount: (i + 1) * 5000,
  currency: 'EUR',
  provider: i % 2 === 0 ? 'Trustly' : 'Nuvei',
  balanceAfter: 100000 - i * 3000,
  flagged: i === 2 || i === 5,
}))

const meta = {
  title: 'Components/TransactionSummaryTable',
  component: TransactionSummaryTable,
  args: {
    transactions: rapidDeposits,
    currency: 'EUR',
  },
} satisfies Meta<typeof TransactionSummaryTable>

export default meta
type Story = StoryObj<typeof meta>

/* ── Rapid deposit sequence (wireframe example) ── */

export const RapidDeposits: Story = {
  args: {
    transactions: rapidDeposits,
    currency: 'EUR',
    totalAmount: 60000,
  },
}

/* ── Mixed deposit + withdrawal ── */

export const MixedTypes: Story = {
  args: {
    transactions: mixedTransactions,
    currency: 'EUR',
  },
}

/* ── Overflow — "View all 14 transactions →" ── */

export const Overflow: Story = {
  args: {
    transactions: manyTransactions,
    currency: 'EUR',
    maxRows: 8,
    onViewAll: () => {},
  },
}

/* ── With subtotal ── */

export const WithTotal: Story = {
  args: {
    transactions: mixedTransactions,
    currency: 'EUR',
    totalAmount: 140000,
  },
}
