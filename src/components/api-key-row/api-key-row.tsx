import { useState, useRef, useEffect, useCallback } from 'react'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { StatusDot } from '../status-dot'
import styles from './api-key-row.module.css'

type Env = 'production' | 'staging'
type KeyStatus = 'active' | 'revoked' | 'expired'

export interface ApiKey {
  readonly id: string; readonly name: string; readonly environment: Env; readonly maskedKey: string
  readonly fullKey?: string; readonly scopes: ReadonlyArray<string>; readonly createdAt: string
  readonly lastUsedAt?: string; readonly expiresAt?: string; readonly status: KeyStatus
}

export interface ApiKeyRowProps {
  readonly apiKey: ApiKey
  readonly onReveal: (id: string) => Promise<string>
  readonly onCopy: (id: string) => void
  readonly onRotate: (id: string) => void
  readonly onRevoke: (id: string) => void
  readonly className?: string
}

const EyeIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="3" /><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" /></svg>)
const CopyIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" /></svg>)
const RotateIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 6.5A5.5 5.5 0 0 1 13 6M13.5 9.5A5.5 5.5 0 0 1 3 10" /><path d="M13 3v3h-3M3 13v-3h3" /></svg>)
const RevokeIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>)

function formatScope(s: string): string {
  const [mod, perm] = s.split(':')
  return `${mod}:${perm === 'read' ? 'r' : perm === 'write' ? 'rw' : perm}`
}

function formatRelative(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`
}

export function ApiKeyRow({ apiKey: k, onReveal, onCopy, onRotate, onRevoke, className }: ApiKeyRowProps) {
  const [revealed, setRevealed] = useState(false)
  const [revealedKey, setRevealedKey] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [copied, setCopied] = useState(false)
  const [revokeOpen, setRevokeOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startReveal = useCallback(async () => {
    const full = await onReveal(k.id)
    setRevealedKey(full)
    setRevealed(true)
    setCountdown(5)
    if (timerRef.current) clearInterval(timerRef.current)
    const start = Date.now()
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, 5 - Math.floor((Date.now() - start) / 1000))
      setCountdown(remaining)
      if (remaining <= 0) { setRevealed(false); if (timerRef.current) clearInterval(timerRef.current) }
    }, 200)
  }, [k.id, onReveal])

  const handleCopy = useCallback(async () => {
    const full = await onReveal(k.id)
    navigator.clipboard.writeText(full).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 1500)
    onCopy(k.id)
  }, [k.id, onReveal, onCopy])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const isInactive = k.status === 'revoked' || k.status === 'expired'
  const rowCls = [styles['row'], isInactive ? (k.status === 'revoked' ? styles['revoked'] : styles['expired']) : undefined, className].filter(Boolean).join(' ')
  const visibleScopes = k.scopes.slice(0, 3)
  const extraScopes = k.scopes.length > 3 ? k.scopes.length - 3 : 0
  const isExpired = k.expiresAt !== undefined && new Date(k.expiresAt).getTime() < Date.now()

  return (
    <>
      <div className={rowCls}>
        <div className={styles['nameCell']}>
          <span className={styles['keyName']}>{k.name}</span>
          <span className={`${styles['envBadge']} ${k.environment === 'production' ? styles['envProd'] : styles['envStaging']}`}>{k.environment === 'production' ? 'PROD' : 'STAGING'}</span>
        </div>
        <div className={styles['keyCell']}>
          <div className={styles['keyRow']}>
            <span className={`${styles['keyText']} ${revealed ? styles['keyRevealed'] : ''}`}>{revealed ? revealedKey : (isInactive ? '\u2022'.repeat(20) : k.maskedKey)}</span>
            {!isInactive && <IconButton icon={EyeIcon} label="Reveal" size="sm" variant="ghost" onClick={startReveal} />}
            {!isInactive && <IconButton icon={CopyIcon} label={copied ? 'Copied!' : 'Copy'} size="sm" variant="ghost" tooltip onClick={handleCopy} />}
          </div>
          {revealed && <span className={styles['countdown']}>Hiding in {countdown}s\u2026</span>}
        </div>
        <div className={styles['scopesCell']}>
          {visibleScopes.map((s) => <Badge key={s} variant="standard" size="sm" label={formatScope(s)} />)}
          {extraScopes > 0 && <span className={styles['moreScopes']}>+{extraScopes}</span>}
        </div>
        <span className={styles['meta']}>{formatRelative(k.createdAt)}</span>
        <span className={styles['meta']}>{k.lastUsedAt ? formatRelative(k.lastUsedAt) : 'Never'}</span>
        <span className={`${styles['meta']} ${isExpired ? styles['metaDanger'] : ''}`}>{k.expiresAt ? (isExpired ? `Expired` : formatRelative(k.expiresAt)) : 'Never'}</span>
        <div className={styles['actions']}>
          {!isInactive ? (
            <>
              <IconButton icon={RotateIcon} label="Rotate" size="sm" variant="ghost" onClick={() => onRotate(k.id)} />
              <IconButton icon={RevokeIcon} label="Revoke" size="sm" variant="ghost" intent="danger" onClick={() => setRevokeOpen(true)} />
            </>
          ) : (
            <button type="button" className={styles['deleteLink']}>Delete key</button>
          )}
        </div>
      </div>
      {revokeOpen && (
        <div className={styles['revokeBar']}>
          Revoke this key? All requests using it will fail immediately.
          <button type="button" className={styles['revokeBtn']} onClick={() => { onRevoke(k.id); setRevokeOpen(false) }}>Revoke now</button>
          <button type="button" className={styles['cancelLink']} onClick={() => setRevokeOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  )
}
