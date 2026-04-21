import { useState, type HTMLAttributes } from 'react'
import { Button } from '../button'
import { ProgressBar } from '../progress-bar'
import styles from './retention-rule-row.module.css'

export interface RetentionRule {
  readonly id: string
  readonly category: string
  readonly retentionPeriod: string
  readonly regulatoryBasis: string
  readonly storageSizeGb: number
  readonly locked: boolean
  readonly currentRetentionDays: number
}

export interface RetentionRuleRowProps {
  readonly rule: RetentionRule
  readonly onEdit?: (id: string, newDays: number) => void
  readonly className?: string
}

export function RetentionRuleRow({ rule: r, onEdit, className }: RetentionRuleRowProps) {
  const [editing, setEditing] = useState(false)
  const [editDays, setEditDays] = useState(String(r.currentRetentionDays))

  const handleSave = () => {
    onEdit?.(r.id, Number(editDays) || r.currentRetentionDays)
    setEditing(false)
  }

  const rowCls = [styles['row'], className].filter(Boolean).join(' ')

  return (
    <>
      <div className={rowCls}>
        <span className={styles['category']}>{r.category}</span>
        <span className={styles['period']}>{r.retentionPeriod}</span>
        <div className={styles['cell']}><span className={styles['basis']}>{r.regulatoryBasis}</span></div>
        <div className={`${styles['cell']} ${styles['storage']}`}>{r.storageSizeGb.toFixed(1)} GB</div>
        <div className={styles['cell']}>
          {r.locked ? (
            <span className={styles['lockIcon']} data-tooltip="Regulatory minimum \u2014 cannot reduce">{'\u{1F512}'}</span>
          ) : onEdit !== undefined ? (
            <button type="button" className={styles['editLink']} onClick={() => setEditing(true)}>Edit {'\u2192'}</button>
          ) : null}
        </div>
      </div>
      {editing && (
        <div className={styles['editRow']}>
          <span className={styles['editLabel']}>Retention days:</span>
          <input className={styles['editInput']} type="number" min="1" value={editDays} onChange={(e) => setEditDays(e.target.value)} />
          <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      )}
    </>
  )
}

/* ── RetentionRulesPanel ── */

export interface RetentionRulesPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly rules: ReadonlyArray<RetentionRule>
  readonly totalStorageGb: number
  readonly quotaGb: number
  readonly onManualPurge: () => void
  readonly onEditRule?: (id: string, newDays: number) => void
}

export function RetentionRulesPanel({ rules, totalStorageGb, quotaGb, onManualPurge, onEditRule, className, ...props }: RetentionRulesPanelProps) {
  const pct = quotaGb > 0 ? Math.min(100, (totalStorageGb / quotaGb) * 100) : 0
  const intent: 'success' | 'warning' | 'danger' = pct >= 85 ? 'danger' : pct >= 60 ? 'warning' : 'success'
  const wrapperCls = [styles['panel'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperCls} {...props}>
      <div className={styles['panelHeader']}>
        <span className={styles['panelTitle']}>Data retention</span>
      </div>
      <ProgressBar value={pct} height="md" intent={intent} rounded label={`${totalStorageGb.toFixed(1)} GB of ${quotaGb} GB`} />
      <div className={styles['storageRow']}>
        <span className={styles['storageLabel']}>{rules.length} retention policies</span>
        <span className={styles['storageMono']}>{pct.toFixed(0)}% used</span>
      </div>
      <div>
        <div className={styles['tableHeader']}>
          <span>Category</span><span>Period</span><span>Basis</span><span style={{ textAlign: 'right' }}>Storage</span><span />
        </div>
        {rules.map((r) => (
          <RetentionRuleRow key={r.id} rule={r} onEdit={r.locked ? undefined : onEditRule} />
        ))}
      </div>
      <div className={styles['purgeBtn']}>
        <Button variant="danger" size="sm" onClick={onManualPurge}>Manual purge\u2026</Button>
      </div>
    </div>
  )
}
