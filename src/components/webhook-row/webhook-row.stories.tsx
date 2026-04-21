import type { Meta, StoryObj } from '@storybook/react'
import { WebhookRow, type WebhookSummary } from './webhook-row'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const healthy: WebhookSummary = { id: 'wh-1', url: 'https://api.pferdewetten.de/webhooks/compliance', description: 'Compliance event sink', eventCount: 12, active: true, lastDeliveryAt: minutesAgo(2), lastDeliveryStatus: 'success', failureCount24h: 0 }
const failing: WebhookSummary = { id: 'wh-2', url: 'https://hooks.betbird.io/v2/identity-events?token=abc123def456', description: 'Identity pipeline', eventCount: 8, active: true, lastDeliveryAt: minutesAgo(5), lastDeliveryStatus: 'failed', failureCount24h: 4 }
const inactive: WebhookSummary = { id: 'wh-3', url: 'https://old.internal.pfw/legacy-hook', eventCount: 3, active: false, failureCount24h: 0 }

const testSuccess = async () => ({ status: 200, durationMs: 142 })
const testFailure = async () => ({ status: 500, durationMs: 3200 })

const meta = { title: 'Components/WebhookRow', component: WebhookRow, args: { webhook: healthy, onToggle: () => {}, onTest: testSuccess, onClick: () => {} } } satisfies Meta<typeof WebhookRow>
export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const Failing: Story = { args: { webhook: failing } }
export const Inactive: Story = { args: { webhook: inactive } }
export const TestSuccess: Story = { play: async ({ canvasElement }) => { await new Promise((r) => setTimeout(r, 200)); const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Send test')); btn?.click() } }
export const TestFailure: Story = { args: { onTest: testFailure }, play: async ({ canvasElement }) => { await new Promise((r) => setTimeout(r, 200)); const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Send test')); btn?.click() } }
export const Table: Story = { render: () => (<div>{[healthy, failing, inactive].map((w) => <WebhookRow key={w.id} webhook={w} onToggle={() => {}} onTest={testSuccess} onClick={() => {}} />)}</div>), args: { webhook: healthy } }
