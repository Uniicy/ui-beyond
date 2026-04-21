import type { Meta, StoryObj } from '@storybook/react'
import { MarketStatusPanel } from './market-status-panel'

const meta = {
  title: 'Components/MarketStatusPanel',
  component: MarketStatusPanel,
  args: {
    title: 'Market status',
    rows: [
      {
        market: 'de',
        status: 'live',
        checks: [
          { name: 'OASIS', ok: true },
          { name: 'LUGAS', ok: true },
          { name: 'CEMS', ok: true },
          { name: 'Safe Server', ok: true },
        ],
        lastChecked: '2 min ago',
      },
      {
        market: 'mu',
        status: 'live',
        lastChecked: '1 min ago',
      },
      {
        market: 'nl',
        status: 'beta',
        checks: [
          { name: 'KSA Portal', ok: true },
          { name: 'CRUKS', ok: false },
        ],
        lastChecked: '30 sec ago',
      },
      {
        market: 'gb',
        status: 'beta',
        lastChecked: '5 min ago',
      },
    ],
  },
} satisfies Meta<typeof MarketStatusPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {}

export const AllLive: Story = {
  args: {
    rows: [
      { market: 'de', status: 'live', lastChecked: '2 min ago' },
      { market: 'mu', status: 'live', lastChecked: '1 min ago' },
      { market: 'nl', status: 'live', lastChecked: '30 sec ago' },
      { market: 'gb', status: 'live', lastChecked: '3 min ago' },
    ],
  },
}

export const MixedIssues: Story = {
  args: {
    rows: [
      { market: 'de', status: 'degraded', checks: [{ name: 'OASIS', ok: true }, { name: 'LUGAS', ok: false }], lastChecked: '10 sec ago' },
      { market: 'mu', status: 'live', lastChecked: '1 min ago' },
      { market: 'nl', status: 'maintenance' },
      { market: 'gb', status: 'outage', lastChecked: '30 sec ago' },
    ],
  },
}
