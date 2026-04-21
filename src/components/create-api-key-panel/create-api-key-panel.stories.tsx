import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CreateApiKeyPanel } from './create-api-key-panel'
import { Button } from '../button'

const meta = {
  title: 'Components/CreateApiKeyPanel', component: CreateApiKeyPanel, parameters: { layout: 'fullscreen' },
  args: { open: false, onClose: () => {}, onCreate: async () => { await new Promise((r) => setTimeout(r, 1000)); return { id: 'ak-new', fullKey: 'sk_demo_EXAMPLE-ONLY-not-a-real-stripe-key' } } },
} satisfies Meta<typeof CreateApiKeyPanel>

export default meta; type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => { const [open, setOpen] = useState(false); return (<div style={{ padding: '2rem' }}><Button onClick={() => setOpen(true)}>Generate API key</Button><CreateApiKeyPanel {...args} open={open} onClose={() => setOpen(false)} /></div>) },
}

export const AlwaysOpen: Story = { args: { open: true } }
export const RotateMode: Story = { args: { open: true, mode: 'rotate', existingKeyName: 'Production webhook' } }
