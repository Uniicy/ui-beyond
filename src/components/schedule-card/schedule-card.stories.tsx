import type { Meta, StoryObj } from '@storybook/react'
import { ScheduleCard, type Schedule } from './schedule-card'

function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const base: Schedule = {
  id: 'sch-1',
  reportName: 'Monthly AML Activity Report',
  frequency: 'monthly',
  nextRunAt: daysFromNow(12),
  format: 'pdf',
  recipients: ['compliance@example.com'],
  active: true,
}

const meta = {
  title: 'Components/ScheduleCard',
  component: ScheduleCard,
  args: {
    schedule: base,
    onToggleActive: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof ScheduleCard>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveDaily: Story = {
  args: { schedule: { ...base, id: 'sch-d', frequency: 'daily', nextRunAt: daysFromNow(1) } },
}

export const ActiveMonthly: Story = {}

export const ActiveQuarterly: Story = {
  args: { schedule: { ...base, id: 'sch-q', frequency: 'quarterly', nextRunAt: daysFromNow(45), format: 'both' } },
}

export const Paused: Story = {
  args: { schedule: { ...base, active: false } },
}

export const RecipientsOverflow: Story = {
  args: {
    schedule: {
      ...base,
      recipients: ['compliance@example.com', 'legal@example.com', 'coo@example.com'],
    },
  },
}

export const StackedList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 720 }}>
      <ScheduleCard schedule={base} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />
      <ScheduleCard schedule={{ ...base, id: 'sch-2', reportName: 'KYC Summary', frequency: 'weekly', nextRunAt: daysFromNow(3), format: 'csv', recipients: ['kyc-team@example.com'] }} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />
      <ScheduleCard schedule={{ ...base, id: 'sch-3', reportName: 'CEMS Transaction Report', frequency: 'daily', nextRunAt: daysFromNow(1), format: 'both', recipients: ['mra@gov.mu', 'finance@example.com'] }} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />
      <ScheduleCard schedule={{ ...base, id: 'sch-4', reportName: 'Quarterly Risk Review', frequency: 'quarterly', nextRunAt: daysFromNow(60), active: false }} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />
    </div>
  ),
}
