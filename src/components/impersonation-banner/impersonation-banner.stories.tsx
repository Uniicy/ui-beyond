import type { Meta, StoryObj } from '@storybook/react'
import { ImpersonationBanner } from './impersonation-banner'

function secondsAgo(s: number): string { return new Date(Date.now() - s * 1000).toISOString() }

const meta = {
  title: 'Components/ImpersonationBanner',
  component: ImpersonationBanner,
  parameters: { layout: 'fullscreen' },
  args: { orgName: 'Tipico GmbH', agentName: 'Sarah Klein', sessionDurationSeconds: 1800, startedAt: secondsAgo(76), onEndSession: () => {}, onSessionExpired: () => {} },
} satisfies Meta<typeof ImpersonationBanner>

export default meta; type Story = StoryObj<typeof meta>

export const GreenZone: Story = {
  args: { startedAt: secondsAgo(76) },
  decorators: [(Story) => (<div style={{ paddingTop: 40 }}><Story /><div style={{ padding: 24, fontFamily: 'var(--ub-font-body)', color: 'var(--ub-color-on-surface)' }}>Page content pushed down 40px by banner</div></div>)],
}

export const YellowWarning: Story = {
  args: { startedAt: secondsAgo(1548) },
}

export const CriticalBlink: Story = {
  args: { startedAt: secondsAgo(1753) },
}

export const Expired: Story = {
  args: { startedAt: secondsAgo(1800) },
}

export const SuperimposedOnPage: Story = {
  args: { startedAt: secondsAgo(300) },
  decorators: [(Story) => (
    <div>
      <Story />
      <div style={{ paddingTop: 40, minHeight: '100vh', background: 'var(--ub-color-surface)' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '0.5px solid var(--ub-ghost-border)', fontFamily: 'var(--ub-font-body)', fontSize: 15, fontWeight: 500, color: 'var(--ub-color-on-surface)' }}>Admin Dashboard (impersonated)</div>
        <div style={{ padding: '24px 32px' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ height: 48, marginBottom: 8, borderRadius: 8, background: 'var(--ub-color-surface-container-low)', display: 'flex', alignItems: 'center', paddingLeft: 16, fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface-variant)' }}>Content row {i + 1}</div>
          ))}
        </div>
      </div>
    </div>
  )],
}

export const EndSessionClick: Story = {
  args: { startedAt: secondsAgo(600) },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500))
    const btn = Array.from(canvasElement.ownerDocument.querySelectorAll('button')).find((b) => b.textContent?.includes('End session'))
    btn?.click()
  },
}
