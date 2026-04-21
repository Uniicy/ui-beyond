import type { Meta, StoryObj } from '@storybook/react'
import { LivenessProbeWidget, type LivenessState } from './LivenessProbeWidget'

const meta = {
  title: 'SDK/LivenessProbeWidget',
  component: LivenessProbeWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Selfie liveness probe across 10 states. Stories use ' +
          '`showFace=true` inside the embedded CameraViewport for visual ' +
          'clarity — production consumers attach a live `<video>` element to ' +
          'the viewport instead.',
      },
    },
  },
  args: {
    state: 'instructions',
    playerEmail: 'player@example.com',
  },
} satisfies Meta<typeof LivenessProbeWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Instructions: Story = { args: { state: 'instructions' } }

export const Searching: Story = { args: { state: 'searching' } }

export const Detected: Story = { args: { state: 'detected' } }

export const ChallengeLeft: Story = {
  name: 'Challenge — left',
  args: { state: 'challenge', challengeDirection: 'left', attemptNumber: 1, maxAttempts: 2 },
}

export const ChallengeRight: Story = {
  name: 'Challenge — right',
  args: { state: 'challenge', challengeDirection: 'right', attemptNumber: 2, maxAttempts: 2 },
}

export const Processing: Story = { args: { state: 'processing' } }

export const Passed: Story = {
  args: {
    state: 'passed',
    confidence: { liveness: 96, faceMatch: 92, spoofDetection: 99 },
  },
}

export const PoorLighting: Story = {
  name: 'Poor lighting',
  args: { state: 'poor_lighting' },
}

export const SpoofDetected: Story = {
  name: 'Spoof detected',
  args: { state: 'spoof_detected' },
}

export const MaxRetries: Story = {
  name: 'Max retries',
  args: { state: 'max_retries', maxAttempts: 3, playerEmail: 'player@example.com' },
}

export const Timeout: Story = { args: { state: 'timeout' } }

/* ── Gallery ── */

const GALLERY: readonly LivenessState[] = [
  'instructions',
  'searching',
  'detected',
  'challenge',
  'processing',
  'passed',
  'poor_lighting',
  'spoof_detected',
  'max_retries',
  'timeout',
]

export const StateGallery: Story = {
  name: 'State gallery',
  parameters: { layout: 'padded' },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: 28,
        padding: 24,
        background: 'var(--sdk-bg-tertiary)',
        minHeight: '100vh',
        boxSizing: 'border-box',
        alignItems: 'start',
        justifyItems: 'center',
        fontFamily: 'var(--sdk-font)',
      }}
    >
      {GALLERY.map((s) => (
        <div key={s} style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--sdk-text-tertiary)',
            }}
          >
            {s.replace('_', ' ')}
          </div>
          <LivenessProbeWidget
            state={s}
            challengeDirection="left"
            attemptNumber={1}
            maxAttempts={2}
            playerEmail="player@example.com"
            confidence={{ liveness: 96, faceMatch: 92, spoofDetection: 99 }}
          />
        </div>
      ))}
    </div>
  ),
}
