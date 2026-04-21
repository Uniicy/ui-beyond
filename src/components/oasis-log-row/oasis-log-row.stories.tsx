import type { Meta, StoryObj } from '@storybook/react'
import { OasisLogRow, type OasisLogEntry } from './oasis-log-row'

function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }

const clearFast: OasisLogEntry = {
  id: 'oa-001', checkedAt: minutesAgo(5),
  player: { id: 'usr_1a4d', name: 'Thomas Huber' },
  result: 'clear', responseTimeMs: 182, sessionOutcome: 'allowed',
  market: 'de', checkId: 'chk_9a2f4b01',
}

const clearSlow: OasisLogEntry = {
  id: 'oa-002', checkedAt: minutesAgo(12),
  player: { id: 'usr_2b5e', name: 'Anna Fischer' },
  result: 'clear', responseTimeMs: 2400, sessionOutcome: 'allowed',
  market: 'de', checkId: 'chk_8b3e5c02',
}

const hitRef: OasisLogEntry = {
  id: 'oa-003', checkedAt: minutesAgo(8),
  player: { id: 'usr_3c6f', name: 'Klaus Wagner' },
  result: 'hit', oasisRef: 'OASIS-DE-882211', responseTimeMs: 340,
  sessionOutcome: 'blocked', market: 'de', checkId: 'chk_7c4d6d03',
}

const hitSlow: OasisLogEntry = {
  id: 'oa-004', checkedAt: minutesAgo(20),
  player: { id: 'usr_4d7g', name: 'Peter Schmidt' },
  result: 'hit', oasisRef: 'OASIS-DE-771100', responseTimeMs: 3100,
  sessionOutcome: 'blocked', market: 'de', checkId: 'chk_6d5e7e04',
}

const logEntries: OasisLogEntry[] = [
  { id: 'oa-l1', checkedAt: minutesAgo(2), player: { id: 'usr_a1', name: 'Lisa Hoffmann' }, result: 'clear', responseTimeMs: 145, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa01' },
  { id: 'oa-l2', checkedAt: minutesAgo(4), player: { id: 'usr_a2', name: 'Markus Weber' }, result: 'clear', responseTimeMs: 210, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa02' },
  { id: 'oa-l3', checkedAt: minutesAgo(6), player: { id: 'usr_a3', name: 'Julia Richter' }, result: 'clear', responseTimeMs: 390, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa03' },
  hitRef,
  { id: 'oa-l5', checkedAt: minutesAgo(10), player: { id: 'usr_a5', name: 'Stefan Koch' }, result: 'clear', responseTimeMs: 175, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa05' },
  { id: 'oa-l6', checkedAt: minutesAgo(14), player: { id: 'usr_a6', name: 'Claudia Schulz' }, result: 'clear', responseTimeMs: 520, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa06' },
  { id: 'oa-l7', checkedAt: minutesAgo(18), player: { id: 'usr_a7', name: 'Frank M\u00fcller' }, result: 'clear', responseTimeMs: 198, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa07' },
  { id: 'oa-l8', checkedAt: minutesAgo(22), player: { id: 'usr_a8', name: 'Ingrid Braun' }, result: 'clear', responseTimeMs: 165, sessionOutcome: 'allowed', market: 'de', checkId: 'chk_aa08' },
]

const meta = {
  title: 'Components/OasisLogRow',
  component: OasisLogRow,
  parameters: {
    docs: {
      description: {
        component: 'OASIS check log row. This component only renders for **market-de** brands — OASIS is the German national exclusion register. Timestamps are exact (not relative) per regulatory audit requirements.',
      },
    },
  },
  args: {
    entry: clearFast,
    onViewPlayer: () => {},
  },
} satisfies Meta<typeof OasisLogRow>

export default meta
type Story = StoryObj<typeof meta>

export const ClearFast: Story = {}

export const ClearSlow: Story = {
  args: { entry: clearSlow },
}

export const HitWithRef: Story = {
  args: { entry: hitRef },
}

export const HitSlowResponse: Story = {
  args: { entry: hitSlow },
}

export const AuditLog: Story = {
  render: () => (
    <div>
      {logEntries.map((e) => (
        <OasisLogRow key={e.id} entry={e} onViewPlayer={() => {}} />
      ))}
    </div>
  ),
  args: { entry: clearFast },
}
