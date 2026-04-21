import type { Meta, StoryObj } from '@storybook/react'
import { WidgetShell } from './WidgetShell'
import { StatusDot } from '../../components/status-dot'

const meta = {
  title: 'SDK/WidgetShell',
  component: WidgetShell,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Verify your identity',
    children: 'Widget body content.',
  },
} satisfies Meta<typeof WidgetShell>

export default meta
type Story = StoryObj<typeof meta>

const primaryButtonStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--sdk-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--sdk-radius-md)',
  fontFamily: 'var(--sdk-font)',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
} as const

export const Default: Story = {
  args: {
    title: 'Verify your identity',
    children: 'Complete the verification flow to continue.',
  },
}

export const WithHeaderRightSlot: Story = {
  name: 'With header right slot',
  args: {
    title: 'Verify your identity',
    headerRight: <StatusDot status="pending" size="sm" />,
    children: 'Header right slot holds a status indicator.',
  },
}

export const WithFooter: Story = {
  name: 'With footer',
  args: {
    title: 'Verify your identity',
    children: 'A primary CTA is rendered in the footer slot.',
    footer: (
      <button type="button" style={primaryButtonStyle}>
        Continue
      </button>
    ),
  },
}

export const BodyOnly: Story = {
  name: 'Body only',
  args: {
    title: undefined,
    children: (
      <div>
        <strong style={{ display: 'block', marginBottom: 6 }}>
          No header chrome
        </strong>
        <span style={{ color: 'var(--sdk-text-tertiary)', fontSize: 12 }}>
          Only the body and the branding row are rendered.
        </span>
      </div>
    ),
  },
}

export const Loading: Story = {
  args: {
    title: 'Verify your identity',
    loading: true,
    children: null,
  },
}

export const LongBody: Story = {
  name: 'Long body',
  args: {
    title: 'Terms of verification',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <p key={i} style={{ margin: 0, lineHeight: 1.5 }}>
            Paragraph {i + 1}: the card should grow vertically to fit this
            content without introducing an inner scrollbar. Branding row stays
            pinned to the bottom of the card.
          </p>
        ))}
      </div>
    ),
    footer: (
      <button type="button" style={primaryButtonStyle}>
        I agree
      </button>
    ),
  },
}
