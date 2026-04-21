import { useState, useRef, useEffect, useCallback } from 'react'
import { IconButton } from '../icon-button'
import { ProviderBadge } from '../provider-badge'
import styles from './condition-builder.module.css'

/* ── Types ── */

type ConditionField = 'amount' | 'country' | 'currency' | 'payment_method' | 'player_risk_tier'

export interface Condition {
  readonly id: string
  readonly field: ConditionField
  readonly operator: string
  readonly value: string | string[] | number
}

export interface ConditionBuilderProps {
  readonly conditions: ReadonlyArray<Condition>
  readonly onChange: (conditions: Condition[]) => void
  readonly conjunctionMode: 'AND' | 'OR'
  readonly onConjunctionChange: (mode: 'AND' | 'OR') => void
  readonly className?: string
}

/* ── Config ── */

interface FieldConfig {
  readonly label: string
  readonly operators: ReadonlyArray<string>
  readonly inputType: 'currency' | 'country_select' | 'currency_select' | 'provider_select' | 'tier_select'
}

const FIELDS: Record<ConditionField, FieldConfig> = {
  amount: { label: 'Transaction amount', operators: ['greater_than', 'less_than', 'between'], inputType: 'currency' },
  country: { label: 'Player country', operators: ['is', 'is_not', 'in_list'], inputType: 'country_select' },
  currency: { label: 'Transaction currency', operators: ['is', 'is_not'], inputType: 'currency_select' },
  payment_method: { label: 'Payment method', operators: ['is', 'is_not', 'in_list'], inputType: 'provider_select' },
  player_risk_tier: { label: 'Player AML risk tier', operators: ['is', 'is_not'], inputType: 'tier_select' },
}

const OP_LABELS: Record<string, string> = {
  greater_than: 'is greater than', less_than: 'is less than', between: 'is between',
  is: 'is', is_not: 'is not', in_list: 'is one of',
}

const COUNTRIES = ['DE', 'MU', 'NL', 'GB', 'AT', 'CH']
const CURRENCIES = ['EUR', 'MUR', 'GBP', 'USD']
const PROVIDERS = ['trustly', 'nuvei', 'paysafe', 'mcb_juice', 'zimpler', 'paypal']
const TIERS = ['standard', 'enhanced', 'high_risk']

const RemoveIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>)

let nextId = 1
function genId(): string { return `cond_${nextId++}` }

/* ── MultiSelect sub-component ── */

function MultiSelect({ options, value, onChange, renderChip }: {
  options: ReadonlyArray<string>
  value: ReadonlyArray<string>
  onChange: (v: string[]) => void
  renderChip?: (v: string) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!open) return; function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [open])

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? [...value].filter((v) => v !== opt) : [...value, opt])
  }

  return (
    <div className={styles['multiSelect']} ref={ref} onClick={() => setOpen((p) => !p)}>
      {value.map((v) => (
        <span key={v} className={styles['chipItem']}>
          {renderChip !== undefined ? renderChip(v) : v}
          <button type="button" className={styles['chipRemove']} onClick={(e) => { e.stopPropagation(); toggle(v) }}>{'\u00d7'}</button>
        </span>
      ))}
      {open && (
        <div className={styles['multiDropdown']}>
          {options.map((opt) => (
            <div key={opt} className={`${styles['multiOption']} ${value.includes(opt) ? styles['multiOptionActive'] : ''}`} onClick={(e) => { e.stopPropagation(); toggle(opt) }}>
              {renderChip !== undefined ? renderChip(opt) : opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Value renderer per input type ── */

function ValueInput({ field, operator, value, onChange }: {
  field: ConditionField; operator: string
  value: string | string[] | number; onChange: (v: string | string[] | number) => void
}) {
  const config = FIELDS[field]
  if (config === undefined) return null

  if (config.inputType === 'currency') {
    if (operator === 'between') {
      const arr = typeof value === 'string' ? value.split(',') : [String(value), '']
      return (
        <div className={styles['betweenRow']}>
          <div className={styles['currencyPrefix']}>
            <span className={styles['currencyLabel']}>{'\u20ac'}</span>
            <input className={styles['currencyInput']} type="number" min="0" value={arr[0] ?? ''} onChange={(e) => onChange(`${e.target.value},${arr[1] ?? ''}`)} />
          </div>
          <span className={styles['betweenLabel']}>and</span>
          <div className={styles['currencyPrefix']}>
            <span className={styles['currencyLabel']}>{'\u20ac'}</span>
            <input className={styles['currencyInput']} type="number" min="0" value={arr[1] ?? ''} onChange={(e) => onChange(`${arr[0] ?? ''},${e.target.value}`)} />
          </div>
        </div>
      )
    }
    return (
      <div className={styles['currencyPrefix']}>
        <span className={styles['currencyLabel']}>{'\u20ac'}</span>
        <input className={styles['currencyInput']} type="number" min="0" value={typeof value === 'number' ? value : value} onChange={(e) => onChange(Number(e.target.value))} />
      </div>
    )
  }

  if (config.inputType === 'country_select') {
    const arr = Array.isArray(value) ? value : []
    return <MultiSelect options={COUNTRIES} value={arr} onChange={onChange} />
  }

  if (config.inputType === 'provider_select') {
    const arr = Array.isArray(value) ? value : []
    return <MultiSelect options={PROVIDERS} value={arr} onChange={onChange} renderChip={(v) => <ProviderBadge provider={v as 'trustly'} badgeStyle="outlined" />} />
  }

  if (config.inputType === 'currency_select') {
    return <select className={styles['valueSelect']} value={String(value)} onChange={(e) => onChange(e.target.value)}><option value="">Select...</option>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
  }

  if (config.inputType === 'tier_select') {
    return <select className={styles['valueSelect']} value={String(value)} onChange={(e) => onChange(e.target.value)}><option value="">Select...</option>{TIERS.map((t) => <option key={t} value={t}>{t}</option>)}</select>
  }

  return <input className={styles['valueInput']} value={String(value)} onChange={(e) => onChange(e.target.value)} />
}

/* ── Preview builder ── */

function buildPreview(conditions: ReadonlyArray<Condition>, conj: string): string {
  if (conditions.length === 0) return ''
  const parts = conditions.map((c) => {
    const fieldLabel = FIELDS[c.field]?.label ?? c.field
    const opLabel = OP_LABELS[c.operator] ?? c.operator
    let valStr: string
    if (Array.isArray(c.value)) valStr = `[${c.value.join(', ')}]`
    else if (c.operator === 'between' && typeof c.value === 'string') { const [a, b] = c.value.split(','); valStr = `\u20ac${a ?? '?'} and \u20ac${b ?? '?'}` }
    else if (typeof c.value === 'number') valStr = `\u20ac${c.value}`
    else valStr = String(c.value) || '?'
    return `${fieldLabel} ${opLabel} ${valStr}`
  })
  return `Route if: ${parts.join(` ${conj} `)}`
}

/* ── Component ── */

export function ConditionBuilder({ conditions, onChange, conjunctionMode, onConjunctionChange, className }: ConditionBuilderProps) {
  const addCondition = useCallback(() => {
    onChange([...conditions, { id: genId(), field: 'amount', operator: 'greater_than', value: '' }])
  }, [conditions, onChange])

  const removeCondition = useCallback((id: string) => {
    onChange([...conditions].filter((c) => c.id !== id))
  }, [conditions, onChange])

  const updateCondition = useCallback((id: string, patch: Partial<Condition>) => {
    onChange([...conditions].map((c) => c.id === id ? { ...c, ...patch } : c))
  }, [conditions, onChange])

  const wrapperCls = [styles['wrapper'], className].filter(Boolean).join(' ')
  const preview = buildPreview(conditions, conjunctionMode)

  return (
    <div className={wrapperCls}>
      {conditions.map((cond, i) => {
        const fieldConfig = FIELDS[cond.field]
        const isIncomplete = !cond.field || !cond.operator || (Array.isArray(cond.value) ? cond.value.length === 0 : cond.value === '' || cond.value === 0)

        return (
          <div key={cond.id}>
            {i > 0 && (
              <div className={styles['conjunction']}>
                <div className={styles['conjPill']}>
                  <button type="button" className={`${styles['conjBtn']} ${conjunctionMode === 'AND' ? styles['conjActive'] : styles['conjInactive']}`} onClick={() => onConjunctionChange('AND')}>AND</button>
                  <button type="button" className={`${styles['conjBtn']} ${conjunctionMode === 'OR' ? styles['conjActive'] : styles['conjInactive']}`} onClick={() => onConjunctionChange('OR')}>OR</button>
                </div>
              </div>
            )}
            <div className={`${styles['condRow']} ${isIncomplete ? styles['condRowInvalid'] : ''}`}>
              <select className={styles['fieldSelect']} value={cond.field} onChange={(e) => { const f = e.target.value as ConditionField; const cfg = FIELDS[f]; updateCondition(cond.id, { field: f, operator: cfg?.operators[0] ?? '', value: cfg?.inputType === 'currency' ? 0 : '' }) }}>
                {Object.entries(FIELDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select className={styles['opSelect']} value={cond.operator} onChange={(e) => updateCondition(cond.id, { operator: e.target.value })}>
                {fieldConfig?.operators.map((op) => <option key={op} value={op}>{OP_LABELS[op] ?? op}</option>)}
              </select>
              <ValueInput field={cond.field} operator={cond.operator} value={cond.value} onChange={(v) => updateCondition(cond.id, { value: v })} />
              <IconButton icon={RemoveIcon} label="Remove" size="sm" variant="ghost" intent="danger" onClick={() => removeCondition(cond.id)} />
            </div>
          </div>
        )
      })}

      <button type="button" className={styles['addBtn']} onClick={addCondition}>+ Add condition</button>

      {preview !== '' && (
        <div className={styles['preview']}>
          <span className={styles['previewStrong']}>Preview:</span> {preview}
        </div>
      )}
    </div>
  )
}
