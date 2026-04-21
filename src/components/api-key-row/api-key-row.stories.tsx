import type { Meta, StoryObj } from '@storybook/react'
import { ApiKeyRow, type ApiKey } from './api-key-row'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const activeProd: ApiKey = { id: 'ak-1', name: 'Production webhook', environment: 'production', maskedKey: 'sk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022a4f9', scopes: ['kyc:read', 'kyc:write', 'player:read', 'aml:read', 'webhook:read'], createdAt: daysAgo(90), lastUsedAt: hoursAgo(2), expiresAt: daysFromNow(275), status: 'active' }
const activeStaging: ApiKey = { id: 'ak-2', name: 'Staging test key', environment: 'staging', maskedKey: 'sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20228b12', scopes: ['kyc:read', 'player:read'], createdAt: daysAgo(14), lastUsedAt: hoursAgo(6), status: 'active' }
const revoked: ApiKey = { id: 'ak-3', name: 'Old integration key', environment: 'production', maskedKey: '', scopes: ['kyc:read'], createdAt: daysAgo(200), status: 'revoked' }
const expired: ApiKey = { id: 'ak-4', name: 'Expired partner key', environment: 'production', maskedKey: '', scopes: ['player:read', 'psp:read'], createdAt: daysAgo(400), expiresAt: daysAgo(10), status: 'expired' }

const revealFn = async () => 'sk_demo_EXAMPLE-ONLY-not-a-real-stripe-key'

const meta = { title: 'Components/ApiKeyRow', component: ApiKeyRow, args: { apiKey: activeProd, onReveal: revealFn, onCopy: () => {}, onRotate: () => {}, onRevoke: () => {} } } satisfies Meta<typeof ApiKeyRow>
export default meta; type Story = StoryObj<typeof meta>

export const ActiveProd: Story = {}
export const ActiveStaging: Story = { args: { apiKey: activeStaging } }
export const Revoked: Story = { args: { apiKey: revoked } }
export const Expired: Story = { args: { apiKey: expired } }
export const RevealCountdown: Story = { play: async ({ canvasElement }) => { await new Promise((r) => setTimeout(r, 200)); const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'Reveal'); btn?.click() } }
export const RevokeConfirm: Story = { play: async ({ canvasElement }) => { await new Promise((r) => setTimeout(r, 200)); const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'Revoke'); btn?.click() } }
export const Table: Story = { render: () => (<div>{[activeProd, activeStaging, revoked, expired].map((k) => <ApiKeyRow key={k.id} apiKey={k} onReveal={revealFn} onCopy={() => {}} onRotate={() => {}} onRevoke={() => {}} />)}</div>), args: { apiKey: activeProd } }
