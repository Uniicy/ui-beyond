import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import styles from './merge-confirm-modal.module.css'

interface MergePlayer {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly kycStatus: string
  readonly createdAt: string
  readonly verificationCount: number
}

export interface MergeConfirmModalProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onConfirm: (primaryPlayerId: string) => Promise<void>
  readonly match: {
    readonly playerA: MergePlayer
    readonly playerB: MergePlayer
  }
}

const CloseIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
)

const CONSEQUENCES = [
  { icon: '\u{1F4C4}', category: 'KYC documents', outcome: 'Archived from both accounts', danger: false },
  { icon: '\u26A0', category: 'AML alerts', outcome: 'All alerts transferred to primary', danger: false },
  { icon: '\u2696', category: 'Limits', outcome: 'Strictest limit from either account enforced', danger: false },
  { icon: '\u{1F6AB}', category: 'Exclusions', outcome: 'All active exclusions preserved on primary', danger: false },
  { icon: '\u{1F4CB}', category: 'Login history', outcome: 'Combined and attributed to primary', danger: false },
  { icon: '\u{274C}', category: 'Secondary account', outcome: 'Deactivated \u2014 player will not be able to log in', danger: true },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function MergeConfirmModal({ open, onClose, onConfirm, match }: MergeConfirmModalProps) {
  const [step, setStep] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [closeConfirm, setCloseConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(0)
      setSelectedId(null)
      setConfirmed(false)
      setSubmitting(false)
      setCloseConfirm(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, step])

  const handleClose = () => {
    if (step === 1 && !closeConfirm) {
      setCloseConfirm(true)
      return
    }
    onClose()
  }

  const handleConfirm = async () => {
    if (selectedId === null) return
    setSubmitting(true)
    await onConfirm(selectedId)
    setSubmitting(false)
    onClose()
  }

  const primary = selectedId === match.playerA.id ? match.playerA : match.playerB
  const secondary = selectedId === match.playerA.id ? match.playerB : match.playerA

  const aHasApprovedKyc = match.playerA.kycStatus === 'approved'
  const bHasApprovedKyc = match.playerB.kycStatus === 'approved'
  const recommendA = aHasApprovedKyc && !bHasApprovedKyc
  const recommendB = bHasApprovedKyc && !aHasApprovedKyc

  function renderRadioCard(player: MergePlayer, recommend: boolean) {
    const isSelected = selectedId === player.id
    return (
      <label className={`${styles['radioCard']} ${isSelected ? styles['radioCardSelected'] : ''}`}>
        <input
          type="radio"
          className={styles['radioInput']}
          name="primaryPlayer"
          checked={isSelected}
          onChange={() => setSelectedId(player.id)}
        />
        <div className={styles['playerTop']}>
          <Avatar name={player.name} size="md" />
          <div className={styles['playerInfo']}>
            <span className={styles['playerName']}>{player.name}</span>
            <span className={styles['playerEmail']}>{player.email}</span>
          </div>
        </div>
        <div className={styles['statsRow']}>
          <Badge variant={player.kycStatus as 'approved'} size="sm" />
          <span>Joined {formatDate(player.createdAt)}</span>
          <span>{player.verificationCount} verifications</span>
        </div>
        {recommend && (
          <div className={styles['recommended']}>
            <Badge variant="low" size="sm" label="Recommended primary" />
          </div>
        )}
      </label>
    )
  }

  if (!open || typeof document === 'undefined') return null

  const content = (
    <div className={`${styles['backdrop']} ${styles['backdropOpen']}`} onClick={handleClose}>
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles['header']}>
          <span className={styles['headerTitle']}>Merge player accounts</span>
          <IconButton icon={CloseIcon} label="Close" size="sm" variant="ghost" onClick={handleClose} />
        </div>

        {/* Steps */}
        <div className={styles['steps']}>
          <div className={`${styles['step']} ${step === 0 ? styles['stepActive'] : step > 0 ? styles['stepComplete'] : styles['stepFuture']}`}>
            <span className={styles['stepCircle']}>{step > 0 ? '\u2713' : '1'}</span>
            Choose primary
          </div>
          <div className={styles['stepLine']} />
          <div className={`${styles['step']} ${step === 1 ? styles['stepActive'] : styles['stepFuture']}`}>
            <span className={styles['stepCircle']}>2</span>
            Confirm merge
          </div>
        </div>

        {/* Warning banner */}
        <div className={styles['warningBanner']}>
          <span className={styles['warningIcon']}>{'\u26A0\uFE0F'}</span>
          This action permanently merges two accounts and cannot be undone. The secondary account will be deactivated.
        </div>

        {/* Body */}
        <div className={styles['body']}>
          {step === 0 ? (
            <>
              <div className={styles['instruction']}>
                The primary account is kept active. The secondary account is deactivated and its data merged into the primary.
              </div>
              <div className={styles['radioCards']}>
                {renderRadioCard(match.playerA, recommendA)}
                {renderRadioCard(match.playerB, recommendB)}
              </div>
            </>
          ) : (
            <>
              {/* Primary card */}
              <div className={styles['cardLabelPrimary']} style={{ ...labelStyle }}>Primary account (will survive)</div>
              <div className={`${styles['compactCard']} ${styles['primaryCard']}`}>
                <Avatar name={primary.name} size="sm" />
                <div className={styles['cardInfo']}>
                  <span className={styles['cardName']}>{primary.name}</span>
                  <span className={styles['cardEmail']}>{primary.email} {'\u00b7'} {primary.id}</span>
                </div>
              </div>

              {/* Secondary card */}
              <div className={styles['cardLabelSecondary']} style={{ ...labelStyle, marginTop: 12 }}>Secondary account (will be deactivated)</div>
              <div className={`${styles['compactCard']} ${styles['secondaryCard']}`}>
                <Avatar name={secondary.name} size="sm" />
                <div className={styles['cardInfo']}>
                  <span className={styles['cardName']}>{secondary.name}</span>
                  <span className={styles['cardEmail']}>{secondary.email} {'\u00b7'} {secondary.id}</span>
                </div>
              </div>

              {/* Consequences */}
              <div className={styles['consequences']}>
                <div className={styles['consequencesTitle']}>What happens after merge</div>
                {CONSEQUENCES.map((c) => (
                  <div key={c.category} className={styles['consequenceRow']}>
                    <span className={styles['consequenceIcon']}>{c.icon}</span>
                    <span className={styles['consequenceCategory']}>{c.category}</span>
                    <span className={c.danger ? styles['consequenceOutcomeDanger'] : styles['consequenceOutcome']}>{c.outcome}</span>
                  </div>
                ))}
              </div>

              {/* Confirm checkbox */}
              <div className={styles['confirmCheckbox']}>
                <Checkbox
                  checked={confirmed}
                  onChange={setConfirmed}
                  label="I confirm I have reviewed both accounts and understand this merge is permanent and cannot be reversed."
                  size="sm"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles['footer']}>
          <div>
            {step > 0 && !closeConfirm && (
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}>Back</Button>
            )}
            {closeConfirm && (
              <div className={styles['closeConfirm']}>
                Are you sure?
                <Button variant="ghost" size="sm" onClick={() => setCloseConfirm(false)}>Back</Button>
                <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
              </div>
            )}
          </div>
          <div className={styles['footerRight']}>
            {step === 0 ? (
              <Button variant="primary" size="sm" disabled={selectedId === null} onClick={() => setStep(1)}>
                Next {'\u2192'}
              </Button>
            ) : (
              <Button variant="danger" size="sm" disabled={!confirmed || submitting} onClick={handleConfirm}>
                {submitting ? 'Merging...' : 'Merge accounts permanently'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  lineHeight: 1,
}
