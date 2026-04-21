import type { Meta, StoryObj } from '@storybook/react'
import { ExclusionCard, ExclusionList, type Exclusion } from './exclusion-card'

const activeOasis: Exclusion = {
  id: 'ex-001',
  source: 'player',
  duration: '1_year',
  appliedAt: '2026-04-11T10:00:00Z',
  expiresAt: '2027-04-11T10:00:00Z',
  oasisRef: 'OASIS-DE-882211',
  status: 'active',
}

const activeIndefinite: Exclusion = {
  id: 'ex-002',
  source: 'operator',
  duration: 'indefinite',
  appliedAt: '2026-03-01T08:00:00Z',
  status: 'active',
}

const expired: Exclusion = {
  id: 'ex-003',
  source: 'player',
  duration: '3_months',
  appliedAt: '2025-06-01T10:00:00Z',
  expiresAt: '2025-09-01T10:00:00Z',
  oasisRef: 'OASIS-DE-771100',
  status: 'expired',
}

const lifted: Exclusion = {
  id: 'ex-004',
  source: 'oasis',
  duration: '6_months',
  appliedAt: '2025-01-15T08:00:00Z',
  expiresAt: '2025-07-15T08:00:00Z',
  liftedAt: '2025-06-15T14:00:00Z',
  oasisRef: 'OASIS-DE-660088',
  status: 'lifted',
}

const meta = {
  title: 'Components/ExclusionCard',
  component: ExclusionCard,
  args: {
    exclusion: activeOasis,
    onLift: () => {},
  },
} satisfies Meta<typeof ExclusionCard>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveSelfExclusion: Story = {}

export const ActiveIndefinite: Story = {
  args: { exclusion: activeIndefinite },
}

export const Expired: Story = {
  args: { exclusion: expired },
}

export const Lifted: Story = {
  args: { exclusion: lifted },
}

export const LiftConfirmation: Story = {
  play: async ({ canvasElement }) => {
    const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Lift exclusion'))
    btn?.click()
  },
}

export const List: Story = {
  render: () => (
    <ExclusionList
      exclusions={[
        { exclusion: activeOasis, onLift: () => {} },
        { exclusion: expired },
        { exclusion: lifted },
      ]}
    />
  ),
}
