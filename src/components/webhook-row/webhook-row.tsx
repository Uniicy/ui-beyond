import { useState, useCallback } from 'react'
import { IconButton } from '../icon-button'
import { StatusDot } from '../status-dot'
import styles from './webhook-row.module.css'

export interface WebhookSummary {
  readonly id: string
  readonly url: string
  readonly description?: string
  readonly eventCount: number
  readonly active: boolean
  readonly lastDeliveryAt?: string
  readonly lastDeliveryStatus?: 'success' | 'failed' | 'pending'
  readonly failureCount24h: number
}

export interface WebhookRowProps {
  readonly webhook: WebhookSummary
  readonly onToggle: (id: string, active: boolean) => void
  readonly onTest: (id: string) => Promise<{ status: number; durationMs: number }>
  readonly onClick: (id: string) => void
  readonly className?: string
}

const CopyIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" /></svg>)

function formatRelative(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function truncateUrl(url: string, max = 40): string {
  return url.length > max ? `${url.slice(0, max)}\u2026` : url
}

export function WebhookRow({ webhook: w, onToggle, onTest, onClick, className }: WebhookRowProps) {
  const [testState, setTestState] = useState<'idle' | 'sending' | 'success' | 'failure'>('idle')
  const [testCode, setTestCode] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleTest = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    setTestState('sending')
    try {
      const res = await onTest(w.id)
      setTestCode(res.status)
      setTestState(res.status < 400 ? 'success' : 'failure')
    } catch {
      setTestState('failure')
      setTestCode(0)
    }
    setTimeout(() => setTestState('idle'), 2000)
  }, [w.id, onTest])

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(w.url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [w.url])

  const rowCls = [
    styles['row'],
    !w.active ? styles['inactive'] : undefined,
    w.failureCount24h > 3 ? styles['borderWarning'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rowCls} onClick={() => onClick(w.id)}>
      <div className={styles['urlCell']}>
        <div className={styles['urlRow']}>
          <span className={styles['url']}>{truncateUrl(w.url)}</span>
          <IconButton icon={CopyIcon} label={copied ? 'Copied!' : 'Copy URL'} size="sm" variant="ghost" tooltip onClick={handleCopy} />
        </div>
        {w.description !== undefined && <span className={styles['desc']}>{w.description}</span>}
      </div>

      <span className={styles['events']}>{w.eventCount} events</span>

      <div className={styles['statusCell']}>
        <StatusDot status={w.active ? 'ok' : 'inactive'} size="sm" />
        {w.active ? 'Active' : 'Inactive'}
      </div>

      <div className={styles['deliveryCell']}>
        {w.lastDeliveryAt !== undefined ? (
          <>
            <StatusDot status={w.lastDeliveryStatus === 'success' ? 'ok' : w.lastDeliveryStatus === 'failed' ? 'error' : 'pending'} size="sm" />
            {formatRelative(w.lastDeliveryAt)}
          </>
        ) : 'Never'}
      </div>

      <span className={`${styles['failures']} ${w.failureCount24h > 0 ? styles['failuresDanger'] : styles['failuresZero']}`}>
        {w.failureCount24h}
      </span>

      <div className={styles['cell']} onClick={(e) => e.stopPropagation()}>
        {testState === 'idle' && <button type="button" className={styles['testBtn']} onClick={handleTest}>Send test {'\u2192'}</button>}
        {testState === 'sending' && <span className={styles['testBtn']}><span className={styles['spinner']}>{'\u21BB'}</span> Sending\u2026</span>}
        {testState === 'success' && <span className={`${styles['testBtn']} ${styles['testSuccess']}`}>{'\u2713'} {testCode}</span>}
        {testState === 'failure' && <span className={`${styles['testBtn']} ${styles['testFailure']}`}>{'\u2717'} {testCode || 'Err'}</span>}
      </div>

      <div className={styles['cell']} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={`${styles['toggle']} ${w.active ? styles['toggleOn'] : styles['toggleOff']}`} onClick={() => onToggle(w.id, !w.active)}>
          <span className={styles['toggleKnob']} />
        </button>
      </div>
    </div>
  )
}
