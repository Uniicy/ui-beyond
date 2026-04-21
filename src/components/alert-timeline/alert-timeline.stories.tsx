import type { Meta, StoryObj } from '@storybook/react'
import { AlertTimeline, type AlertTimelineItem } from './alert-timeline'

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString()
}
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}

const currentAgent = { name: 'Sarah Klein', id: 'a-1' }

const mixedItems: AlertTimelineItem[] = [
  {
    id: 'tl-1',
    type: 'note_added',
    agent: { name: 'Sarah Klein', id: 'a-1' },
    timestamp: minutesAgo(5),
    content: 'Checked OASIS — no match found. Deposits originated from verified Trustly account. Requesting additional source-of-funds documentation from the player.',
  },
  {
    id: 'tl-2',
    type: 'status_changed',
    agent: { name: 'Max Mustermann', id: 'a-2' },
    timestamp: minutesAgo(30),
    metadata: { previousStatus: 'Open', newStatus: 'Investigating' },
  },
  {
    id: 'tl-3',
    type: 'assigned',
    agent: { name: 'Max Mustermann', id: 'a-2' },
    timestamp: minutesAgo(32),
    content: 'Assigned to Sarah Klein',
  },
  {
    id: 'tl-4',
    type: 'escalated',
    agent: { name: 'Lisa Hoffmann', id: 'a-3' },
    timestamp: hoursAgo(1),
    content: 'Escalated due to cumulative deposit amount exceeding \u20ac500 threshold in 24h.',
  },
  {
    id: 'tl-5',
    type: 'created',
    agent: { name: 'System', id: 'system' },
    timestamp: hoursAgo(1.5),
    content: 'Alert triggered by AML rule: rapid_deposit_sequence',
  },
]

const longNote: AlertTimelineItem[] = [
  {
    id: 'tl-long',
    type: 'note_added',
    agent: { name: 'Sarah Klein', id: 'a-1' },
    timestamp: minutesAgo(10),
    content: 'Detailed investigation: Player has been active for 14 months with no prior alerts. This is the first AML trigger. Transaction pattern shows 3 deposits of \u20ac200 each via Trustly within a 10-minute window at 14:22, 14:28, and 14:31 on 13 Apr 2026.\n\nSource of funds documentation requested via email. Player responded within 2 hours providing payslip and bank statement. Documents verified against employer records — legitimate salary income confirmed.\n\nRecommendation: dismiss alert, no SAR required. Pattern consistent with player funding account before a known racing event (Pferdewetten Gro\u00dfer Preis).',
  },
  {
    id: 'tl-long-2',
    type: 'created',
    agent: { name: 'System', id: 'system' },
    timestamp: hoursAgo(3),
  },
]

const emptyTimeline: AlertTimelineItem[] = [
  {
    id: 'tl-created',
    type: 'created',
    agent: { name: 'System', id: 'system' },
    timestamp: minutesAgo(2),
    content: 'Alert triggered by AML rule: rapid_deposit_sequence',
  },
]

const meta = {
  title: 'Components/AlertTimeline',
  component: AlertTimeline,
  args: {
    items: mixedItems,
    currentAgent,
    onAddNote: () => {},
  },
} satisfies Meta<typeof AlertTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const MixedTypes: Story = {}

export const LongNote: Story = {
  args: { items: longNote },
}

export const EmptyTimeline: Story = {
  args: { items: emptyTimeline },
}

export const Loading: Story = {
  args: { loading: true, items: [] },
}

/* ── Player timeline (cross-module) ── */

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString()
}

const playerTimeline: AlertTimelineItem[] = [
  { id: 'pt-1', type: 'rg_limit_reached', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(1), module: 'rg', content: 'Monthly deposit limit of \u20ac1,000 reached.' },
  { id: 'pt-2', type: 'aml_alert_created', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3), module: 'aml', content: 'Rapid deposit sequence — 3\u00d7 Trustly \u20ac200 in 10 min.' },
  { id: 'pt-3', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.1), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'pt-4', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.2), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'pt-5', type: 'deposit_completed', agent: { name: 'System', id: 'system' }, timestamp: hoursAgo(3.3), module: 'psp', content: '\u20ac200 via Trustly' },
  { id: 'pt-6', type: 'rg_limit_set', agent: { name: 'Thomas Huber', id: 'player' }, timestamp: daysAgo(3), module: 'rg', content: 'Set monthly deposit limit to \u20ac1,000' },
  { id: 'pt-7', type: 'kyc_approved', agent: { name: 'Sarah Klein', id: 'a-1' }, timestamp: daysAgo(5), module: 'kyc', content: 'Passport verified via Onfido. Confidence 94%.' },
  { id: 'pt-8', type: 'kyc_manual_review', agent: { name: 'Max Mustermann', id: 'a-2' }, timestamp: daysAgo(5.5), module: 'kyc' },
  { id: 'pt-9', type: 'login', agent: { name: 'Thomas Huber', id: 'player' }, timestamp: daysAgo(6), module: 'system' },
  { id: 'pt-10', type: 'player_created', agent: { name: 'System', id: 'system' }, timestamp: daysAgo(6), module: 'system', content: 'Account registered from DE market.' },
]

export const PlayerTimeline: Story = {
  args: { items: playerTimeline },
}
