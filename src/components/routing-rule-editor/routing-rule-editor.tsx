import { useState, useCallback } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '../button'
import { ConditionBuilder, type Condition } from '../condition-builder'
import { EmptyState } from '../empty-state'
import { ProviderBadge } from '../provider-badge'
import { RoutingRuleCard, type RoutingRule } from '../routing-rule-card'
import styles from './routing-rule-editor.module.css'

export interface RoutingRuleEditorProps {
  readonly rules: ReadonlyArray<RoutingRule>
  readonly onRulesChange: (rules: RoutingRule[]) => void
  readonly onSave: (rules: RoutingRule[]) => Promise<void>
  readonly onDiscard: () => void
  readonly providers: ReadonlyArray<string>
  readonly isDirty: boolean
  readonly className?: string
}

let nextId = 100

function SortableRule({ rule, editingId, onEdit, onDelete, onToggle }: {
  rule: RoutingRule; editingId: string | null
  onEdit: (id: string) => void; onDelete: (id: string) => void; onToggle: (id: string, active: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id })
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }

  if (editingId === rule.id) return null // rendered separately as edit panel

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <RoutingRuleCard rule={rule} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} isDragging={isDragging} dragHandleProps={listeners} />
    </div>
  )
}

export function RoutingRuleEditor({ rules, onRulesChange, onSave, onDiscard, providers, isDirty, className }: RoutingRuleEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editConditions, setEditConditions] = useState<Condition[]>([])
  const [editConj, setEditConj] = useState<'AND' | 'OR'>('AND')
  const [editTarget, setEditTarget] = useState('')
  const [saving, setSaving] = useState(false)
  const [testOpen, setTestOpen] = useState(false)
  const [testAmount, setTestAmount] = useState('')
  const [testCountry, setTestCountry] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)

  const activeCount = rules.filter((r) => r.active).length

  const startEdit = useCallback((id: string) => {
    const rule = rules.find((r) => r.id === id)
    if (rule === undefined) return
    setEditingId(id)
    setEditName(rule.name)
    setEditConditions(rule.conditions.map((c, i) => ({ id: `ec_${i}`, field: c.field as Condition['field'], operator: c.operator, value: c.value as Condition['value'] })))
    setEditConj('AND')
    setEditTarget(rule.targetProvider)
  }, [rules])

  const cancelEdit = () => setEditingId(null)

  const saveEdit = () => {
    if (editingId === null) return
    onRulesChange([...rules].map((r) => r.id === editingId ? { ...r, name: editName, conditions: editConditions, targetProvider: editTarget } : r))
    setEditingId(null)
  }

  const addRule = () => {
    const id = `rule_${nextId++}`
    const newRule: RoutingRule = { id, priority: rules.length + 1, name: '', conditions: [], targetProvider: providers[0] ?? '', active: true }
    onRulesChange([...rules, newRule])
    startEdit(id)
    setEditName('')
  }

  const deleteRule = useCallback((id: string) => {
    onRulesChange([...rules].filter((r) => r.id !== id).map((r, i) => ({ ...r, priority: i + 1 })))
    if (editingId === id) setEditingId(null)
  }, [rules, onRulesChange, editingId])

  const toggleRule = useCallback((id: string, active: boolean) => {
    onRulesChange([...rules].map((r) => r.id === id ? { ...r, active } : r))
  }, [rules, onRulesChange])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over === null || active.id === over.id) return
    const oldIndex = rules.findIndex((r) => r.id === active.id)
    const newIndex = rules.findIndex((r) => r.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove([...rules], oldIndex, newIndex).map((r, i) => ({ ...r, priority: i + 1 }))
    onRulesChange(reordered)
  }, [rules, onRulesChange])

  const handleSave = async () => {
    setSaving(true)
    await onSave([...rules])
    setSaving(false)
  }

  const runTest = () => {
    const amt = Number(testAmount) || 0
    for (const rule of [...rules].filter((r) => r.active).sort((a, b) => a.priority - b.priority)) {
      const matches = rule.conditions.every((c) => {
        if (c.field === 'amount' && c.operator === 'greater_than') return amt > Number(c.value)
        if (c.field === 'amount' && c.operator === 'less_than') return amt < Number(c.value)
        if (c.field === 'country' && c.operator === 'is' && Array.isArray(c.value)) return c.value.includes(testCountry)
        if (c.field === 'country' && c.operator === 'in_list' && Array.isArray(c.value)) return c.value.includes(testCountry)
        return true
      })
      if (matches && rule.conditions.length > 0) {
        setTestResult(`Rule ${rule.priority} matches: ${rule.name} \u2192 ${rule.targetProvider}`)
        return
      }
    }
    setTestResult('No rule matches \u2014 default route applies.')
  }

  const wrapperCls = [styles['wrapper'], className].filter(Boolean).join(' ')

  if (rules.length === 0 && editingId === null) {
    return (
      <div className={wrapperCls}>
        <EmptyState variant="no-data" title="No routing rules" description="Transactions will use the default provider. Add a rule to start routing by condition." action={{ label: 'Add first rule \u2192', onClick: addRule }} />
      </div>
    )
  }

  return (
    <div className={wrapperCls}>
      {/* Header */}
      <div className={styles['header']}>
        <div className={styles['headerLeft']}>
          <span className={styles['headerTitle']}>Routing rules</span>
          <span className={styles['headerCount']}>({activeCount} rules active)</span>
        </div>
        <div className={styles['headerRight']}>
          <span className={styles['statusLabel']}>
            <span className={`${styles['statusDot']} ${isDirty ? styles['statusDirty'] : styles['statusSaved']}`} />
            {isDirty ? 'Unsaved changes' : 'All rules saved'}
          </span>
          {isDirty && (
            <>
              <Button variant="ghost" size="sm" onClick={onDiscard}>Discard</Button>
              <Button variant="primary" size="sm" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save rules'}</Button>
            </>
          )}
        </div>
      </div>

      {/* Rule list */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rules.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className={styles['ruleList']}>
            {rules.map((rule) => (
              editingId === rule.id ? (
                <div key={rule.id} className={styles['editPanel']}>
                  <div className={styles['editField']}>
                    <span className={styles['editLabel']}>Rule name</span>
                    <input className={styles['editInput']} value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                  </div>
                  <div className={styles['editField']}>
                    <span className={styles['editLabel']}>Conditions</span>
                    <ConditionBuilder conditions={editConditions} onChange={setEditConditions} conjunctionMode={editConj} onConjunctionChange={setEditConj} />
                  </div>
                  <div className={styles['editField']}>
                    <span className={styles['editLabel']}>Target provider</span>
                    <select className={styles['editSelect']} value={editTarget} onChange={(e) => setEditTarget(e.target.value)}>
                      {providers.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className={styles['editActions']}>
                    <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={saveEdit}>Apply</Button>
                  </div>
                </div>
              ) : (
                <SortableRule key={rule.id} rule={rule} editingId={editingId} onEdit={startEdit} onDelete={deleteRule} onToggle={toggleRule} />
              )
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button type="button" className={styles['addBtn']} onClick={addRule}>+ Add rule</button>

      {/* Test panel */}
      <div className={styles['testPanel']}>
        <button type="button" className={styles['testToggle']} onClick={() => setTestOpen((p) => !p)}>
          {testOpen ? '\u25B4' : '\u25BE'} Test routing
        </button>
        {testOpen && (
          <div className={styles['testContent']}>
            <div className={styles['testInputs']}>
              <input className={styles['testInput']} type="number" placeholder="Amount (\u20ac)" value={testAmount} onChange={(e) => setTestAmount(e.target.value)} />
              <input className={styles['testInput']} type="text" placeholder="Country (DE)" value={testCountry} onChange={(e) => setTestCountry(e.target.value.toUpperCase())} />
              <Button variant="secondary" size="sm" onClick={runTest}>Test</Button>
            </div>
            {testResult !== null && (
              <div className={styles['testResult']}>
                <span className={testResult.includes('matches') ? styles['testMatch'] : styles['testNoMatch']}>{testResult}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
