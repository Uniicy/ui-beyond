import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ConditionBuilder, type Condition } from './condition-builder'

const empty: Condition[] = []
const oneCondition: Condition[] = [{ id: 'c1', field: 'amount', operator: 'greater_than', value: 500 }]
const threeConditions: Condition[] = [
  { id: 'c1', field: 'amount', operator: 'greater_than', value: 500 },
  { id: 'c2', field: 'country', operator: 'in_list', value: ['DE', 'MU'] },
  { id: 'c3', field: 'payment_method', operator: 'is', value: ['trustly'] },
]
const incomplete: Condition[] = [{ id: 'c1', field: 'amount', operator: 'greater_than', value: '' }]
const betweenCondition: Condition[] = [{ id: 'c1', field: 'amount', operator: 'between', value: '100,500' }]
const providerChips: Condition[] = [{ id: 'c1', field: 'payment_method', operator: 'in_list', value: ['trustly', 'nuvei', 'paysafe'] }]

const meta = {
  title: 'Components/ConditionBuilder',
  component: ConditionBuilder,
  args: { conditions: empty, onChange: () => {}, conjunctionMode: 'AND', onConjunctionChange: () => {} },
} satisfies Meta<typeof ConditionBuilder>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const OneCondition: Story = { args: { conditions: oneCondition } }
export const ThreeConditionsAnd: Story = { args: { conditions: threeConditions } }
export const OrMode: Story = { args: { conditions: threeConditions, conjunctionMode: 'OR' } }
export const Incomplete: Story = { args: { conditions: incomplete } }
export const BetweenOperator: Story = { args: { conditions: betweenCondition } }
export const ProviderChips: Story = { args: { conditions: providerChips } }

export const Interactive: Story = {
  render: () => {
    const [conditions, setConditions] = useState<Condition[]>(threeConditions)
    const [conj, setConj] = useState<'AND' | 'OR'>('AND')
    return <ConditionBuilder conditions={conditions} onChange={setConditions} conjunctionMode={conj} onConjunctionChange={setConj} />
  },
}
