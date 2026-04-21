import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import styles from './purge-confirm-modal.module.css'

interface PurgeCategory { readonly id: string; readonly category: string; readonly storageSizeGb: number; readonly oldestRecordAt: string }
interface Agent { readonly id: string; readonly name: string }

export interface PurgeDraft { readonly categoryIds: string[]; readonly olderThanDate: string; readonly authorisedById: string; readonly authorisedByEmployeeId: string }

export interface PurgeConfirmModalProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onConfirm: (purge: PurgeDraft) => Promise<void>
  readonly availableCategories: ReadonlyArray<PurgeCategory>
  readonly currentAgent: Agent
}

const CloseIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>)

function formatDate(iso: string): string { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }

export function PurgeConfirmModal({ open, onClose, onConfirm, availableCategories, currentAgent }: PurgeConfirmModalProps) {
  const [step, setStep] = useState(0)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [olderThan, setOlderThan] = useState('')
  const [authName, setAuthName] = useState('')
  const [authEmpId, setAuthEmpId] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (open) { setStep(0); setSelectedIds([]); setOlderThan(''); setAuthName(''); setAuthEmpId(''); setConfirmed(false); setSubmitting(false) } }, [open])
  useEffect(() => { if (!open) return; function h(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }; document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h) }, [open, onClose])

  const toggleCat = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const selectedCats = availableCategories.filter((c) => selectedIds.includes(c.id))
  const estimatedGb = selectedCats.reduce((sum, c) => sum + c.storageSizeGb, 0)
  const canNext = selectedIds.length > 0 && olderThan !== ''
  const canSubmit = confirmed && authName.trim() !== '' && authEmpId.trim() !== '' && authName.trim().toLowerCase() !== currentAgent.name.toLowerCase() && !submitting

  const handleSubmit = async () => {
    setSubmitting(true)
    await onConfirm({ categoryIds: selectedIds, olderThanDate: olderThan, authorisedById: authName.trim(), authorisedByEmployeeId: authEmpId.trim() })
    setSubmitting(false)
    onClose()
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className={`${styles['backdrop']} ${styles['backdropOpen']}`} onClick={onClose}>
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['header']}>
          <span className={styles['headerTitle']}>Manual data purge</span>
          <IconButton icon={CloseIcon} label="Close" size="sm" variant="ghost" onClick={onClose} />
        </div>

        <div className={styles['steps']}>
          <div className={`${styles['step']} ${step === 0 ? styles['stepActive'] : step > 0 ? styles['stepComplete'] : styles['stepFuture']}`}>
            <span className={styles['stepCircle']}>{step > 0 ? '\u2713' : '1'}</span>Select scope
          </div>
          <div className={styles['stepLine']} />
          <div className={`${styles['step']} ${step === 1 ? styles['stepActive'] : styles['stepFuture']}`}>
            <span className={styles['stepCircle']}>2</span>Authorise purge
          </div>
        </div>

        <div className={styles['warningBanner']}>{'\u26A0\uFE0F'} This action permanently deletes data and cannot be undone. Records within mandatory retention periods are protected.</div>

        <div className={styles['body']}>
          {step === 0 ? (
            <>
              <div className={styles['instruction']}>Select which data categories to purge and the date threshold. Only records older than the selected date will be removed. This does not affect records within mandatory retention periods.</div>
              <div className={styles['catList']}>
                {availableCategories.map((c) => (
                  <div key={c.id} className={styles['catRow']}>
                    <Checkbox checked={selectedIds.includes(c.id)} onChange={() => toggleCat(c.id)} size="sm" />
                    <span className={styles['catName']}>{c.category}</span>
                    <span className={styles['catSize']}>{c.storageSizeGb.toFixed(1)} GB</span>
                    <span className={styles['catOldest']}>oldest: {formatDate(c.oldestRecordAt)}</span>
                  </div>
                ))}
              </div>
              <div className={styles['dateField']}>
                <span className={styles['dateLabel']}>Purge records older than</span>
                <input type="date" className={styles['dateInput']} value={olderThan} onChange={(e) => setOlderThan(e.target.value)} />
              </div>
              {canNext && <div className={styles['impact']}>This will permanently delete approx. {estimatedGb.toFixed(1)} GB of data across {selectedIds.length} categories.</div>}
            </>
          ) : (
            <>
              <div className={styles['summaryCard']}>
                <span className={styles['summaryStrong']}>{selectedIds.length} categories</span> selected {'\u00b7'} Records older than <span className={styles['summaryStrong']}>{olderThan}</span> {'\u00b7'} Estimated <span className={styles['summaryStrong']}>{estimatedGb.toFixed(1)} GB</span>
              </div>

              <div className={styles['approvalSection']}>
                <div className={styles['approvalTitle']}>Two-person authorisation</div>
                <div className={styles['agentRow']}>
                  <Avatar name={currentAgent.name} size="md" />
                  <div><div className={styles['agentInfo']}>{currentAgent.name}</div><div className={styles['agentLabel']}>Initiating this purge</div></div>
                </div>
                <div className={styles['inputRow']}>
                  <input className={styles['agentInput']} placeholder="Authorising agent name" value={authName} onChange={(e) => setAuthName(e.target.value)} />
                  <input className={styles['agentInput']} placeholder="Employee ID" value={authEmpId} onChange={(e) => setAuthEmpId(e.target.value)} />
                </div>
                <div className={styles['twoPersonNote']}>Two-person authorisation is required. Both agent identities will be recorded in the audit log.</div>
              </div>

              <div className={styles['consequences']}>
                {['Records will be permanently deleted \u2014 this cannot be undone', 'A purge record will be created in the immutable audit log', 'Affected players\u2019 compliance history will reflect the purge'].map((t, i) => (
                  <div key={i} className={styles['consequenceItem']}>
                    <span className={styles['consequenceIcon']}>{'\u2022'}</span>
                    <span className={i === 0 ? styles['consequenceDanger'] : ''}>{t}</span>
                  </div>
                ))}
              </div>

              <div className={styles['confirmBox']}>
                <Checkbox checked={confirmed} onChange={setConfirmed} label="I confirm I have the authority to purge this data and that both agents have agreed to proceed." size="sm" />
              </div>
            </>
          )}
        </div>

        <div className={styles['footer']}>
          <Button variant="ghost" size="sm" onClick={step > 0 ? () => setStep(0) : onClose}>{step > 0 ? 'Back' : 'Cancel'}</Button>
          {step === 0 ? (
            <Button variant="primary" size="sm" disabled={!canNext} onClick={() => setStep(1)}>Next {'\u2192'}</Button>
          ) : (
            <Button variant="danger" size="sm" disabled={!canSubmit} onClick={handleSubmit}>{submitting ? 'Purging...' : 'Purge records permanently'}</Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
