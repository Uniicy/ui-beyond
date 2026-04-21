import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TabBar } from './tab-bar'

const playerTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'kyc', label: 'KYC' },
  { value: 'aml', label: 'AML' },
  { value: 'rg', label: 'RG' },
  { value: 'payments', label: 'Payments' },
  { value: 'timeline', label: 'Timeline' },
]

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
  argTypes: {
    activeTab: { control: 'select', options: playerTabs.map((t) => t.value) },
    size: { control: 'select', options: ['sm', 'md'] },
    bordered: { control: 'boolean' },
    flush: { control: 'boolean' },
  },
  args: {
    tabs: playerTabs,
    activeTab: 'overview',
    onTabChange: () => {},
  },
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBadges: Story = {
  args: {
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'kyc', label: 'KYC', badge: 1 },
      { value: 'aml', label: 'AML', badge: 2 },
      { value: 'rg', label: 'RG' },
      { value: 'payments', label: 'Payments' },
      { value: 'timeline', label: 'Timeline' },
    ],
  },
}

export const DisabledTab: Story = {
  args: {
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'kyc', label: 'KYC' },
      { value: 'aml', label: 'AML' },
      { value: 'rg', label: 'RG', disabled: true },
      { value: 'payments', label: 'Payments' },
      { value: 'timeline', label: 'Timeline' },
    ],
  },
}

export const SmallSize: Story = {
  args: { size: 'sm' },
}

export const Flush: Story = {
  args: { flush: true },
}

export const Interactive: Story = {
  args: {
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'kyc', label: 'KYC', badge: 1 },
      { value: 'aml', label: 'AML', badge: 2 },
      { value: 'rg', label: 'RG' },
      { value: 'payments', label: 'Payments' },
      { value: 'timeline', label: 'Timeline' },
    ],
  },
  render: (args) => {
    const [active, setActive] = useState(args.activeTab)
    return (
      <div>
        <TabBar {...args} activeTab={active} onTabChange={setActive} />
        <div style={{ padding: '16px', fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>
          Active: <strong style={{ color: 'var(--ub-color-on-surface)' }}>{active}</strong>
          <br />
          <span style={{ fontSize: 11 }}>Use \u2190 \u2192 arrow keys to navigate tabs.</span>
        </div>
      </div>
    )
  },
}
