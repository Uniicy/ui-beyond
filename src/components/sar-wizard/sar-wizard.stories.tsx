import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SARWizard } from './sar-wizard'
import { Button } from '../button'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }

const allAlerts = [
  { id: 'AML-042', ruleName: 'Rapid deposit sequence', severity: 'high', createdAt: hoursAgo(2), player: { name: 'Thomas Huber' } },
  { id: 'AML-038', ruleName: 'Unusual withdrawal pattern', severity: 'medium', createdAt: hoursAgo(8), player: { name: 'Thomas Huber' } },
  { id: 'AML-031', ruleName: 'Velocity threshold', severity: 'low', createdAt: hoursAgo(48), player: { name: 'Thomas Huber' } },
  { id: 'AML-029', ruleName: 'Structuring detected', severity: 'critical', createdAt: hoursAgo(72), player: { name: 'Anna Becker' } },
  { id: 'AML-025', ruleName: 'Large single transaction', severity: 'medium', createdAt: hoursAgo(120), player: { name: 'Stefan Braun' } },
]

const player = {
  id: 'P-1842',
  name: 'Thomas Huber',
  email: 'thomas.huber@example.de',
  kycStatus: 'approved',
  amlRiskTier: 'enhanced',
  dateOfBirth: '14 Mar 1988',
  address: 'Berliner Str. 42, 80331 M\u00fcnchen, Germany',
}

const currentAgent = { id: 'a-1', name: 'Sarah Klein' }

const meta = {
  title: 'Components/SARWizard',
  component: SARWizard,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false,
    onClose: () => {},
    onSubmit: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    prelinkedAlerts: ['AML-042'],
    allAlerts,
    player,
    currentAgent,
  },
} satisfies Meta<typeof SARWizard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Create SAR</Button>
        <SARWizard {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: { open: true },
}
