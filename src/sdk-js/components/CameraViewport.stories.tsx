import type { Meta, StoryObj } from '@storybook/react'
import { CameraViewport } from './CameraViewport'

const meta = {
  title: 'SDK/CameraViewport',
  component: CameraViewport,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pure-CSS camera frame used by LivenessProbeWidget. `showFace` is a ' +
          'Storybook-only helper that renders a silhouette; production consumers ' +
          'attach a live <video> element via their own ref.',
      },
    },
  },
  args: {
    showFace: true,
  },
  argTypes: {
    challengeDirection: { control: 'inline-radio', options: ['left', 'right', 'up'] },
  },
} satisfies Meta<typeof CameraViewport>

export default meta
type Story = StoryObj<typeof meta>

export const Searching: Story = {
  args: { state: 'searching', showFace: false },
}

export const Detected: Story = {
  args: { state: 'detected', showFace: true },
}

export const ChallengeLeft: Story = {
  name: 'Challenge — left',
  args: { state: 'challenge', showFace: true, challengeDirection: 'left' },
}

export const ChallengeRight: Story = {
  name: 'Challenge — right',
  args: { state: 'challenge', showFace: true, challengeDirection: 'right' },
}

export const ChallengeUp: Story = {
  name: 'Challenge — up',
  args: { state: 'challenge', showFace: true, challengeDirection: 'up' },
}

export const Processing: Story = {
  args: { state: 'processing', showFace: true },
}

export const Passed: Story = {
  args: { state: 'passed', showFace: true },
}

export const Failed: Story = {
  args: { state: 'failed', showFace: true },
}
