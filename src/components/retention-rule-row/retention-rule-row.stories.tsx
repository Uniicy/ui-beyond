import type { Meta, StoryObj } from '@storybook/react'
import { RetentionRuleRow, RetentionRulesPanel, type RetentionRule } from './retention-rule-row'

const locked: RetentionRule = { id: 'rr-1', category: 'AML transaction records', retentionPeriod: '5 years', regulatoryBasis: 'GwG \u00a78', storageSizeGb: 12.4, locked: true, currentRetentionDays: 1825 }
const unlocked: RetentionRule = { id: 'rr-2', category: 'Player session logs', retentionPeriod: '2 years', regulatoryBasis: 'GDPR Art.17', storageSizeGb: 8.2, locked: false, currentRetentionDays: 730 }
const allRules: RetentionRule[] = [
  locked,
  { id: 'rr-3', category: 'KYC verification documents', retentionPeriod: '7 years', regulatoryBasis: 'UKGC 7yr', storageSizeGb: 24.1, locked: true, currentRetentionDays: 2555 },
  unlocked,
  { id: 'rr-4', category: 'Responsible gaming interventions', retentionPeriod: '5 years', regulatoryBasis: 'GRA Act \u00a731', storageSizeGb: 3.8, locked: true, currentRetentionDays: 1825 },
  { id: 'rr-5', category: 'Marketing consent records', retentionPeriod: '1 year', regulatoryBasis: 'GDPR Art.7', storageSizeGb: 1.2, locked: false, currentRetentionDays: 365 },
]

const rowMeta = { title: 'Components/RetentionRuleRow', component: RetentionRuleRow, args: { rule: locked, onEdit: () => {} } } satisfies Meta<typeof RetentionRuleRow>
export default rowMeta
type Story = StoryObj<typeof rowMeta>

export const Locked: Story = {}
export const Unlocked: Story = { args: { rule: unlocked } }
export const EditMode: Story = { args: { rule: unlocked }, play: async ({ canvasElement }) => { const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Edit')); btn?.click() } }

export const Panel: Story = {
  render: () => <RetentionRulesPanel rules={allRules} totalStorageGb={49.7} quotaGb={73} onManualPurge={() => {}} onEditRule={() => {}} />,
  args: { rule: locked },
}
