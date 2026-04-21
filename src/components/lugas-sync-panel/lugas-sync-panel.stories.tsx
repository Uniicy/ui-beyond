import type { Meta, StoryObj } from '@storybook/react'
import { LugasSyncPanel } from './lugas-sync-panel'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const history = Array.from({ length: 8 }, (_, i) => ({
  syncedAt: minutesAgo(i * 30 + 2),
  playersSynced: 12800 + Math.floor(Math.random() * 100),
  failures: i === 3 ? 2 : i === 6 ? 1 : 0,
  durationMs: 800 + Math.floor(Math.random() * 600),
}))

const playersAtLimit = [
  { id: 'p1', name: 'Thomas Huber', amount: 1000, resetAt: daysFromNow(18) },
  { id: 'p2', name: 'Anna Fischer', amount: 980, resetAt: daysFromNow(12) },
  { id: 'p3', name: 'Klaus Wagner', amount: 1000, resetAt: daysFromNow(5) },
]

const meta = {
  title: 'Components/LugasSyncPanel',
  component: LugasSyncPanel,
  args: {
    syncStatus: 'healthy', lastSyncAt: minutesAgo(2), lastSyncDurationMs: 1240,
    playersSynced: 12847, playersAtLimit: 3, failuresToday: 0,
    syncHistory: history, playersAtLimitList: playersAtLimit,
    brandMarket: 'de', onRetrySync: () => {},
  },
} satisfies Meta<typeof LugasSyncPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = {}

export const Syncing: Story = {
  args: { syncStatus: 'syncing' },
}

export const Failed: Story = {
  args: { syncStatus: 'failed', failuresToday: 3 },
}

export const NonDeMarket: Story = {
  args: { brandMarket: 'mu' },
}
