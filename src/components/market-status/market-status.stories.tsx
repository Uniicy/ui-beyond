import type { Meta, StoryObj } from '@storybook/react'
import { MarketStatusRow } from './market-status-row'
import { MarketStatusPanel } from './market-status-panel'

/* ── MarketStatusRow stories ── */

const rowMeta = {
  title: 'Components/MarketStatusRow',
  component: MarketStatusRow,
  argTypes: {
    market: { control: 'select', options: ['de', 'mu', 'nl', 'gb'] },
    status: { control: 'select', options: ['live', 'beta', 'degraded', 'outage', 'maintenance'] },
    lastChecked: { control: 'text' },
  },
  args: {
    market: 'de',
    status: 'live',
  },
} satisfies Meta<typeof MarketStatusRow>

export default rowMeta
type RowStory = StoryObj<typeof rowMeta>

export const GermanyLive: RowStory = {
  args: { market: 'de', status: 'live', lastChecked: '2 min ago' },
}

export const MauritiusBeta: RowStory = {
  args: { market: 'mu', status: 'beta' },
}

export const NetherlandsDegraded: RowStory = {
  args: { market: 'nl', status: 'degraded', lastChecked: '30 sec ago' },
}

export const UkOutage: RowStory = {
  args: { market: 'gb', status: 'outage', lastChecked: '1 min ago' },
}

export const WithChecks: RowStory = {
  args: {
    market: 'de',
    status: 'live',
    checks: [
      { name: 'OASIS', ok: true },
      { name: 'LUGAS', ok: true },
      { name: 'CEMS', ok: false },
      { name: 'Safe Server', ok: true },
    ],
    lastChecked: '2 min ago',
  },
}

export const WithManyChecks: RowStory = {
  args: {
    market: 'de',
    status: 'degraded',
    checks: [
      { name: 'OASIS', ok: true },
      { name: 'LUGAS', ok: true },
      { name: 'CEMS', ok: false },
      { name: 'Safe Server', ok: true },
      { name: 'Limits', ok: true },
      { name: 'Activity Log', ok: false },
      { name: 'Panic Button', ok: true },
    ],
    lastChecked: '5 sec ago',
  },
}

export const Clickable: RowStory = {
  args: {
    market: 'de',
    status: 'live',
    onClick: () => {},
  },
}
