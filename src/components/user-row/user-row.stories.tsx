import type { Meta, StoryObj } from '@storybook/react'
import { UserRow, type TenantUser } from './user-row'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const admin: TenantUser = { id: 'u-1', name: 'Sarah Klein', email: 'sarah@pferdewetten.de', roles: ['org-admin'], brandScope: 'all', lastActiveAt: hoursAgo(0.5), status: 'active' }
const kycAgent: TenantUser = { id: 'u-2', name: 'Max Mustermann', email: 'max@pferdewetten.de', roles: ['kyc-agent'], brandScope: ['b-1'], brandNames: ['Pferdewetten'], lastActiveAt: hoursAgo(2), status: 'active' }
const invited: TenantUser = { id: 'u-3', name: 'Lisa Hoffmann', email: 'lisa@pferdewetten.de', roles: ['kyc-agent', 'aml-analyst'], brandScope: 'all', status: 'invited', invitedAt: daysAgo(2) }
const suspended: TenantUser = { id: 'u-4', name: 'James Lawson', email: 'james@pferdewetten.de', roles: ['compliance-manager'], brandScope: 'all', lastActiveAt: daysAgo(14), status: 'suspended' }
const multiRole: TenantUser = { id: 'u-5', name: 'Julia Richter', email: 'julia@pferdewetten.de', roles: ['kyc-agent', 'aml-analyst', 'compliance-manager', 'finance'], brandScope: ['b-1', 'b-2'], brandNames: ['Pferdewetten', 'BetBird'], lastActiveAt: hoursAgo(6), status: 'active' }

const meta = { title: 'Components/UserRow', component: UserRow, args: { user: admin, onEdit: () => {}, onSuspend: () => {}, onRemove: () => {} } } satisfies Meta<typeof UserRow>
export default meta; type Story = StoryObj<typeof meta>

export const OrgAdmin: Story = {}
export const KycAgent: Story = { args: { user: kycAgent } }
export const Invited: Story = { args: { user: invited } }
export const Suspended: Story = { args: { user: suspended } }
export const MultiRole: Story = { args: { user: multiRole } }
export const Table: Story = { render: () => (<div>{[admin, kycAgent, multiRole, invited, suspended].map((u) => <UserRow key={u.id} user={u} onEdit={() => {}} onSuspend={() => {}} onRemove={() => {}} />)}</div>), args: { user: admin } }
