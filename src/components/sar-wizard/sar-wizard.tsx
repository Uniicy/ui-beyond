import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { FilterChip } from '../filter-chip'
import { IconButton } from '../icon-button'
import styles from './sar-wizard.module.css'

/* ── Types ── */

export interface SARDraft {
  readonly linkedAlertIds: string[]
  readonly narrative: string
  readonly format: 'goAML' | 'gra_format'
  readonly regulatorNotes?: string
}

interface AlertOption {
  readonly id: string
  readonly ruleName: string
  readonly severity: string
  readonly createdAt: string
  readonly player: { readonly name: string }
}

interface Player {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly kycStatus: string
  readonly amlRiskTier: string
  readonly dateOfBirth: string
  readonly address: string
}

interface Agent {
  readonly id: string
  readonly name: string
}

export interface SARWizardProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onSubmit: (sar: SARDraft) => Promise<void>
  readonly prelinkedAlerts: ReadonlyArray<string>
  readonly allAlerts: ReadonlyArray<AlertOption>
  readonly player: Player
  readonly currentAgent: Agent
}

const STEP_LABELS = ['Link alerts', 'Player details', 'Narrative', 'Review & submit']

const CloseIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
)

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function generateGoAml(draft: SARDraft, player: Player, agent: Agent): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<goAML>
  <report type="SAR">
    <reportingEntity>
      <agent>${agent.name}</agent>
    </reportingEntity>
    <subject>
      <name>${player.name}</name>
      <id>${player.id}</id>
      <dob>${player.dateOfBirth}</dob>
      <address>${player.address}</address>
    </subject>
    <linkedAlerts count="${draft.linkedAlertIds.length}">
${draft.linkedAlertIds.map((id) => `      <alertRef>${id}</alertRef>`).join('\n')}
    </linkedAlerts>
    <narrative>
      ${draft.narrative}
    </narrative>
    <format>goAML</format>
    <regulator>BaFin</regulator>
  </report>
</goAML>`
}

function generateGra(draft: SARDraft, player: Player, agent: Agent): string {
  return `SUSPICIOUS ACTIVITY REPORT — GRA FORMAT
${'='.repeat(44)}

REPORTING OFFICER: ${agent.name}
DATE: ${new Date().toLocaleDateString('en-GB')}

SUBJECT
  Name:    ${player.name}
  ID:      ${player.id}
  DOB:     ${player.dateOfBirth}
  Address: ${player.address}

LINKED ALERTS (${draft.linkedAlertIds.length})
${draft.linkedAlertIds.map((id) => `  - ${id}`).join('\n')}

NARRATIVE
${draft.narrative}

REGULATOR: Gaming Regulatory Authority (Mauritius)
FORMAT: GRA Prescribed Form`
}

export function SARWizard({
  open,
  onClose,
  onSubmit,
  prelinkedAlerts,
  allAlerts,
  player,
  currentAgent,
}: SARWizardProps) {
  const [step, setStep] = useState(0)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([...prelinkedAlerts])
  const [narrative, setNarrative] = useState('')
  const [format, setFormat] = useState<'goAML' | 'gra_format'>('goAML')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [search, setSearch] = useState('')
  const [hintOpen, setHintOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0)
      setSelectedAlerts([...prelinkedAlerts])
      setNarrative('')
      setFormat('goAML')
      setConfirmed(false)
      setSubmitting(false)
      setSubmitted(false)
      setSearch('')
    }
  }, [open, prelinkedAlerts])

  const toggleAlert = useCallback((id: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const canNext = step === 0 ? selectedAlerts.length > 0
    : step === 1 ? true
    : step === 2 ? narrative.trim().length > 0
    : confirmed && !submitting

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setSubmitting(true)
      await onSubmit({ linkedAlertIds: selectedAlerts, narrative, format })
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const draft: SARDraft = { linkedAlertIds: selectedAlerts, narrative, format }
  const wordCount = countWords(narrative)
  const filteredAlerts = search === ''
    ? allAlerts
    : allAlerts.filter((a) => a.ruleName.toLowerCase().includes(search.toLowerCase()) || a.player.name.toLowerCase().includes(search.toLowerCase()))

  const content = (
    <>
      <div className={`${styles['backdrop']} ${open ? styles['backdropOpen'] : ''}`} onClick={onClose} />
      {open && (
        <div className={`${styles['backdrop']} ${styles['backdropOpen']}`} onClick={onClose}>
          <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles['header']}>
              <div className={styles['headerTop']}>
                <span className={styles['headerTitle']}>Create Suspicious Activity Report</span>
                <IconButton icon={CloseIcon} label="Close" size="sm" variant="ghost" onClick={onClose} />
              </div>

              {!submitted && (
                <div className={styles['steps']}>
                  {STEP_LABELS.map((label, i) => {
                    const state = i < step ? 'stepCompleted' : i === step ? 'stepActive' : 'stepFuture'
                    return (
                      <div key={label} className={`${styles['step']} ${styles[state]}`}>
                        <div className={styles['stepCircle']}>
                          {i < step ? '\u2713' : i + 1}
                        </div>
                        <span className={styles['stepLabel']}>{label}</span>
                        {i < 3 && <div className={styles['stepLine']} />}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Body */}
            <div className={styles['body']}>
              {submitted ? (
                <div className={styles['success']}>
                  <div className={styles['successIcon']}>{'\u2713'}</div>
                  <span className={styles['successTitle']}>SAR submitted successfully</span>
                  <span className={styles['successRef']}>SAR-2026-{Math.floor(Math.random() * 9000 + 1000)}</span>
                  <span className={styles['successDetail']}>
                    Submitted to {format === 'goAML' ? 'BaFin (Germany)' : 'GRA (Mauritius)'} via {format === 'goAML' ? 'goAML' : 'GRA prescribed form'}
                  </span>
                </div>
              ) : step === 0 ? (
                <div className={styles['linkLayout']}>
                  <div className={styles['linkLeft']}>
                    <input
                      className={styles['linkSearch']}
                      placeholder="Search alerts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {filteredAlerts.map((a) => (
                      <div key={a.id} className={styles['alertListItem']}>
                        <Checkbox
                          checked={selectedAlerts.includes(a.id)}
                          onChange={() => toggleAlert(a.id)}
                          size="sm"
                        />
                        <span className={styles['alertListName']}>{a.ruleName}</span>
                        <span className={styles['alertListPlayer']}>{a.player.name}</span>
                        <Badge variant={a.severity as 'high'} size="sm" />
                        <span className={styles['alertListDate']}>{formatDate(a.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles['linkRight']}>
                    <span className={styles['selectedTitle']}>Selected alerts ({selectedAlerts.length})</span>
                    {selectedAlerts.length === 0 ? (
                      <span className={styles['selectedEmpty']}>Select alerts to link {'\u2192'}</span>
                    ) : (
                      <div className={styles['selectedChips']}>
                        {selectedAlerts.map((id) => {
                          const alert = allAlerts.find((a) => a.id === id)
                          return (
                            <FilterChip
                              key={id}
                              label={alert?.ruleName ?? id}
                              onRemove={() => toggleAlert(id)}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : step === 1 ? (
                <div className={styles['playerLayout']}>
                  <div className={styles['fieldGroup']}>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>Full name</span>
                      <span className={styles['fieldValue']}>{player.name}</span>
                    </div>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>Player ID</span>
                      <span className={styles['fieldValueMono']}>{player.id}</span>
                    </div>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>Email</span>
                      <span className={styles['fieldValue']}>{player.email}</span>
                    </div>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>Date of birth</span>
                      <span className={styles['fieldValue']}>{player.dateOfBirth}</span>
                    </div>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>Address</span>
                      <span className={styles['fieldValue']}>{player.address}</span>
                    </div>
                  </div>
                  <div className={styles['fieldGroup']}>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>KYC status</span>
                      <span className={styles['fieldValue']}><Badge variant={player.kycStatus as 'approved'} size="sm" /></span>
                    </div>
                    <div className={styles['field']}>
                      <span className={styles['fieldLabel']}>AML risk tier</span>
                      <span className={styles['fieldValue']}><Badge variant={player.amlRiskTier as 'enhanced'} size="sm" /></span>
                    </div>
                  </div>
                  <div className={styles['autoNote']}>
                    Player data is automatically populated from the Identity Beyond player graph.
                  </div>
                </div>
              ) : step === 2 ? (
                <>
                  <textarea
                    className={styles['narrativeTextarea']}
                    placeholder="Describe the suspicious activity, pattern observed, and basis for the report\u2026"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                  />
                  <div className={styles['narrativeMeta']}>
                    <div className={styles['formatRow']}>
                      <label className={styles['formatOption']}>
                        <input type="radio" className={styles['formatRadio']} checked={format === 'goAML'} onChange={() => setFormat('goAML')} />
                        goAML (BaFin / Germany)
                      </label>
                      <label className={styles['formatOption']}>
                        <input type="radio" className={styles['formatRadio']} checked={format === 'gra_format'} onChange={() => setFormat('gra_format')} />
                        GRA format (Mauritius)
                      </label>
                    </div>
                    <span className={`${styles['wordCount']} ${wordCount < 100 ? styles['wordCountLow'] : ''}`}>
                      {wordCount} words {wordCount < 100 ? '(min 100)' : wordCount <= 500 ? '' : ''}
                    </span>
                  </div>
                  <button type="button" className={styles['hintToggle']} onClick={() => setHintOpen((p) => !p)}>
                    {hintOpen ? '\u25B4' : '\u25BE'} Suggested structure
                  </button>
                  {hintOpen && (
                    <div className={styles['hintContent']}>
                      <ul>
                        <li>Description of the suspicious activity</li>
                        <li>Transaction amounts, dates, and methods</li>
                        <li>Why the activity is considered suspicious</li>
                        <li>Any player communication or responses</li>
                        <li>Steps taken during investigation</li>
                        <li>Other relevant context</li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles['reviewLayout']}>
                  <div className={styles['reviewLeft']}>
                    <pre className={styles['codeBlock']}>
                      {format === 'goAML'
                        ? generateGoAml(draft, player, currentAgent)
                        : generateGra(draft, player, currentAgent)}
                    </pre>
                  </div>
                  <div className={styles['reviewRight']}>
                    <div className={styles['reviewField']}>
                      <span className={styles['reviewFieldLabel']}>Regulator</span>
                      <span className={styles['reviewFieldValue']}>{format === 'goAML' ? 'BaFin (Germany)' : 'GRA (Mauritius)'}</span>
                    </div>
                    <div className={styles['reviewField']}>
                      <span className={styles['reviewFieldLabel']}>Format</span>
                      <span className={styles['reviewFieldValue']}>{format === 'goAML' ? 'goAML XML' : 'GRA Prescribed Form'}</span>
                    </div>
                    <div className={styles['reviewField']}>
                      <span className={styles['reviewFieldLabel']}>Linked alerts</span>
                      <span className={styles['reviewFieldValue']}>{selectedAlerts.length}</span>
                    </div>
                    <div className={styles['reviewField']}>
                      <span className={styles['reviewFieldLabel']}>Player</span>
                      <span className={styles['reviewFieldValue']}>{player.name}</span>
                    </div>
                    <div className={styles['reviewField']}>
                      <span className={styles['reviewFieldLabel']}>Submitting agent</span>
                      <span className={styles['reviewFieldValue']}>{currentAgent.name}</span>
                    </div>
                    <div className={styles['confirmRow']}>
                      <Checkbox
                        checked={confirmed}
                        onChange={setConfirmed}
                        label="I confirm this SAR is complete and accurate."
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!submitted ? (
              <div className={styles['footer']}>
                <Button variant="ghost" size="sm" onClick={step > 0 ? () => setStep(step - 1) : onClose}>
                  {step > 0 ? 'Back' : 'Cancel'}
                </Button>
                <span className={styles['footerCenter']}>Step {step + 1} of 4</span>
                <Button variant="primary" size="sm" disabled={!canNext} onClick={handleNext}>
                  {step < 3 ? 'Next \u2192' : submitting ? 'Submitting...' : 'Submit SAR'}
                </Button>
              </div>
            ) : (
              <div className={styles['footer']}>
                <span />
                <span />
                <Button variant="primary" size="sm" onClick={onClose}>Close</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
