import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LimitOverridePanel } from './limit-override-panel'
import { Button } from '../button'

function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const limits = [
  { limitType: 'deposit' as const, period: 'monthly' as const, currentAmount: 840, limitAmount: 1000, currency: 'EUR', source: 'lugas' as const, periodResetAt: daysFromNow(18) },
  { limitType: 'loss' as const, period: 'weekly' as const, currentAmount: 110, limitAmount: 200, currency: 'EUR', source: 'player' as const, periodResetAt: daysFromNow(4), canEdit: true },
]

const meta = {
  title: 'Components/LimitOverridePanel',
  component: LimitOverridePanel,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false, onClose: () => {}, onSubmit: async () => { await new Promise((r) => setTimeout(r, 1000)) },
    player: { id: 'usr_1a4d', name: 'Thomas Huber' }, currentLimits: limits, agentId: 'agent_sk_01',
  },
} satisfies Meta<typeof LimitOverridePanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (<div style={{ padding: '2rem' }}><Button onClick={() => setOpen(true)}>Override limits</Button><LimitOverridePanel {...args} open={open} onClose={() => setOpen(false)} /></div>)
  },
}

export const AlwaysOpen: Story = { args: { open: true } }
