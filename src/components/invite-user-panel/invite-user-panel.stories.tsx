import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { InviteUserPanel } from './invite-user-panel'
import { Button } from '../button'

const brands = [{ id: 'b-1', name: 'Pferdewetten' }, { id: 'b-2', name: 'BetBird' }, { id: 'b-3', name: 'SportsBet NL' }]
const existingEmails = ['sarah@pferdewetten.de', 'max@pferdewetten.de']

const meta = {
  title: 'Components/InviteUserPanel', component: InviteUserPanel, parameters: { layout: 'fullscreen' },
  args: { open: false, onClose: () => {}, onInvite: async () => { await new Promise((r) => setTimeout(r, 1000)) }, brands, existingEmails },
} satisfies Meta<typeof InviteUserPanel>

export default meta; type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => { const [open, setOpen] = useState(false); return (<div style={{ padding: '2rem' }}><Button onClick={() => setOpen(true)}>Invite agent</Button><InviteUserPanel {...args} open={open} onClose={() => setOpen(false)} /></div>) },
}

export const AlwaysOpen: Story = { args: { open: true } }
