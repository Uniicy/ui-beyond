import type { Meta, StoryObj } from '@storybook/react'
import { SystemHealthCard, type ServiceHealth } from './system-health-card'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }

const allGreen = Array(24).fill(1)
const withDegraded = [...Array(10).fill(1), 0.6, 0.5, 0.7, ...Array(11).fill(1)]
const withDown = [...Array(6).fill(1), 0.1, 0.05, 0.5, 0.6, ...Array(14).fill(1)]

const healthy: ServiceHealth = { name: 'player-graph', displayName: 'Player Graph', status: 'healthy', uptimePercent: 99.94, uptimeHistory: allGreen, errorRatePercent: 0.02, latencyP95Ms: 142, lastIncidentAt: hoursAgo(72) }
const degraded: ServiceHealth = { name: 'kyc', displayName: 'KYC Service', status: 'degraded', uptimePercent: 97.2, uptimeHistory: withDegraded, errorRatePercent: 0.8, latencyP95Ms: 680 }
const down: ServiceHealth = { name: 'aml', displayName: 'AML Engine', status: 'down', uptimePercent: 89.1, uptimeHistory: withDown, errorRatePercent: 12.4, latencyP95Ms: 3200, lastIncidentAt: hoursAgo(0.5) }
const unknown: ServiceHealth = { name: 'rg', displayName: 'RG Module', status: 'unknown', uptimePercent: 0, uptimeHistory: Array(24).fill(0), errorRatePercent: 0, latencyP95Ms: 0 }

const allServices: ServiceHealth[] = [
  healthy,
  { ...healthy, name: 'kyc-svc', displayName: 'KYC Service', uptimePercent: 99.98, errorRatePercent: 0.01, latencyP95Ms: 98 },
  degraded,
  { ...healthy, name: 'psp', displayName: 'PSP Gateway', uptimePercent: 99.87, errorRatePercent: 0.05, latencyP95Ms: 210 },
  down,
  { ...healthy, name: 'api-gw', displayName: 'API Gateway', uptimePercent: 99.99, errorRatePercent: 0.0, latencyP95Ms: 45 },
]

const meta = { title: 'Components/SystemHealthCard', component: SystemHealthCard, args: { service: healthy, onViewLogs: () => {} } } satisfies Meta<typeof SystemHealthCard>
export default meta; type Story = StoryObj<typeof meta>

export const Healthy: Story = {}
export const Degraded: Story = { args: { service: degraded } }
export const Down: Story = { args: { service: down } }
export const WithIncident: Story = { args: { service: { ...healthy, lastIncidentAt: hoursAgo(3) } } }

export const HealthGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {allServices.map((s) => <SystemHealthCard key={s.name} service={s} onViewLogs={() => {}} />)}
    </div>
  ),
  args: { service: healthy },
}
