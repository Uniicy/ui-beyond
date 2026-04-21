import type { Meta, StoryObj } from '@storybook/react'
import { RoutingRuleCard, type RoutingRule } from './routing-rule-card'

const activeRule: RoutingRule = { id: 'r-1', priority: 1, name: 'High-value DE deposits', conditions: [{ field: 'Amount', operator: '>', value: '\u20ac500' }, { field: 'Country', operator: '=', value: 'DE' }], targetProvider: 'Trustly', active: true }
const inactiveRule: RoutingRule = { id: 'r-2', priority: 2, name: 'Fallback Nuvei', conditions: [{ field: 'Amount', operator: '<=', value: '\u20ac500' }], targetProvider: 'Nuvei', active: false }
const longName: RoutingRule = { id: 'r-3', priority: 3, name: 'MU high-risk enhanced-CDD deposit threshold with multi-factor authentication requirement', conditions: [{ field: 'Market', operator: '=', value: 'MU' }, { field: 'Risk', operator: '>=', value: 'High' }], targetProvider: 'MCB Juice', active: true }

const meta = { title: 'Components/RoutingRuleCard', component: RoutingRuleCard, args: { rule: activeRule, onEdit: () => {}, onDelete: () => {}, onToggle: () => {} } } satisfies Meta<typeof RoutingRuleCard>
export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const Inactive: Story = { args: { rule: inactiveRule } }
export const Dragging: Story = { args: { isDragging: true } }
export const LongName: Story = { args: { rule: longName } }

export const RuleList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 700 }}>
      <RoutingRuleCard rule={activeRule} onEdit={() => {}} onDelete={() => {}} onToggle={() => {}} />
      <RoutingRuleCard rule={inactiveRule} onEdit={() => {}} onDelete={() => {}} onToggle={() => {}} />
      <RoutingRuleCard rule={longName} onEdit={() => {}} onDelete={() => {}} onToggle={() => {}} />
    </div>
  ),
  args: { rule: activeRule },
}
