import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PurgeConfirmModal } from './purge-confirm-modal'
import { Button } from '../button'

function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const cats = [
  { id: 'c1', category: 'Player session logs', storageSizeGb: 8.2, oldestRecordAt: daysAgo(900) },
  { id: 'c2', category: 'Marketing consent records', storageSizeGb: 1.2, oldestRecordAt: daysAgo(500) },
  { id: 'c3', category: 'Anonymised analytics', storageSizeGb: 14.8, oldestRecordAt: daysAgo(1200) },
]

const meta = {
  title: 'Components/PurgeConfirmModal',
  component: PurgeConfirmModal,
  parameters: { layout: 'fullscreen' },
  args: { open: false, onClose: () => {}, onConfirm: async () => { await new Promise((r) => setTimeout(r, 1500)) }, availableCategories: cats, currentAgent: { id: 'a-1', name: 'Sarah Klein' } },
} satisfies Meta<typeof PurgeConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (<div style={{ padding: '2rem' }}><Button variant="danger" onClick={() => setOpen(true)}>Manual purge\u2026</Button><PurgeConfirmModal {...args} open={open} onClose={() => setOpen(false)} /></div>)
  },
}

export const AlwaysOpen: Story = { args: { open: true } }
