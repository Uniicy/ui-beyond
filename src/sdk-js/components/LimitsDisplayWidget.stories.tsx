import type { Meta, StoryObj } from '@storybook/react'
import { LimitsDisplayWidget, type LimitEntry } from './LimitsDisplayWidget'

const baseLimits: readonly LimitEntry[] = [
  {
    label: 'Monthly deposit',
    used: 420,
    limit: 1000,
    currency: 'EUR',
    source: 'self',
    periodResetLabel: 'Resets 1 May',
    canChange: true,
  },
  {
    label: 'Weekly loss',
    used: 110,
    limit: 200,
    currency: 'EUR',
    source: 'self',
    periodResetLabel: 'Resets Monday',
    canChange: true,
  },
  {
    label: 'Daily session',
    used: 140,
    limit: 240,
    unit: 'min',
    source: 'self',
    periodResetLabel: 'Resets midnight',
    canChange: true,
  },
]

const meta = {
  title: 'SDK/LimitsDisplayWidget',
  component: LimitsDisplayWidget,
  parameters: { layout: 'centered' },
  args: {
    state: 'normal',
    limits: baseLimits,
  },
} satisfies Meta<typeof LimitsDisplayWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Normal: Story = {
  args: { state: 'normal', limits: baseLimits },
}

export const NearLimit: Story = {
  name: 'Near limit',
  args: {
    state: 'near_limit',
    limits: [
      {
        label: 'Monthly deposit',
        used: 880,
        limit: 1000,
        currency: 'EUR',
        source: 'regulatory',
        periodResetLabel: 'Resets 1 May',
        canChange: false,
      },
      baseLimits[1]!,
      baseLimits[2]!,
    ],
  },
}

export const AtLimit: Story = {
  name: 'At limit',
  args: {
    state: 'at_limit',
    limits: [
      {
        label: 'Monthly deposit',
        used: 1040,
        limit: 1000,
        currency: 'EUR',
        source: 'regulatory',
        periodResetLabel: 'Resets 1 May',
        canChange: false,
      },
      baseLimits[1]!,
      baseLimits[2]!,
    ],
  },
}

export const ChangeForm: Story = {
  name: 'Change form',
  args: {
    state: 'change_form',
    changingLimitIndex: 0,
    coolingOffNote: 'Increases take effect after 24 hours (GlüStV §6c).',
    limits: baseLimits,
  },
}
