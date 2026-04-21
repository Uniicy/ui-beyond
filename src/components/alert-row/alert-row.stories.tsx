import type { Meta, StoryObj } from '@storybook/react'
import { AlertRow, type AmlAlert } from './alert-row'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}

const base: AmlAlert = {
  id: 'aml-001',
  ruleName: 'Rapid deposit sequence',
  alertType: 'Transaction monitoring',
  status: 'open',
  severity: 'high',
  player: { id: 'P-1842', name: 'Thomas Huber' },
  riskScore: 82,
  totalAmount: 60000,
  currency: 'EUR',
  transactionCount: 3,
  assignedAgent: { id: 'a-1', name: 'Sarah Klein' },
  createdAt: hoursAgo(2),
}

const meta = {
  title: 'Components/AlertRow',
  component: AlertRow,
  args: {
    alert: base,
    onSelect: () => {},
    onClick: () => {},
    onAction: () => {},
  },
} satisfies Meta<typeof AlertRow>

export default meta
type Story = StoryObj<typeof meta>

/* ── Severity variants ── */

export const Critical: Story = {
  args: { alert: { ...base, id: 'aml-c', severity: 'critical', riskScore: 95, ruleName: 'Structuring detected' } },
}

export const High: Story = {
  args: { alert: base },
}

export const Medium: Story = {
  args: { alert: { ...base, id: 'aml-m', severity: 'medium', riskScore: 55, totalAmount: 25000, ruleName: 'Unusual withdrawal pattern' } },
}

export const Low: Story = {
  args: { alert: { ...base, id: 'aml-l', severity: 'low', riskScore: 18, totalAmount: 8000, ruleName: 'Velocity threshold' } },
}

/* ── Status variants ── */

export const Open: Story = {
  args: { alert: { ...base, status: 'open' } },
}

export const Investigating: Story = {
  args: { alert: { ...base, status: 'investigating' } },
}

export const Escalated: Story = {
  args: { alert: { ...base, status: 'escalated', severity: 'critical', riskScore: 94 } },
}

export const Dismissed: Story = {
  args: { alert: { ...base, status: 'dismissed', severity: 'low', riskScore: 12 } },
}

/* ── States ── */

export const Selected: Story = {
  args: { selected: true },
}

export const Unassigned: Story = {
  args: { alert: { ...base, assignedAgent: undefined } },
}

/* ── Realistic row ── */

export const Realistic: Story = {
  args: {
    alert: {
      id: 'aml-100',
      ruleName: 'Rapid deposit sequence',
      alertType: 'Transaction monitoring',
      status: 'investigating',
      severity: 'high',
      player: { id: 'P-1842', name: 'Thomas Huber' },
      riskScore: 82,
      totalAmount: 60000,
      currency: 'EUR',
      transactionCount: 3,
      assignedAgent: { id: 'a-1', name: 'Sarah Klein' },
      createdAt: hoursAgo(2),
    },
  },
}
