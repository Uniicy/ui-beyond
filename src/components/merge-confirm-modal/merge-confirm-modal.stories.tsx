import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MergeConfirmModal } from './merge-confirm-modal'
import { Button } from '../button'

function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const match = {
  playerA: { id: 'usr_1a4d', name: 'Thomas Huber', email: 't.huber@example.de', kycStatus: 'approved', createdAt: daysAgo(365), verificationCount: 3 },
  playerB: { id: 'usr_8f2c', name: 'Thomas M. Huber', email: 'th.huber@example.de', kycStatus: 'pending', createdAt: daysAgo(14), verificationCount: 1 },
}

const meta = {
  title: 'Components/MergeConfirmModal',
  component: MergeConfirmModal,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false,
    onClose: () => {},
    onConfirm: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    match,
  },
} satisfies Meta<typeof MergeConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open merge modal</Button>
        <MergeConfirmModal {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: { open: true },
}
