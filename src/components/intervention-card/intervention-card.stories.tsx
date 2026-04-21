import type { Meta, StoryObj } from '@storybook/react'
import { InterventionCard, type Intervention } from './intervention-card'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const affordability: Intervention = {
  id: 'iv-001', type: 'affordability_nudge',
  player: { id: 'usr_1a4d', name: 'Thomas Huber' },
  triggeredBy: 'system', sentAt: hoursAgo(3),
  outcome: 'pending',
}

const limitSuggestion: Intervention = {
  id: 'iv-002', type: 'deposit_limit_suggestion',
  player: { id: 'usr_2b5e', name: 'Anna Fischer' },
  triggeredBy: 'agent', agentName: 'Sarah Klein',
  sentAt: hoursAgo(6), outcome: 'accepted',
  outcomeAt: hoursAgo(4),
  note: 'Player deposit velocity is 3x above average for their segment. Suggesting monthly limit of \u20ac500.',
}

const realityCheck: Intervention = {
  id: 'iv-003', type: 'reality_check',
  player: { id: 'usr_3c6f', name: 'Klaus Wagner' },
  triggeredBy: 'system', sentAt: hoursAgo(12),
  outcome: 'dismissed', outcomeAt: hoursAgo(11),
}

const coolingOff: Intervention = {
  id: 'iv-004', type: 'cooling_off_suggestion',
  player: { id: 'usr_4d7g', name: 'Lisa Bauer' },
  triggeredBy: 'agent', agentName: 'Max Mustermann',
  sentAt: hoursAgo(48), outcome: 'expired', outcomeAt: hoursAgo(24),
}

const panicButton: Intervention = {
  id: 'iv-005', type: 'panic_button',
  player: { id: 'usr_5e8h', name: 'Peter Schmidt' },
  triggeredBy: 'system', sentAt: minutesAgo(15),
  outcome: 'accepted', outcomeAt: minutesAgo(14),
  note: 'Player triggered panic button from mobile app. Self-exclusion 6 months applied immediately.',
}

const meta = {
  title: 'Components/InterventionCard',
  component: InterventionCard,
  args: {
    intervention: affordability,
    onViewPlayer: () => {},
  },
} satisfies Meta<typeof InterventionCard>

export default meta
type Story = StoryObj<typeof meta>

export const AffordabilityNudge: Story = {}

export const LimitSuggestion: Story = {
  args: { intervention: limitSuggestion },
}

export const RealityCheck: Story = {
  args: { intervention: realityCheck },
}

export const CoolingOff: Story = {
  args: { intervention: coolingOff },
}

export const PanicButton: Story = {
  args: { intervention: panicButton },
}

export const ExpandedWithNote: Story = {
  args: { intervention: limitSuggestion },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[class*="card"]') as HTMLElement | null
    card?.click()
  },
}

export const CompactList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 560 }}>
      <InterventionCard intervention={panicButton} onViewPlayer={() => {}} />
      <InterventionCard intervention={affordability} onViewPlayer={() => {}} />
      <InterventionCard intervention={limitSuggestion} onViewPlayer={() => {}} />
      <InterventionCard intervention={realityCheck} onViewPlayer={() => {}} />
      <InterventionCard intervention={coolingOff} onViewPlayer={() => {}} />
    </div>
  ),
  args: { intervention: affordability },
}
