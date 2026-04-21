import { type HTMLAttributes } from 'react'
import { IconButton } from '../icon-button'
import styles from './routing-rule-card.module.css'

interface Condition {
  readonly field: string
  readonly operator: string
  readonly value: string | string[] | number
}

export interface RoutingRule {
  readonly id: string
  readonly priority: number
  readonly name: string
  readonly conditions: ReadonlyArray<Condition>
  readonly targetProvider: string
  readonly active: boolean
}

export interface RoutingRuleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  readonly rule: RoutingRule
  readonly onEdit: (id: string) => void
  readonly onDelete: (id: string) => void
  readonly onToggle: (id: string, active: boolean) => void
  readonly isDragging?: boolean
  readonly dragHandleProps?: Record<string, unknown>
}

const EditIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 2.5l2.5 2.5M4 13l-1.5.5.5-1.5L10.5 4.5l2.5 2.5L5.5 14.5" /></svg>)
const TrashIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M6 4V3h4v1M5 4v8.5h6V4" /></svg>)

function buildSummary(conditions: ReadonlyArray<Condition>, target: string): string {
  const parts = conditions.map((c) => {
    const val = Array.isArray(c.value) ? c.value.join(', ') : String(c.value)
    return `${c.field} ${c.operator} ${val}`
  })
  return `${parts.join(' AND ')} \u2192 ${target}`
}

export function RoutingRuleCard({ rule: r, onEdit, onDelete, onToggle, isDragging = false, dragHandleProps, className, ...props }: RoutingRuleCardProps) {
  const cardCls = [
    styles['card'],
    !r.active ? styles['inactive'] : undefined,
    isDragging ? styles['dragging'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cardCls} {...props}>
      <div className={styles['grip']} {...(dragHandleProps ?? {})}>
        {[0, 1, 2].map((i) => (<div key={i} className={styles['gripRow']}><span className={styles['gripDot']} /><span className={styles['gripDot']} /></div>))}
      </div>

      <span className={styles['priority']}>{r.priority}</span>

      <div className={styles['content']}>
        <span className={styles['ruleName']}>{r.name}</span>
        <span className={styles['conditionSummary']}>{buildSummary(r.conditions, r.targetProvider)}</span>
      </div>

      <button type="button" className={`${styles['toggle']} ${r.active ? styles['toggleOn'] : styles['toggleOff']}`} onClick={() => onToggle(r.id, !r.active)} aria-label={r.active ? 'Deactivate' : 'Activate'}>
        <span className={styles['toggleKnob']} />
      </button>

      <div className={styles['actions']}>
        <IconButton icon={EditIcon} label="Edit" size="sm" variant="ghost" onClick={() => onEdit(r.id)} />
        <IconButton icon={TrashIcon} label="Delete" size="sm" variant="ghost" intent="danger" onClick={() => onDelete(r.id)} />
      </div>
    </div>
  )
}
