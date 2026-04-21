import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SelfExclusionWidget, type OasisReason } from './SelfExclusionWidget'

const meta = {
  title: 'SDK/SelfExclusionWidget',
  component: SelfExclusionWidget,
  parameters: { layout: 'centered' },
  args: {
    state: 'idle',
    playerName: 'Thomas',
  },
} satisfies Meta<typeof SelfExclusionWidget>

export default meta
type Story = StoryObj<typeof meta>

export const IdleFull: Story = {
  name: 'Idle — full variant',
  args: { state: 'idle', variant: 'full', playerName: 'Thomas' },
}

export const IdleCompact: Story = {
  name: 'Idle — compact variant',
  args: { state: 'idle', variant: 'compact', playerName: 'Thomas' },
  decorators: [
    (Story) => (
      <div
        style={{
          height: 48,
          width: 760,
          background: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 20px',
          borderRadius: 6,
          fontFamily: 'var(--sdk-font)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 12,
          gap: 20,
        }}
      >
        <span style={{ marginRight: 'auto', color: 'rgba(255,255,255,0.5)' }}>
          ACMESports · navigation
        </span>
        <Story />
      </div>
    ),
  ],
}

export const ConfirmNoSelection: Story = {
  name: 'Confirm — no duration selected',
  args: { state: 'confirm', selectedDuration: undefined },
}

export const ConfirmOneYear: Story = {
  name: 'Confirm — 1 year selected',
  args: { state: 'confirm', selectedDuration: '1_year' },
}

export const AppliedOneYear: Story = {
  name: 'Applied — 1 year',
  args: {
    state: 'applied',
    exclusionRef: 'OASIS-DE-882211',
    exclusionExpiry: '2027-04-11',
    remainingBalance: 240,
    currency: 'EUR',
    crisisHelpline: { name: 'BZgA', number: '0800 1372700' },
  },
}

export const AppliedIndefinite: Story = {
  name: 'Applied — indefinite',
  args: {
    state: 'applied',
    exclusionRef: 'OASIS-DE-999044',
  },
}

export const AppliedOnWhitePage: Story = {
  name: 'Applied — on white page bg',
  args: {
    state: 'applied',
    exclusionRef: 'OASIS-DE-882211',
    exclusionExpiry: '2027-04-11',
    remainingBalance: 240,
    currency: 'EUR',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#ffffff',
          padding: 48,
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

/* ── OASIS reason variants (German GGL scope) ── */

export const ConfirmOasisEmpty: Story = {
  name: 'Confirm — OASIS reasons (empty)',
  args: {
    state: 'confirm',
    selectedDuration: '1_year',
    requireReason: true,
    selectedReasons: [],
  },
  render: (args) => {
    function Harness() {
      const [rs, setRs] = useState<readonly OasisReason[]>([])
      return (
        <SelfExclusionWidget
          {...args}
          selectedReasons={rs}
          onReasonsChange={(next) => setRs(next as readonly OasisReason[])}
        />
      )
    }
    return <Harness />
  },
}

export const ConfirmOasisSelected: Story = {
  name: 'Confirm — OASIS reasons (2 selected)',
  args: {
    state: 'confirm',
    selectedDuration: '1_year',
    requireReason: true,
    selectedReasons: ['problem_gambling', 'financial_burden'],
  },
  render: (args) => {
    function Harness() {
      const [rs, setRs] = useState<readonly OasisReason[]>(
        args.selectedReasons ?? [],
      )
      return (
        <SelfExclusionWidget
          {...args}
          selectedReasons={rs}
          onReasonsChange={(next) => setRs(next as readonly OasisReason[])}
        />
      )
    }
    return <Harness />
  },
}

export const ConfirmOasisIndefinite: Story = {
  name: 'Confirm — OASIS indefinite + all reasons',
  args: {
    state: 'confirm',
    selectedDuration: 'indefinite',
    requireReason: true,
    selectedReasons: [
      'problem_gambling',
      'financial_burden',
      'too_much_time',
      'health',
    ],
  },
  render: (args) => {
    function Harness() {
      const [rs, setRs] = useState<readonly OasisReason[]>(
        args.selectedReasons ?? [],
      )
      return (
        <SelfExclusionWidget
          {...args}
          selectedReasons={rs}
          onReasonsChange={(next) => setRs(next as readonly OasisReason[])}
        />
      )
    }
    return <Harness />
  },
}
