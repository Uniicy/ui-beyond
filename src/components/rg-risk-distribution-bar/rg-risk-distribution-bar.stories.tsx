import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RgRiskDistributionBar } from './rg-risk-distribution-bar'

const realistic = {
  bands: [
    { label: 'Low' as const, count: 9121, percentage: 71 },
    { label: 'Medium' as const, count: 2441, percentage: 19 },
    { label: 'Elevated' as const, count: 900, percentage: 7 },
    { label: 'High' as const, count: 385, percentage: 3 },
  ],
  total: 12847,
}

const heavyHigh = {
  bands: [
    { label: 'Low' as const, count: 5139, percentage: 40 },
    { label: 'Medium' as const, count: 3854, percentage: 30 },
    { label: 'Elevated' as const, count: 2569, percentage: 20 },
    { label: 'High' as const, count: 1285, percentage: 10 },
  ],
  total: 12847,
}

const withTrends = {
  bands: [
    { label: 'Low' as const, count: 9121, percentage: 71, trend: -8 },
    { label: 'Medium' as const, count: 2441, percentage: 19, trend: -3 },
    { label: 'Elevated' as const, count: 900, percentage: 7, trend: 4 },
    { label: 'High' as const, count: 385, percentage: 3, trend: 12 },
  ],
  total: 12847,
}

const narrow = {
  bands: [
    { label: 'Low' as const, count: 12334, percentage: 96 },
    { label: 'Medium' as const, count: 385, percentage: 3 },
    { label: 'Elevated' as const, count: 103, percentage: 0.8 },
    { label: 'High' as const, count: 25, percentage: 0.2 },
  ],
  total: 12847,
}

const meta = {
  title: 'Components/RgRiskDistributionBar',
  component: RgRiskDistributionBar,
  args: {
    ...realistic,
  },
} satisfies Meta<typeof RgRiskDistributionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Realistic: Story = {}

export const HeavyHighRisk: Story = {
  args: { ...heavyHigh },
}

export const ActiveBandHigh: Story = {
  args: { ...realistic, activeband: 'High', onBandClick: () => {} },
}

export const WithTrends: Story = {
  args: { ...withTrends },
}

export const NarrowSegments: Story = {
  args: { ...narrow },
}

export const Interactive: Story = {
  args: { ...withTrends },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined)
    return (
      <RgRiskDistributionBar
        {...args}
        activeband={active}
        onBandClick={(band) => setActive(band ?? undefined)}
      />
    )
  },
}
