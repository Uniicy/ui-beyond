import { useState, useCallback } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import { ProgressBar } from '../progress-bar'
import styles from './duplicate-match-card.module.css'

interface PlayerSide {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly kycStatus: string
  readonly createdAt: string
  readonly market: string
}

interface Signal {
  readonly field: 'name' | 'email_domain' | 'date_of_birth' | 'device' | 'ip_subnet' | 'document'
  readonly similarity: number
  readonly label: string
}

export interface DuplicateMatch {
  readonly id: string
  readonly confidence: number
  readonly detectedAt: string
  readonly status: 'pending' | 'confirmed' | 'dismissed'
  readonly playerA: PlayerSide
  readonly playerB: PlayerSide
  readonly signals: ReadonlyArray<Signal>
}

export interface DuplicateMatchCardProps {
  readonly match: DuplicateMatch
  readonly onConfirmMerge: (matchId: string) => void
  readonly onDismiss: (matchId: string) => void
  readonly className?: string
}

const CopyIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="5" y="5" width="8" height="8" rx="1.5" />
    <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" />
  </svg>
)

const CloseIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
)

function getBand(conf: number): { cls: string; confCls: string; label: string } {
  if (conf >= 0.9) return { cls: styles['high'] ?? '', confCls: styles['confHigh'] ?? '', label: 'High confidence \u00b7 suspected duplicate' }
  if (conf >= 0.7) return { cls: styles['medium'] ?? '', confCls: styles['confMedium'] ?? '', label: 'Medium confidence' }
  return { cls: styles['low'] ?? '', confCls: styles['confLow'] ?? '', label: 'Low confidence' }
}

function signalIntent(sim: number): 'success' | 'warning' | 'danger' {
  if (sim > 0.9) return 'success'
  if (sim > 0.7) return 'warning'
  return 'danger'
}

function signalPctClass(sim: number): string {
  if (sim > 0.9) return styles['signalPctSuccess'] ?? ''
  if (sim > 0.7) return styles['signalPctWarning'] ?? ''
  return styles['signalPctDanger'] ?? ''
}

function formatRelative(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  return `${Math.floor(diffH / 24)}d ago`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function PlayerCard({ player }: { readonly player: PlayerSide }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(player.id).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [player.id])

  return (
    <div className={styles['playerCard']}>
      <div className={styles['playerTop']}>
        <Avatar name={player.name} size="md" />
        <div className={styles['playerInfo']}>
          <span className={styles['playerName']}>{player.name}</span>
          <span className={styles['playerEmail']}>{player.email}</span>
        </div>
      </div>
      <div className={styles['playerDetails']}>
        <Badge variant={player.kycStatus as 'approved'} size="sm" />
        <MarketTag market={player.market as 'de'} size="sm" showLicense={false} />
        <span className={styles['joined']}>Joined {formatDate(player.createdAt)}</span>
      </div>
      <div className={styles['playerIdRow']}>
        <span className={styles['playerId']}>{player.id}</span>
        <IconButton icon={CopyIcon} label={copied ? 'Copied!' : 'Copy ID'} size="sm" variant="ghost" tooltip onClick={handleCopy} />
      </div>
    </div>
  )
}

export function DuplicateMatchCard({
  match: m,
  onConfirmMerge,
  onDismiss,
  className,
}: DuplicateMatchCardProps) {
  const band = getBand(m.confidence)
  const isDone = m.status === 'dismissed' || m.status === 'confirmed'

  const cardClassNames = [
    styles['card'],
    band.cls,
    isDone ? styles['dismissed'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassNames}>
      {/* Header */}
      <div className={styles['header']}>
        <div className={styles['headerLeft']}>
          <span className={`${styles['confidence']} ${band.confCls}`}>
            {Math.round(m.confidence * 100)}%
          </span>
          <span className={styles['bandLabel']}>
            {band.label}
            {isDone && <>{' \u00b7 '}<Badge variant={m.status === 'confirmed' ? 'approved' : 'inactive'} size="sm" label={m.status === 'confirmed' ? 'Merged' : 'Dismissed'} /></>}
          </span>
        </div>
        <div className={styles['headerRight']}>
          <span className={styles['timestamp']}>Detected {formatRelative(m.detectedAt)}</span>
          {!isDone && (
            <IconButton icon={CloseIcon} label="Dismiss" size="sm" variant="ghost" onClick={() => onDismiss(m.id)} />
          )}
        </div>
      </div>

      {/* Player cards */}
      <div className={styles['players']}>
        <PlayerCard player={m.playerA} />
        <PlayerCard player={m.playerB} />
      </div>

      {/* Signals */}
      <div className={styles['signals']}>
        <div className={styles['signalsLabel']}>Matching signals</div>
        {m.signals.map((sig) => (
          <div key={sig.field} className={styles['signalRow']}>
            <span className={styles['signalField']}>{sig.label}</span>
            <div className={styles['signalBar']}>
              <ProgressBar value={sig.similarity * 100} height="xs" intent={signalIntent(sig.similarity)} rounded />
            </div>
            <span className={`${styles['signalPct']} ${signalPctClass(sig.similarity)}`}>
              {Math.round(sig.similarity * 100)}%
            </span>
          </div>
        ))}
      </div>

      {/* Actions or status footer */}
      {!isDone ? (
        <div className={styles['actions']}>
          <Button variant="ghost" size="sm" onClick={() => onDismiss(m.id)}>
            Not a duplicate {'\u2192'} dismiss
          </Button>
          <Button variant="danger" size="sm" onClick={() => onConfirmMerge(m.id)}>
            Confirm merge {'\u2192'}
          </Button>
        </div>
      ) : (
        <div className={styles['statusFooter']}>
          <span>{m.status === 'confirmed' ? 'Players merged' : 'Dismissed'} by Sarah Klein</span>
          <span>{formatRelative(m.detectedAt)}</span>
        </div>
      )}
    </div>
  )
}
