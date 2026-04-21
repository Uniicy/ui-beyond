import type { Meta, StoryObj } from '@storybook/react'
import { OrgRow, type Organisation } from './org-row'

function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const active: Organisation = { id: 'org-1', name: 'Tipico GmbH', contactEmail: 'ops@tipico.de', tier: 'growth', markets: ['de', 'mu'], brandCount: 2, playerCount: 12847, monthlyApiCalls: 284320, status: 'active', createdAt: daysAgo(365), accountManagerName: 'Max Meier' }
const enterprise: Organisation = { id: 'org-2', name: 'BetBird Ltd', contactEmail: 'admin@betbird.io', tier: 'enterprise', markets: ['de', 'mu', 'nl', 'gb'], brandCount: 5, playerCount: 48210, monthlyApiCalls: 1240000, status: 'active', createdAt: daysAgo(540) }
const trial: Organisation = { id: 'org-3', name: 'NewCo Betting', contactEmail: 'hello@newco.de', tier: 'starter', markets: ['de'], brandCount: 1, playerCount: 142, monthlyApiCalls: 3200, status: 'trial', createdAt: daysAgo(14) }
const suspended: Organisation = { id: 'org-4', name: 'OldBet AG', contactEmail: 'info@oldbet.de', tier: 'growth', markets: ['de'], brandCount: 1, playerCount: 0, monthlyApiCalls: 0, status: 'suspended', createdAt: daysAgo(400) }
const starter: Organisation = { id: 'org-5', name: 'MU Gaming', contactEmail: 'contact@mugaming.mu', tier: 'starter', markets: ['mu'], brandCount: 1, playerCount: 891, monthlyApiCalls: 12400, status: 'active', createdAt: daysAgo(90) }

const meta = { title: 'Components/OrgRow', component: OrgRow, args: { org: active, onImpersonate: () => {}, onClick: () => {} } } satisfies Meta<typeof OrgRow>
export default meta; type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const Enterprise: Story = { args: { org: enterprise } }
export const Trial: Story = { args: { org: trial } }
export const Suspended: Story = { args: { org: suspended } }
export const Table: Story = { render: () => (<div>{[active, enterprise, trial, starter, suspended].map((o) => <OrgRow key={o.id} org={o} onImpersonate={() => {}} onClick={() => {}} />)}</div>), args: { org: active } }
