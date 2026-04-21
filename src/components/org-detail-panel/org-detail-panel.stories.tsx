import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { OrgDetailPanel, type OrgDetail } from './org-detail-panel'
import { Button } from '../button'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const org: OrgDetail = {
  id: 'org_tipico_001', name: 'Tipico GmbH', contactEmail: 'ops@tipico.de', tier: 'growth',
  markets: ['de', 'mu'], brandCount: 2, playerCount: 12847, status: 'active',
  legalName: 'Tipico Co. Ltd', address: 'Berliner Str. 42, M\u00fcnchen', contractStart: '1 Feb 2026', contractRenewal: '1 Feb 2027',
  accountManagerName: 'Max Meier', accountManagerEmail: 'max@uniicy.com',
  usageMetrics: [
    { label: 'KYC verifications', current: 2441, quota: 5000, unit: 'verifications', trend: 842 },
    { label: 'Active players', current: 12847, quota: null, unit: 'players' },
    { label: 'API calls', current: 284320, quota: 500000, unit: 'calls' },
    { label: 'Storage', current: 284, quota: 420, unit: 'GB' },
  ],
  impersonationHistory: [
    { agentName: 'UNIICY Admin', agentId: 'sa-1', startedAt: hoursAgo(3), durationSeconds: 420, reason: 'Investigating KYC SLA breach' },
    { agentName: 'Max Meier', agentId: 'sa-2', startedAt: daysAgo(2), durationSeconds: 1200, reason: 'Onboarding support' },
    { agentName: 'UNIICY Admin', agentId: 'sa-1', startedAt: daysAgo(7), durationSeconds: 180, reason: 'Config review' },
  ],
}

const meta = { title: 'Components/OrgDetailPanel', component: OrgDetailPanel, parameters: { layout: 'fullscreen' }, args: { org, onImpersonate: () => {}, open: false, onClose: () => {} } } satisfies Meta<typeof OrgDetailPanel>
export default meta; type Story = StoryObj<typeof meta>

export const Overview: Story = { render: (args) => { const [o, setO] = useState(false); return (<div style={{ padding: '2rem' }}><Button onClick={() => setO(true)}>Open org</Button><OrgDetailPanel {...args} open={o} onClose={() => setO(false)} /></div>) } }
export const AlwaysOpen: Story = { args: { open: true } }
