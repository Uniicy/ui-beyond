import type { Meta, StoryObj } from '@storybook/react'
import { CompliancePulse } from './compliance-pulse'

const meta = {
  title: 'Components/CompliancePulse',
  component: CompliancePulse,
  argTypes: {
    label: { control: 'text' },
    animate: { control: 'boolean' },
  },
  args: {
    label: 'Identity Verified',
    animate: true,
  },
} satisfies Meta<typeof CompliancePulse>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Static: Story = {
  args: { animate: false },
}

export const CustomLabel: Story = {
  args: { label: 'KYC Complete' },
}
