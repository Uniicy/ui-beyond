import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RoutingRuleEditor } from './routing-rule-editor'
import type { RoutingRule } from '../routing-rule-card'

const threeRules: RoutingRule[] = [
  { id: 'r-1', priority: 1, name: 'High-value DE deposits', conditions: [{ field: 'amount', operator: 'greater_than', value: 500 }, { field: 'country', operator: 'in_list', value: ['DE'] }], targetProvider: 'trustly', active: true },
  { id: 'r-2', priority: 2, name: 'MU mobile payments', conditions: [{ field: 'country', operator: 'is', value: ['MU'] }], targetProvider: 'mcb_juice', active: true },
  { id: 'r-3', priority: 3, name: 'Low-value fallback', conditions: [{ field: 'amount', operator: 'less_than', value: 100 }], targetProvider: 'nuvei', active: false },
]

const providers = ['trustly', 'nuvei', 'paysafe', 'mcb_juice', 'zimpler', 'paypal']

const meta = {
  title: 'Components/RoutingRuleEditor',
  component: RoutingRuleEditor,
  args: { rules: threeRules, onRulesChange: () => {}, onSave: async () => { await new Promise((r) => setTimeout(r, 1000)) }, onDiscard: () => {}, providers, isDirty: false },
} satisfies Meta<typeof RoutingRuleEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Saved: Story = {}

export const Dirty: Story = {
  args: { isDirty: true },
}

export const Editing: Story = {
  render: (args) => {
    const [rules, setRules] = useState<RoutingRule[]>([...threeRules])
    return <RoutingRuleEditor {...args} rules={rules} onRulesChange={setRules} isDirty />
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 200))
    const editBtns = canvasElement.querySelectorAll('[aria-label="Edit"]')
    if (editBtns[0] instanceof HTMLElement) editBtns[0].click()
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [rules, setRules] = useState<RoutingRule[]>([...threeRules])
    const [dirty, setDirty] = useState(false)
    return (
      <RoutingRuleEditor
        {...args}
        rules={rules}
        onRulesChange={(r) => { setRules(r); setDirty(true) }}
        isDirty={dirty}
        onSave={async () => { await new Promise((r) => setTimeout(r, 1000)); setDirty(false) }}
        onDiscard={() => { setRules([...threeRules]); setDirty(false) }}
      />
    )
  },
}

export const TestPanel: Story = {
  args: { isDirty: false },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 200))
    const toggle = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Test routing'))
    if (toggle instanceof HTMLElement) toggle.click()
  },
}

export const Empty: Story = {
  args: { rules: [] },
}
