import { useEffect, useState, type ReactNode } from 'react'
import { WidgetShell } from './WidgetShell'
import { WidgetLimitBar } from './WidgetLimitBar'
import styles from './LimitsDisplayWidget.module.css'

export type LimitsDisplayState = 'normal' | 'near_limit' | 'at_limit' | 'change_form'

export type LimitSource = 'self' | 'operator' | 'regulatory'

export interface LimitEntry {
  readonly label: string
  readonly used: number
  readonly limit: number
  readonly currency?: string
  readonly unit?: string
  readonly source: LimitSource
  readonly periodResetLabel: string
  readonly canChange: boolean
}

export interface LimitsDisplayWidgetProps {
  readonly state: LimitsDisplayState
  readonly limits: readonly LimitEntry[]
  readonly changingLimitIndex?: number
  readonly onChangeLimitClick?: (index: number) => void
  readonly onChangeLimitSubmit?: (index: number, newAmount: number) => void
  readonly onChangeLimitCancel?: () => void
  readonly coolingOffNote?: string
}

/* ── Helpers ─────────────────────────────────────── */

function ratio(e: LimitEntry): number {
  return e.limit > 0 ? e.used / e.limit : 0
}

function pickTopLimit(limits: readonly LimitEntry[]): LimitEntry | undefined {
  if (limits.length === 0) return undefined
  return [...limits].sort((a, b) => ratio(b) - ratio(a))[0]
}

function pickBreachedLimit(limits: readonly LimitEntry[]): LimitEntry | undefined {
  return limits.find((l) => l.used > l.limit)
}

function formatAmount(n: number): string {
  const opts: Intl.NumberFormatOptions =
    n < 100
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  return new Intl.NumberFormat('en-US', opts).format(n)
}

function formatQuantity(value: number, entry: LimitEntry): string {
  if (entry.currency !== undefined) return `${entry.currency} ${formatAmount(value)}`
  if (entry.unit !== undefined) return `${value} ${entry.unit}`
  return String(value)
}

/* ── Icons ───────────────────────────────────────── */

const INFO_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 11v5.5M12 8v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const BLOCKED_ICON: ReactNode = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2.5" />
    <path d="M8.5 8.5 L31.5 31.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/* ── Sub-views ───────────────────────────────────── */

function LimitsStack({
  limits,
  onChangeLimitClick,
}: {
  readonly limits: readonly LimitEntry[]
  readonly onChangeLimitClick?: (index: number) => void
}) {
  return (
    <div className={styles['barStack']}>
      {limits.map((l, i) => (
        <WidgetLimitBar
          key={`${l.label}-${i}`}
          label={l.label}
          used={l.used}
          limit={l.limit}
          {...(l.currency !== undefined ? { currency: l.currency as 'EUR' | 'MUR' | 'GBP' } : {})}
          {...(l.unit !== undefined ? { unit: l.unit } : {})}
          source={l.source}
          periodResetLabel={l.periodResetLabel}
          canChange={l.canChange}
          {...(onChangeLimitClick !== undefined
            ? { onChangeClick: () => onChangeLimitClick(i) }
            : {})}
        />
      ))}
    </div>
  )
}

/* ── Component ──────────────────────────────────── */

export function LimitsDisplayWidget(props: LimitsDisplayWidgetProps) {
  const {
    state,
    limits,
    changingLimitIndex = 0,
    onChangeLimitClick,
    onChangeLimitSubmit,
    onChangeLimitCancel,
    coolingOffNote,
  } = props

  /* ── NORMAL ── */
  if (state === 'normal') {
    return (
      <WidgetShell title="Your limits">
        <LimitsStack
          limits={limits}
          {...(onChangeLimitClick !== undefined ? { onChangeLimitClick } : {})}
        />
      </WidgetShell>
    )
  }

  /* ── NEAR LIMIT ── */
  if (state === 'near_limit') {
    const top = pickTopLimit(limits)
    const pct = top !== undefined ? Math.round(ratio(top) * 100) : 0
    const remainingValue = top !== undefined ? Math.max(0, top.limit - top.used) : 0
    const remaining = top !== undefined ? formatQuantity(remainingValue, top) : ''
    const topLabel = top?.label.toLowerCase() ?? 'limit'

    return (
      <WidgetShell
        title="Approaching limit"
        headerRight={
          <span className={`${styles['statusTag']} ${styles['statusTagWarning']}`}>
            <span className={`${styles['statusDot']} ${styles['statusDotWarning']}`} />
            Attention
          </span>
        }
      >
        <div className={styles['callout']} role="note">
          <div className={styles['calloutTitle']}>You're approaching your limit</div>
          <div className={styles['calloutCopy']}>
            You've used {pct}% of your {topLabel}. {remaining} remaining.
          </div>
        </div>
        <LimitsStack
          limits={limits}
          {...(onChangeLimitClick !== undefined ? { onChangeLimitClick } : {})}
        />
      </WidgetShell>
    )
  }

  /* ── AT LIMIT ── */
  if (state === 'at_limit') {
    const breached = pickBreachedLimit(limits)
    const limitLine =
      breached !== undefined
        ? `Your ${formatQuantity(breached.limit, breached)} ${breached.label.toLowerCase()} resets on ${breached.periodResetLabel}.`
        : 'Your limit will reset next period.'

    return (
      <WidgetShell
        title="Deposit limit reached"
        headerRight={
          <span className={`${styles['statusTag']} ${styles['statusTagDanger']}`}>
            <span className={`${styles['statusDot']} ${styles['statusDotDanger']}`} />
            Blocked
          </span>
        }
      >
        <div className={styles['atLimitTop']}>
          <div className={styles['blockedIcon']} aria-hidden="true">{BLOCKED_ICON}</div>
          <div className={styles['atLimitHeading']}>Deposits are paused</div>
          <p className={styles['atLimitCopy']}>{limitLine}</p>
          <p className={styles['atLimitCopySecondary']}>
            You can continue to place bets with your current balance.
          </p>
        </div>
        <div className={styles['barStackSpaced']}>
          <LimitsStack
            limits={limits}
            {...(onChangeLimitClick !== undefined ? { onChangeLimitClick } : {})}
          />
        </div>
      </WidgetShell>
    )
  }

  /* ── CHANGE FORM ── */
  return (
    <ChangeForm
      limits={limits}
      changingLimitIndex={changingLimitIndex}
      {...(coolingOffNote !== undefined ? { coolingOffNote } : {})}
      {...(onChangeLimitSubmit !== undefined ? { onChangeLimitSubmit } : {})}
      {...(onChangeLimitCancel !== undefined ? { onChangeLimitCancel } : {})}
    />
  )
}

function ChangeForm({
  limits,
  changingLimitIndex,
  coolingOffNote,
  onChangeLimitSubmit,
  onChangeLimitCancel,
}: {
  readonly limits: readonly LimitEntry[]
  readonly changingLimitIndex: number
  readonly coolingOffNote?: string
  readonly onChangeLimitSubmit?: (index: number, newAmount: number) => void
  readonly onChangeLimitCancel?: () => void
}) {
  const entry: LimitEntry | undefined = limits[changingLimitIndex]
  const initial = entry?.limit ?? 0
  const [amount, setAmount] = useState<string>(String(initial))

  useEffect(() => {
    setAmount(String(entry?.limit ?? 0))
  }, [entry?.limit])

  function handleSubmit() {
    if (entry === undefined) return
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    onChangeLimitSubmit?.(changingLimitIndex, parsed)
  }

  if (entry === undefined) {
    return (
      <WidgetShell title="Change your limit">
        <p className={styles['changeError']}>No limit selected.</p>
      </WidgetShell>
    )
  }

  const prefix = entry.currency ?? (entry.unit !== undefined ? '' : '')
  const hasPrefix = prefix.length > 0

  return (
    <WidgetShell
      title="Change your limit"
      footer={
        <div className={styles['changeFooter']}>
          <button
            type="button"
            className={styles['btnGhost']}
            onClick={onChangeLimitCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles['btnPrimary']}
            onClick={handleSubmit}
          >
            Confirm new limit
          </button>
        </div>
      }
    >
      <div className={styles['changeContext']}>
        <div className={styles['changeContextLabel']}>{entry.label}</div>
        <div className={styles['changeContextValue']}>
          Current: {formatQuantity(entry.limit, entry)}
        </div>
        <div className={styles['changeContextUsage']}>
          Used this period: {formatQuantity(entry.used, entry)}
        </div>
      </div>

      <div className={styles['changeFormGroup']}>
        <label className={styles['changeInputLabel']} htmlFor="limit-new-amount">
          New limit
        </label>
        <div className={styles['changeInputWrap']}>
          {hasPrefix && <span className={styles['changeInputPrefix']}>{prefix}</span>}
          <input
            id="limit-new-amount"
            type="number"
            inputMode="numeric"
            min={0}
            step={entry.currency !== undefined ? 10 : 1}
            className={hasPrefix ? styles['changeInputWithPrefix'] : styles['changeInput']}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {entry.unit !== undefined && (
            <span className={styles['changeInputSuffix']}>{entry.unit}</span>
          )}
        </div>
      </div>

      {coolingOffNote !== undefined && (
        <div className={styles['coolingCard']} role="note">
          <span className={styles['coolingIcon']}>{INFO_ICON}</span>
          <span className={styles['coolingText']}>{coolingOffNote}</span>
        </div>
      )}
    </WidgetShell>
  )
}
