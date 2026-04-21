import { type ReactNode } from 'react'
import { WidgetShell } from './WidgetShell'
import styles from './SelfExclusionWidget.module.css'

export type SelfExclusionState = 'idle' | 'confirm' | 'applied'
export type SelfExclusionVariant = 'full' | 'compact'
export type ExclusionDuration = '3_months' | '6_months' | '1_year' | 'indefinite'

/**
 * OASIS (Gemeinsame Glücksspielbehörde der Länder) reason categories for
 * self-exclusion under GlüStV 2021. Multi-select — a player may cite more
 * than one reason. Used only when `requireReason` is true.
 */
export type OasisReason =
  | 'problem_gambling'
  | 'financial_burden'
  | 'too_much_time'
  | 'preventive'
  | 'health'
  | 'other'

export interface CrisisHelpline {
  readonly name: string
  readonly number: string
}

export interface SelfExclusionWidgetProps {
  readonly state: SelfExclusionState
  readonly variant?: SelfExclusionVariant
  readonly playerName?: string
  readonly selectedDuration?: ExclusionDuration
  readonly onDurationSelect?: (duration: string) => void
  readonly onStartExclusion?: () => void
  readonly onConfirm?: () => void
  readonly onCancel?: () => void
  readonly exclusionRef?: string
  readonly exclusionExpiry?: string
  readonly remainingBalance?: number
  readonly currency?: string
  /**
   * Regulatory backstop (GlüStV 2021 §6 requires problem-gambling support
   * contact to be displayed in self-exclusion confirmations). If the operator
   * omits this prop, the BZgA default below still renders to prevent an
   * integration bug from creating a compliance violation.
   */
  readonly crisisHelpline?: CrisisHelpline
  /**
   * Enable the OASIS reason selector in the `confirm` state. When true, the
   * confirm CTA is additionally disabled until at least one reason is
   * selected. German GGL scope requires a reason be submitted alongside
   * the exclusion record; other jurisdictions (CRUKS, GAMSTOP, etc.) do not.
   * Default: false.
   */
  readonly requireReason?: boolean
  /** Currently-selected OASIS reasons (controlled). */
  readonly selectedReasons?: readonly OasisReason[]
  /** Fires when the user toggles a reason on or off. */
  readonly onReasonsChange?: (reasons: readonly string[]) => void
}

const DEFAULT_CRISIS_HELPLINE: CrisisHelpline = {
  name: 'BZgA',
  number: '0800 1372700',
}

const DURATION_LABEL: Record<ExclusionDuration, string> = {
  '3_months': '3 months',
  '6_months': '6 months',
  '1_year': '1 year',
  indefinite: 'Indefinite (cannot be reversed)',
}

const DURATION_DESC: Record<ExclusionDuration, string> = {
  '3_months': 'Short break. Auto-reinstates after 3 months.',
  '6_months': 'Medium break. Auto-reinstates after 6 months.',
  '1_year': 'Long break. Auto-reinstates after 1 year.',
  indefinite: 'Permanent. Requires written request to reverse after 1 year minimum.',
}

const DURATION_ORDER: readonly ExclusionDuration[] = [
  '3_months',
  '6_months',
  '1_year',
  'indefinite',
]

const OASIS_REASON_LABEL: Record<OasisReason, string> = {
  problem_gambling: 'Problematic gambling behaviour',
  financial_burden: 'Financial strain',
  too_much_time: 'Too much time spent gambling',
  preventive: 'Preventive measure',
  health: 'Health concerns',
  other: 'Other reason',
}

const OASIS_REASON_DESC: Record<OasisReason, string> = {
  problem_gambling: 'Play has become compulsive or hard to stop.',
  financial_burden: 'Losses affecting household or personal finances.',
  too_much_time: 'Gambling is taking time from work, family, or sleep.',
  preventive: 'No immediate issue — proactive break.',
  health: 'Impact on mental or physical wellbeing.',
  other: 'A reason not covered by the categories above.',
}

const OASIS_REASON_ORDER: readonly OasisReason[] = [
  'problem_gambling',
  'financial_burden',
  'too_much_time',
  'preventive',
  'health',
  'other',
]

function toggleReason(
  current: readonly OasisReason[],
  next: OasisReason,
): OasisReason[] {
  return current.includes(next)
    ? current.filter((r) => r !== next)
    : [...current, next]
}

const IDLE_BULLETS: readonly string[] = [
  'Takes effect immediately',
  'Registered with national exclusion registers (OASIS, CRUKS, etc.)',
  'Your balance remains withdrawable',
  'Cannot be cancelled or shortened during the exclusion period',
]

/* ── Icons ─────────────────────────────────────────── */

const STOP_ICON: ReactNode = (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="15.5" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" />
    <path
      d="M8 8 L28 28"
      stroke="rgba(239,68,68,0.9)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

const WARNING_ICON: ReactNode = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l10 18H2L12 3z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M12 10v5M12 18v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const CHECK_ICON: ReactNode = (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 6.3L5 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LOCK_MINI_ICON: ReactNode = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const HEART_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 20s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 9c0 6.5-7 11-7 11z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

/* ── Helpers ───────────────────────────────────────── */

function formatExpiry(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

/* ── Component ─────────────────────────────────────── */

export function SelfExclusionWidget(props: SelfExclusionWidgetProps) {
  const {
    state,
    variant = 'full',
    playerName,
    selectedDuration,
    onDurationSelect,
    onStartExclusion,
    onConfirm,
    onCancel,
    exclusionRef,
    exclusionExpiry,
    remainingBalance,
    currency,
    crisisHelpline = DEFAULT_CRISIS_HELPLINE,
    requireReason = false,
    selectedReasons,
    onReasonsChange,
  } = props

  void playerName

  const reasons: readonly OasisReason[] = selectedReasons ?? []

  /* ── IDLE / COMPACT ── */
  if (state === 'idle' && variant === 'compact') {
    return (
      <button
        type="button"
        className={styles['compactPill']}
        onClick={onStartExclusion}
      >
        <span className={styles['compactDot']} aria-hidden="true" />
        <span className={styles['compactLabel']}>Need a break? Self-exclude →</span>
      </button>
    )
  }

  /* ── IDLE / FULL ── */
  if (state === 'idle') {
    return (
      <WidgetShell
        title="Self-exclusion"
        footer={
          <button
            type="button"
            className={styles['btnDangerFull']}
            onClick={onStartExclusion}
          >
            Exclude me now
          </button>
        }
      >
        <p className={styles['idleIntro']}>
          If you need a break from gambling, you can exclude yourself from this
          platform for a set period. This is applied immediately.
        </p>
        <ul className={styles['bulletList']}>
          {IDLE_BULLETS.map((b) => (
            <li key={b} className={styles['bulletItem']}>
              <span className={styles['bullet']} aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </WidgetShell>
    )
  }

  /* ── CONFIRM ── */
  if (state === 'confirm') {
    const durationMissing = selectedDuration === undefined
    const reasonMissing = requireReason && reasons.length === 0
    const disabled = durationMissing || reasonMissing

    const ctaLabel = durationMissing
      ? 'Select a duration'
      : reasonMissing
        ? 'Select a reason'
        : `Confirm — exclude me for ${DURATION_LABEL[selectedDuration]}`

    function handleToggleReason(r: OasisReason) {
      onReasonsChange?.(toggleReason(reasons, r))
    }

    return (
      <WidgetShell
        title="Confirm self-exclusion"
        headerTint="danger"
        footer={
          <div className={styles['confirmFooter']}>
            <button type="button" className={styles['btnGhost']} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className={styles['btnDanger']}
              onClick={onConfirm}
              disabled={disabled}
            >
              {ctaLabel}
            </button>
          </div>
        }
      >
        <div className={styles['warnBanner']} role="alert">
          <span className={styles['warnIcon']}>{WARNING_ICON}</span>
          <span className={styles['warnText']}>
            This action cannot be reversed or shortened once applied.
          </span>
        </div>

        <div className={styles['durationLabel']}>Choose duration</div>
        <div
          className={styles['durationList']}
          role="radiogroup"
          aria-label="Exclusion duration"
        >
          {DURATION_ORDER.map((d) => {
            const checked = selectedDuration === d
            const cardClass = [
              styles['durationCard'],
              checked ? styles['durationCardSelected'] : undefined,
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={checked}
                className={cardClass}
                onClick={() => onDurationSelect?.(d)}
              >
                <span
                  className={
                    checked
                      ? `${styles['radio']} ${styles['radioSelected']}`
                      : styles['radio']
                  }
                  aria-hidden="true"
                >
                  {checked && <span className={styles['radioInner']} />}
                </span>
                <span className={styles['durationText']}>
                  <span className={styles['durationTitle']}>{DURATION_LABEL[d]}</span>
                  <span className={styles['durationDesc']}>{DURATION_DESC[d]}</span>
                </span>
              </button>
            )
          })}
        </div>

        {requireReason && (
          <div className={styles['reasonSection']}>
            <div className={styles['reasonLabelRow']}>
              <span className={styles['durationLabel']}>Reason for exclusion</span>
              <span className={styles['reasonBadge']}>
                <span className={styles['reasonBadgeIcon']}>{LOCK_MINI_ICON}</span>
                OASIS · required
              </span>
            </div>
            <div
              className={styles['reasonList']}
              role="group"
              aria-label="OASIS exclusion reasons"
            >
              {OASIS_REASON_ORDER.map((r) => {
                const checked = reasons.includes(r)
                const cardClass = [
                  styles['reasonCard'],
                  checked ? styles['reasonCardSelected'] : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={r}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className={cardClass}
                    onClick={() => handleToggleReason(r)}
                  >
                    <span
                      className={
                        checked
                          ? `${styles['checkbox']} ${styles['checkboxChecked']}`
                          : styles['checkbox']
                      }
                      aria-hidden="true"
                    >
                      {checked && (
                        <span className={styles['checkboxMark']}>{CHECK_ICON}</span>
                      )}
                    </span>
                    <span className={styles['reasonText']}>
                      <span className={styles['reasonTitle']}>
                        {OASIS_REASON_LABEL[r]}
                      </span>
                      <span className={styles['reasonDesc']}>
                        {OASIS_REASON_DESC[r]}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className={styles['reasonDisclaimer']}>
              Selected reasons are reported to OASIS (Gemeinsame Glücksspielbehörde
              der Länder) under GlüStV 2021 §8. Encrypted in transit; used only
              for regulatory purposes.
            </p>
          </div>
        )}
      </WidgetShell>
    )
  }

  /* ── APPLIED ── (dark, hardcoded #0F172A, regardless of theme) */
  const expiryText =
    exclusionExpiry !== undefined
      ? `Until ${formatExpiry(exclusionExpiry)}`
      : 'This exclusion is indefinite.'

  const balance =
    remainingBalance !== undefined && remainingBalance > 0 && currency !== undefined
      ? `${currency} ${formatAmount(remainingBalance)}`
      : undefined

  return (
    <div className={styles['appliedCard']} role="region" aria-label="Self-exclusion applied">
      <div className={styles['appliedStop']} aria-hidden="true">{STOP_ICON}</div>

      <h2 className={styles['appliedHeading']}>You have been excluded</h2>
      <div className={styles['appliedExpiry']}>{expiryText}</div>

      {exclusionRef !== undefined && (
        <div className={styles['appliedRef']}>
          <div className={styles['appliedRefLabel']}>Reference</div>
          <div className={styles['appliedRefValue']}>{exclusionRef}</div>
        </div>
      )}

      {balance !== undefined && (
        <div className={styles['appliedBalance']}>
          <div className={styles['appliedBalanceText']}>
            You have {balance} remaining.
          </div>
          <a
            href="#contact-support"
            className={styles['appliedBalanceLink']}
            onClick={(e) => e.preventDefault()}
          >
            Contact support to arrange withdrawal →
          </a>
        </div>
      )}

      <div className={styles['appliedCrisis']}>
        <span className={styles['appliedCrisisIcon']}>{HEART_ICON}</span>
        <div className={styles['appliedCrisisText']}>
          <div className={styles['appliedCrisisHeading']}>Need support?</div>
          <div className={styles['appliedCrisisLine']}>
            {crisisHelpline.name}: {crisisHelpline.number}
          </div>
          <div className={styles['appliedCrisisNote']}>Free, 24/7, confidential.</div>
        </div>
      </div>

      <div
        className={styles['appliedBrand']}
        aria-label="Powered by Identity Beyond"
      >
        <span className={styles['appliedBrandDot']} aria-hidden="true" />
        <span className={styles['appliedBrandText']}>Powered by Identity Beyond</span>
      </div>
    </div>
  )
}
