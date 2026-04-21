import type { Meta, StoryObj } from '@storybook/react'
import { KycUploadWidget, type KycUploadState } from './KycUploadWidget'

const meta = {
  title: 'SDK/KycUploadWidget',
  component: KycUploadWidget,
  parameters: {
    layout: 'centered',
  },
  args: {
    state: 'prompt',
    playerEmail: 'player@example.com',
  },
} satisfies Meta<typeof KycUploadWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Prompt: Story = {
  args: { state: 'prompt' },
}

export const Upload: Story = {
  args: { state: 'upload', documentType: 'passport' },
}

export const Processing: Story = {
  args: { state: 'processing' },
}

export const Approved: Story = {
  args: { state: 'approved' },
}

export const Rejected: Story = {
  args: {
    state: 'rejected',
    rejectionReason: 'The photo was blurry. Please retake in good lighting.',
  },
}

export const ManualReview: Story = {
  name: 'Manual review',
  args: {
    state: 'manual_review',
    playerEmail: 'player@example.com',
  },
}

/* ── Gallery: all six states side by side ── */

const GALLERY_STATES: readonly KycUploadState[] = [
  'prompt',
  'upload',
  'processing',
  'approved',
  'rejected',
  'manual_review',
]

export const StateGallery: Story = {
  name: 'State gallery',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 24,
        padding: 24,
        fontFamily: 'var(--sdk-font)',
        background: 'var(--sdk-bg-tertiary)',
        minHeight: '100vh',
        boxSizing: 'border-box',
        alignItems: 'start',
        justifyItems: 'center',
      }}
    >
      {GALLERY_STATES.map((s) => (
        <div key={s} style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--sdk-text-tertiary)',
              fontFamily: 'var(--sdk-font)',
            }}
          >
            {s.replace('_', ' ')}
          </div>
          <KycUploadWidget
            state={s}
            playerEmail="player@example.com"
            rejectionReason="The photo was blurry. Please retake in good lighting."
            documentType="passport"
          />
        </div>
      ))}
    </div>
  ),
}
