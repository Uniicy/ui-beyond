import type { Meta, StoryObj } from '@storybook/react'
import { UsageMeter } from './usage-meter'
import { Surface } from '../surface'

const meta = { title: 'Components/UsageMeter', component: UsageMeter, args: { label: 'KYC verifications', current: 2441, quota: 5000, unit: 'verifications' } } satisfies Meta<typeof UsageMeter>
export default meta; type Story = StoryObj<typeof meta>

export const Healthy: Story = {}
export const Warning: Story = { args: { current: 3600, quota: 5000 } }
export const Danger: Story = { args: { current: 4550, quota: 5000 } }
export const Unlimited: Story = { args: { current: 12847, quota: null, label: 'Players', unit: 'players' } }
export const WithTrend: Story = { args: { current: 2441, quota: 5000, trend: 842 } }

export const Stack: Story = {
  render: () => (
    <Surface elevation="low" style={{ padding: 16, borderRadius: 10, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <UsageMeter label="KYC verifications" current={2441} quota={5000} unit="verifications" trend={842} />
      <UsageMeter label="AML alerts" current={126} quota={null} unit="alerts" />
      <UsageMeter label="PSP transactions" current={18441} quota={25000} unit="transactions" />
      <UsageMeter label="Storage" current={284} quota={420} unit="GB" />
    </Surface>
  ),
  args: { label: 'KYC verifications', current: 2441, quota: 5000 },
}
