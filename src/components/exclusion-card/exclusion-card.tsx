import { useState, useCallback, type HTMLAttributes } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import styles from './exclusion-card.module.css'

type ExclusionSource = 'player' | 'operator' | 'oasis' | 'cruks' | 'gamstop'
type ExclusionDuration = '3_months' | '6_months' | '1_year' | 'indefinite'
type ExclusionStatus = 'active' | 'expired' | 'lifted'

export interface Exclusion {
  readonly id: string
  readonly source: ExclusionSource
  readonly duration: ExclusionDuration
  readonly appliedAt: string
  readonly expiresAt?: string
  readonly liftedAt?: string
  readonly oasisRef?: string
  readonly status: ExclusionStatus
}

export interface ExclusionCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly exclusion: Exclusion
  readonly onLift?: (id: string, reason: string) => void
}

const SOURCE_LABELS: Record<ExclusionSource, string> = {
  player: 'Player self-exclusion',
  operator: 'Operator-applied',
  oasis: 'OASIS national',
  cruks: 'CRUKS national',
  gamstop: 'GAMSTOP national',
}

const SOURCE_SYSTEM: Record<ExclusionSource, string> = {
  player: 'Platform',
  operator: 'Platform',
  oasis: 'OASIS',
  cruks: 'CRUKS',
  gamstop: 'GAMSTOP',
}

const DURATION_LABELS: Record<ExclusionDuration, string> = {
  '3_months': '3 months',
  '6_months': '6 months',
  '1_year': '1 year',
  'indefinite': 'Indefinite',
}

const STATUS_BADGE: Record<ExclusionStatus, { variant: string; label: string }> = {
  active: { variant: 'blocked', label: 'Active' },
  expired: { variant: 'expired', label: 'Expired' },
  lifted: { variant: 'inactive', label: 'Lifted early' },
}

const LIFT_REASONS = ['Player request', 'Operator decision', 'Regulatory override', 'Error correction'] as const

const CopyIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="5" y="5" width="8" height="8" rx="1.5" />
    <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" />
  </svg>
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ExclusionCard({
  exclusion: ex,
  onLift,
  className,
  ...props
}: ExclusionCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reason, setReason] = useState<string>(LIFT_REASONS[0])
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (ex.oasisRef !== undefined) {
      navigator.clipboard.writeText(ex.oasisRef).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [ex.oasisRef])

  const handleLift = () => {
    onLift?.(ex.id, reason)
    setConfirmOpen(false)
  }

  const badge = STATUS_BADGE[ex.status]

  const expiresLabel = ex.status === 'lifted' && ex.liftedAt !== undefined
    ? `Lifted ${formatDate(ex.liftedAt)}`
    : ex.expiresAt !== undefined
    ? formatDate(ex.expiresAt)
    : 'Never (indefinite)'

  const cardClassNames = [
    styles['card'],
    styles[ex.status],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassNames} {...props}>
      {/* Header */}
      <div className={styles['headerRow']}>
        <span className={styles['sourceLabel']}>{SOURCE_LABELS[ex.source]}</span>
        <Badge variant={badge.variant as 'blocked'} size="sm" label={badge.label} />
      </div>

      {/* Grid */}
      <div className={styles['grid']}>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Duration</span>
          <span className={styles['gridValue']}>{DURATION_LABELS[ex.duration]}</span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Applied</span>
          <span className={styles['gridValue']}>{formatDate(ex.appliedAt)}</span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>{ex.status === 'lifted' ? 'Lifted' : 'Expires'}</span>
          <span className={styles['gridValue']}>{expiresLabel}</span>
        </div>
        <div className={styles['gridItem']}>
          <span className={styles['gridLabel']}>Source system</span>
          <span className={styles['gridValue']}>{SOURCE_SYSTEM[ex.source]}</span>
        </div>
      </div>

      {/* OASIS ref */}
      {ex.oasisRef !== undefined && (
        <div className={styles['refRow']}>
          <span className={styles['refText']}>{ex.oasisRef}</span>
          <IconButton
            icon={CopyIcon}
            label={copied ? 'Copied!' : 'Copy reference'}
            size="sm"
            variant="ghost"
            tooltip
            onClick={handleCopy}
          />
        </div>
      )}

      {/* Footer (active only) */}
      {ex.status === 'active' && (
        <div className={styles['footer']}>
          {ex.oasisRef !== undefined ? (
            <button type="button" className={styles['externalLink']}>
              View OASIS record {'\u2192'}
            </button>
          ) : <span />}

          {!confirmOpen ? (
            <button type="button" className={styles['liftBtn']} onClick={() => setConfirmOpen(true)}>
              Lift exclusion
            </button>
          ) : (
            <div className={styles['confirmRow']}>
              <select
                className={styles['reasonSelect']}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {LIFT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <Button variant="danger" size="sm" onClick={handleLift}>Confirm lift</Button>
              <button type="button" className={styles['cancelLink']} onClick={() => setConfirmOpen(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── ExclusionList ── */

export interface ExclusionListProps extends HTMLAttributes<HTMLDivElement> {
  readonly exclusions: ReadonlyArray<ExclusionCardProps>
  readonly title?: string
}

export function ExclusionList({
  exclusions,
  title = 'Exclusions',
  className,
  ...props
}: ExclusionListProps) {
  const active = exclusions.filter((e) => e.exclusion.status === 'active')
  const historical = [...exclusions.filter((e) => e.exclusion.status !== 'active')]
    .sort((a, b) => new Date(b.exclusion.appliedAt).getTime() - new Date(a.exclusion.appliedAt).getTime())

  const classNames = [styles['list'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      {active.length > 0 && (
        <>
          <div className={styles['listHeader']}>Active</div>
          {active.map((e) => <ExclusionCard key={e.exclusion.id} {...e} />)}
        </>
      )}

      {active.length > 0 && historical.length > 0 && (
        <div className={styles['sectionDivider']} />
      )}

      {historical.length > 0 && (
        <>
          <div className={styles['listHeader']}>History</div>
          {historical.map((e) => <ExclusionCard key={e.exclusion.id} {...e} />)}
        </>
      )}
    </div>
  )
}
