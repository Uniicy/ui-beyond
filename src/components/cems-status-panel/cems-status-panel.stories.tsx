import type { Meta, StoryObj } from '@storybook/react'
import { CemsStatusPanel } from './cems-status-panel'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const history = Array.from({ length: 8 }, (_, i) => ({
  reportedAt: minutesAgo(i * 15 + 1),
  transactionCount: 340 + Math.floor(Math.random() * 60),
  status: (i === 2 ? 'failed' : 'success') as 'success' | 'failed',
  durationMs: 200 + Math.floor(Math.random() * 400),
}))

const meta = {
  title: 'Components/CemsStatusPanel',
  component: CemsStatusPanel,
  args: {
    reportStatus: 'healthy',
    lastReportAt: minutesAgo(1),
    reportsToday: 96,
    transactionsReported: 31420,
    failuresToday: 0,
    reportHistory: history,
    brandMarket: 'mu',
    onManualReport: () => {},
  },
} satisfies Meta<typeof CemsStatusPanel>

export default meta
type Story = StoryObj<typeof meta>

export const HealthyMU: Story = {}

export const FailedMU: Story = {
  args: { reportStatus: 'failed', failuresToday: 4 },
}

export const NonMUMarket: Story = {
  args: { brandMarket: 'de' },
}
