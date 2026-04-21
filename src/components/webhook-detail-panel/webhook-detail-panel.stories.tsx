import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { WebhookDetailPanel, type WebhookDetail } from './webhook-detail-panel'
import { Button } from '../button'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const allEvents = [
  'kyc.verification.created', 'kyc.verification.completed', 'kyc.verification.rejected', 'kyc.player.blocked',
  'aml.alert.created', 'aml.alert.dismissed', 'aml.sar.submitted',
  'rg.limit.set', 'rg.limit.reached', 'rg.exclusion.applied',
  'psp.deposit.completed', 'psp.withdrawal.completed',
]

const webhook: WebhookDetail = {
  id: 'wh-1', url: 'https://api.pferdewetten.de/webhooks/compliance', description: 'Compliance event sink',
  eventCount: 12, active: true, lastDeliveryAt: minutesAgo(2), lastDeliveryStatus: 'success', failureCount24h: 0,
  secret: 'whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  subscribedEvents: allEvents.slice(0, 8),
  deliveryHistory: [
    { occurredAt: minutesAgo(2), eventType: 'kyc.verification.completed', statusCode: 200, durationMs: 142 },
    { occurredAt: minutesAgo(5), eventType: 'aml.alert.created', statusCode: 200, durationMs: 188 },
    { occurredAt: minutesAgo(12), eventType: 'rg.limit.reached', statusCode: 200, durationMs: 95 },
    { occurredAt: minutesAgo(30), eventType: 'psp.deposit.completed', statusCode: 500, durationMs: 3100 },
    { occurredAt: minutesAgo(45), eventType: 'kyc.verification.created', statusCode: 200, durationMs: 110 },
  ],
}

const meta = {
  title: 'Components/WebhookDetailPanel',
  component: WebhookDetailPanel,
  parameters: { layout: 'fullscreen' },
  args: { webhook, allEventTypes: allEvents, onSave: async () => { await new Promise((r) => setTimeout(r, 1000)) }, onDelete: () => {}, onRotateSecret: async () => 'whsec_NEW_x9y8z7w6v5u4t3s2r1q0', open: false, onClose: () => {} },
} satisfies Meta<typeof WebhookDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (<div style={{ padding: '2rem' }}><Button onClick={() => setOpen(true)}>Open webhook</Button><WebhookDetailPanel {...args} open={open} onClose={() => setOpen(false)} /></div>)
  },
}

export const AlwaysOpen: Story = { args: { open: true } }

export const RevealSecret: Story = {
  args: { open: true },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500))
    const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'Reveal')
    btn?.click()
  },
}
