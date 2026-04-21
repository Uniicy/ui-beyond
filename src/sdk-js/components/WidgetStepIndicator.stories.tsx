import type { Meta, StoryObj } from '@storybook/react'
import { WidgetStepIndicator } from './WidgetStepIndicator'

const meta = {
  title: 'SDK/WidgetStepIndicator',
  component: WidgetStepIndicator,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, padding: 16, background: 'var(--sdk-bg)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, max: 5, step: 1 } },
  },
} satisfies Meta<typeof WidgetStepIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const TwoStep_Step1Active: Story = {
  name: '2-step, step 1 active',
  args: { steps: ['Document', 'Selfie'], currentStep: 0 },
}

export const TwoStep_Step2Active: Story = {
  name: '2-step, step 2 active (step 1 complete)',
  args: { steps: ['Document', 'Selfie'], currentStep: 1 },
}

export const TwoStep_AllComplete: Story = {
  name: '2-step, all complete',
  args: { steps: ['Document', 'Selfie'], currentStep: 2 },
}

export const ThreeStep_Step2Active: Story = {
  name: '3-step, step 2 active',
  args: { steps: ['Start', 'Upload', 'Review'], currentStep: 1 },
}

export const ThreeStep_AllComplete: Story = {
  name: '3-step, all complete',
  args: { steps: ['Start', 'Upload', 'Review'], currentStep: 3 },
}
