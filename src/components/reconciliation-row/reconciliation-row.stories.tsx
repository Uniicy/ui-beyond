import type { Meta, StoryObj } from '@storybook/react'
import { ReconciliationRow, type ReconciliationEntry } from './reconciliation-row'

const reconciled: ReconciliationEntry = { id: 'rec-1', date: '11 Apr 2026', provider: 'trustly', expectedAmount: 4520000, actualAmount: 4520000, delta: 0, currency: 'EUR', status: 'reconciled' }
const mismatch: ReconciliationEntry = { id: 'rec-2', date: '10 Apr 2026', provider: 'nuvei', expectedAmount: 3280000, actualAmount: 3156000, delta: -124000, currency: 'EUR', status: 'mismatch' }
const investigating: ReconciliationEntry = { id: 'rec-3', date: '09 Apr 2026', provider: 'paysafe', expectedAmount: 1890000, actualAmount: 1920000, delta: 30000, currency: 'EUR', status: 'investigating', investigatingAgent: { id: 'a-1', name: 'Sarah Klein' } }
const pending: ReconciliationEntry = { id: 'rec-4', date: '12 Apr 2026', provider: 'trustly', expectedAmount: 5100000, actualAmount: 0, delta: -5100000, currency: 'EUR', status: 'pending' }
const reconciled2: ReconciliationEntry = { id: 'rec-5', date: '08 Apr 2026', provider: 'mcb_juice', expectedAmount: 890000, actualAmount: 890000, delta: 0, currency: 'MUR', status: 'reconciled' }

const meta = { title: 'Components/ReconciliationRow', component: ReconciliationRow, args: { rec: reconciled, onInvestigate: () => {} } } satisfies Meta<typeof ReconciliationRow>
export default meta
type Story = StoryObj<typeof meta>

export const Reconciled: Story = {}
export const Mismatch: Story = { args: { rec: mismatch } }
export const Investigating: Story = { args: { rec: investigating } }
export const Pending: Story = { args: { rec: pending } }
export const Table: Story = { render: () => (<div>{[reconciled, mismatch, investigating, pending, reconciled2].map((r) => <ReconciliationRow key={r.id} rec={r} onInvestigate={() => {}} />)}</div>), args: { rec: reconciled } }
