import { useState } from 'react'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { LimitGroup, type LimitBarProps } from '../limit-bar'
import { ProgressBar } from '../progress-bar'
import { SlideInPanel } from '../slide-in-panel'
import styles from './limit-override-panel.module.css'

export interface LimitOverride {
  readonly limitType: string
  readonly period: string
  readonly newAmount: number
  readonly reason: string
  readonly complianceNote: string
}

export interface LimitOverridePanelProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onSubmit: (override: LimitOverride) => Promise<void>
  readonly player: { readonly id: string; readonly name: string }
  readonly currentLimits: ReadonlyArray<LimitBarProps>
  readonly agentId: string
}

const LIMIT_TYPES = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'loss', label: 'Loss' },
  { value: 'session_time', label: 'Session time' },
  { value: 'session_count', label: 'Session count' },
]

const PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const REASONS = [
  { value: 'regulatory', label: 'Regulatory requirement' },
  { value: 'player_request', label: 'Player-initiated request' },
  { value: 'agent_discretion', label: 'Agent discretion' },
  { value: 'hardship', label: 'Financial hardship \u2014 CDD required' },
]

export function LimitOverridePanel({ open, onClose, onSubmit, player, currentLimits, agentId }: LimitOverridePanelProps) {
  const [limitType, setLimitType] = useState('deposit')
  const [period, setPeriod] = useState('monthly')
  const [newAmount, setNewAmount] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [lugasAck, setLugasAck] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const parsedAmount = Number(newAmount) || 0
  const isMonetary = limitType === 'deposit' || limitType === 'loss'
  const needsLugasWarning = limitType === 'deposit' && period === 'monthly' && parsedAmount > 1000
  const noteLen = note.trim().length

  const currentMatch = currentLimits.find((l) => l.limitType === limitType && l.period === period)
  const currentMax = currentMatch?.limitAmount ?? 0
  const currentUsed = currentMatch?.currentAmount ?? 0
  const previewPct = parsedAmount > 0 ? Math.min(120, (currentUsed / parsedAmount) * 100) : 0
  const previewIntent: 'success' | 'warning' | 'danger' = previewPct >= 85 ? 'danger' : previewPct >= 60 ? 'warning' : 'success'

  const canSubmit = reason !== '' && noteLen >= 20 && parsedAmount > 0 && (!needsLugasWarning || lugasAck) && !submitting

  const handleSubmit = async () => {
    setSubmitting(true)
    await onSubmit({ limitType, period, newAmount: parsedAmount, reason, complianceNote: note.trim() })
    setSubmitting(false)
    onClose()
  }

  const footer = (
    <div className={styles['footer']}>
      <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="sm" disabled={!canSubmit} onClick={handleSubmit}>
        {submitting ? 'Applying...' : 'Apply override'}
      </Button>
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={onClose} title={`Override limits \u2014 ${player.name}`} footer={footer}>
      {/* Current limits */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Current limits</div>
        <LimitGroup limits={currentLimits} title="" />
        {currentLimits.filter((l) => l.source === 'lugas' || l.source === 'oasis').map((l) => (
          <div key={`${l.limitType}-${l.period}`} className={styles['regulatoryNote']}>
            {'\u26A0\uFE0F'} Reducing {l.period} {l.limitType} below regulatory minimum requires additional approval
          </div>
        ))}
      </div>

      {/* New limit */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>New limit</div>
        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <span className={styles['fieldLabel']}>Limit type</span>
            <select className={styles['fieldSelect']} value={limitType} onChange={(e) => setLimitType(e.target.value)}>
              {LIMIT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={styles['field']}>
            <span className={styles['fieldLabel']}>Period</span>
            <select className={styles['fieldSelect']} value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className={`${styles['field']} ${styles['fieldFull']}`}>
            <span className={styles['fieldLabel']}>New amount ({isMonetary ? '\u20ac' : limitType === 'session_time' ? 'minutes' : 'sessions'})</span>
            <input className={styles['fieldInput']} type="number" min="0" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder={currentMax > 0 ? `Current: ${currentMax}` : '0'} />
            {parsedAmount > 0 && (
              <div className={styles['previewBar']}>
                <ProgressBar value={previewPct} height="xs" intent={previewIntent} rounded />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Reason</div>
        <div className={styles['formGrid']}>
          <div className={`${styles['field']} ${styles['fieldFull']}`}>
            <span className={styles['fieldLabel']}>Reason</span>
            <select className={styles['fieldSelect']} value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select reason...</option>
              {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className={`${styles['field']} ${styles['fieldFull']}`}>
            <span className={styles['fieldLabel']}>Compliance note</span>
            <textarea className={styles['fieldTextarea']} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the justification for this override..." />
            <span className={`${styles['charCount']} ${noteLen < 20 && noteLen > 0 ? styles['charCountLow'] : ''}`}>{noteLen} / 20 min</span>
          </div>
        </div>
        <div className={styles['auditNote']}>This change will be logged against your agent ID ({agentId}) and included in the next compliance report.</div>

        {needsLugasWarning && (
          <>
            <div className={styles['lugasWarning']}>
              {'\u26A0\uFE0F'} This override exceeds the LUGAS \u20ac1,000 monthly cap. This is only permitted under exceptional circumstances and requires supervisor approval. Proceed only if you have written authorisation.
            </div>
            <div className={styles['lugasCheckbox']}>
              <Checkbox checked={lugasAck} onChange={setLugasAck} label="I have written supervisor authorisation for this override." size="sm" />
            </div>
          </>
        )}
      </div>
    </SlideInPanel>
  )
}
