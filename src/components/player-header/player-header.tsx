import { useState, useCallback } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import styles from './player-header.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'

export interface PlayerHeaderPlayer {
  readonly id: string
  readonly externalId: string
  readonly name: string
  readonly email: string
  readonly dateOfBirth: string
  readonly phone?: string
  readonly kycStatus: string
  readonly amlRiskTier: string
  readonly rgIsExcluded: boolean
  readonly markets: ReadonlyArray<Market>
  readonly createdAt: string
}

export interface PlayerHeaderProps {
  readonly player: PlayerHeaderPlayer
  readonly onNewVerification?: () => void
  readonly onFlagPlayer?: () => void
  readonly onMoreActions?: () => void
  readonly className?: string
}

const CopyIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="5" y="5" width="8" height="8" rx="1.5" />
    <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" />
  </svg>
)

const MoreIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
)

function computeAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function formatDob(dob: string): string {
  const d = new Date(dob)
  const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return `Born ${formatted} (age ${computeAge(dob)})`
}

function formatMemberSince(iso: string): string {
  const d = new Date(iso)
  return `Member since ${d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
}

export function PlayerHeader({
  player: p,
  onNewVerification,
  onFlagPlayer,
  onMoreActions,
  className,
}: PlayerHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(p.id).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [p.id])

  const headerClassNames = [styles['header'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={headerClassNames}>
      {/* Left */}
      <div className={styles['left']}>
        <Avatar name={p.name} size="lg" />
        <div className={styles['identity']}>
          <span className={styles['name']}>{p.name}</span>
          <span className={styles['email']}>{p.email}</span>
          <span className={styles['dob']}>{formatDob(p.dateOfBirth)}</span>
        </div>
      </div>

      {/* Centre */}
      <div className={styles['centre']}>
        <div className={styles['badges']}>
          <Badge variant={p.kycStatus as 'approved'} size="sm" />
          <Badge variant={p.amlRiskTier as 'standard'} size="sm" />
          {p.rgIsExcluded && <Badge variant="blocked" size="sm" label="Excluded" />}
        </div>
        <div className={styles['markets']}>
          {p.markets.map((m) => (
            <MarketTag key={m} market={m} size="sm" />
          ))}
          <span className={styles['dob']}>{'\u00b7'} {formatMemberSince(p.createdAt)}</span>
        </div>
      </div>

      {/* Right */}
      <div className={styles['right']}>
        <div className={styles['ids']}>
          <div className={styles['playerIdRow']}>
            <span className={styles['playerId']}>{p.id}</span>
            <IconButton
              icon={CopyIcon}
              label={copied ? 'Copied!' : 'Copy ID'}
              size="sm"
              variant="ghost"
              tooltip
              onClick={handleCopy}
            />
          </div>
          <span className={styles['externalId']}>ext: {p.externalId}</span>
        </div>

        <div className={styles['actions']}>
          {onFlagPlayer !== undefined && (
            <button type="button" className={styles['flagBtn']} onClick={onFlagPlayer}>
              Flag player
            </button>
          )}
          {onNewVerification !== undefined && (
            <Button variant="primary" size="sm" onClick={onNewVerification}>
              New verification
            </Button>
          )}
          {onMoreActions !== undefined && (
            <IconButton icon={MoreIcon} label="More actions" size="sm" variant="ghost" onClick={onMoreActions} />
          )}
        </div>
      </div>
    </div>
  )
}
