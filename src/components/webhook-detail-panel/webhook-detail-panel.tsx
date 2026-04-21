import { useState, useEffect, useRef } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { ProgressBar } from '../progress-bar'
import { SlideInPanel } from '../slide-in-panel'
import { StatusDot } from '../status-dot'
import styles from './webhook-detail-panel.module.css'

interface DeliveryEntry { readonly occurredAt: string; readonly eventType: string; readonly statusCode: number; readonly durationMs: number }

export interface WebhookDetail {
  readonly id: string
  readonly url: string
  readonly description?: string
  readonly eventCount: number
  readonly active: boolean
  readonly lastDeliveryAt?: string
  readonly lastDeliveryStatus?: 'success' | 'failed' | 'pending'
  readonly failureCount24h: number
  readonly secret: string
  readonly subscribedEvents: ReadonlyArray<string>
  readonly deliveryHistory: ReadonlyArray<DeliveryEntry>
}

export interface WebhookDetailPanelProps {
  readonly webhook: WebhookDetail
  readonly allEventTypes: ReadonlyArray<string>
  readonly onSave: (updates: Partial<WebhookDetail>) => Promise<void>
  readonly onDelete: (id: string) => void
  readonly onRotateSecret: (id: string) => Promise<string>
  readonly open: boolean
  readonly onClose: () => void
}

const EyeIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="3" /><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" /></svg>)

function groupEvents(events: ReadonlyArray<string>): Record<string, string[]> {
  const groups: Record<string, string[]> = {}
  for (const e of events) {
    const domain = e.split('.')[0] ?? 'other'
    const group = groups[domain] ?? []
    group.push(e)
    groups[domain] = group
  }
  return groups
}

function formatRelative(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function codeClass(code: number): string {
  if (code < 300) return styles['code2xx'] ?? ''
  if (code < 500) return styles['code4xx'] ?? ''
  return styles['code5xx'] ?? ''
}

export function WebhookDetailPanel({ webhook: w, allEventTypes, onSave, onDelete, onRotateSecret, open, onClose }: WebhookDetailPanelProps) {
  const [url, setUrl] = useState(w.url)
  const [desc, setDesc] = useState(w.description ?? '')
  const [subscribed, setSubscribed] = useState<string[]>([...w.subscribedEvents])
  const [secretRevealed, setSecretRevealed] = useState(false)
  const [currentSecret, setCurrentSecret] = useState(w.secret)
  const [revealCountdown, setRevealCountdown] = useState(0)
  const [rotateWarning, setRotateWarning] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setUrl(w.url); setDesc(w.description ?? ''); setSubscribed([...w.subscribedEvents]); setCurrentSecret(w.secret); setSecretRevealed(false); setDeleteConfirm(false) }, [w])

  const startReveal = () => {
    setSecretRevealed(true)
    setRevealCountdown(100)
    if (revealTimer.current) clearInterval(revealTimer.current)
    const start = Date.now()
    revealTimer.current = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / 5000) * 100)
      setRevealCountdown(pct)
      if (pct <= 0) { setSecretRevealed(false); if (revealTimer.current) clearInterval(revealTimer.current) }
    }, 50)
  }

  const handleRotate = async () => {
    const newSecret = await onRotateSecret(w.id)
    setCurrentSecret(newSecret)
    setRotateWarning(true)
    startReveal()
  }

  const toggleEvent = (e: string) => setSubscribed((p) => p.includes(e) ? p.filter((x) => x !== e) : [...p, e])
  const allSelected = allEventTypes.length === subscribed.length
  const toggleAll = () => setSubscribed(allSelected ? [] : [...allEventTypes])

  const isDirty = url !== w.url || desc !== (w.description ?? '') || JSON.stringify(subscribed.sort()) !== JSON.stringify([...w.subscribedEvents].sort())

  const handleSave = async () => { setSaving(true); await onSave({ url, description: desc || undefined, subscribedEvents: subscribed }); setSaving(false) }

  const grouped = groupEvents(allEventTypes)

  const footer = (
    <div className={styles['footer']}>
      {!deleteConfirm ? (
        <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}>Delete endpoint</Button>
      ) : (
        <div className={styles['deleteConfirm']}>
          Delete this webhook?
          <Button variant="danger" size="sm" onClick={() => onDelete(w.id)}>Confirm</Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
        </div>
      )}
      <Button variant="primary" size="sm" disabled={!isDirty || saving} onClick={handleSave}>{saving ? 'Saving\u2026' : 'Save changes'}</Button>
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={onClose} title="Webhook endpoint" subtitle={w.url.length > 50 ? `${w.url.slice(0, 50)}\u2026` : w.url} footer={footer}>
      {/* Configuration */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Configuration</div>
        <div className={styles['field']}>
          <span className={styles['fieldLabel']}>URL</span>
          <input className={styles['fieldInput']} value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className={styles['field']}>
          <span className={styles['fieldLabel']}>Description</span>
          <input className={styles['fieldInput']} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
        </div>
        <div className={styles['field']}>
          <span className={styles['fieldLabel']}>Signing secret</span>
          <div className={styles['secretRow']}>
            {secretRevealed ? (
              <span className={styles['secretRevealed']}>{currentSecret}</span>
            ) : (
              <span className={styles['secretMasked']}>{'\u2022'.repeat(24)}</span>
            )}
            <IconButton icon={EyeIcon} label="Reveal" size="sm" variant="ghost" onClick={startReveal} />
          </div>
          {secretRevealed && <div className={styles['countdownBar']}><ProgressBar value={revealCountdown} height="xs" intent="primary" rounded /></div>}
          <Button variant="ghost" size="sm" onClick={handleRotate}>Rotate secret</Button>
          {rotateWarning && <div className={styles['rotateWarning']}>{'\u26A0\uFE0F'} Update your server to use the new secret before the old one expires in 24h.</div>}
        </div>
      </div>

      {/* Subscribed events */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Subscribed events</div>
        <div className={styles['masterCheck']}>
          <Checkbox checked={allSelected} indeterminate={subscribed.length > 0 && !allSelected} onChange={toggleAll} size="sm" />
          <span className={styles['masterLabel']}>Subscribe to all ({allEventTypes.length})</span>
        </div>
        <div className={styles['eventsScroll']}>
          {Object.entries(grouped).map(([domain, events]) => (
            <div key={domain} className={styles['eventGroup']}>
              <div className={styles['groupHeader']}>{domain.toUpperCase()} events</div>
              {events.map((e) => (
                <div key={e} className={styles['eventItem']}>
                  <Checkbox checked={subscribed.includes(e)} onChange={() => toggleEvent(e)} size="sm" />
                  <span className={styles['eventName']}>{e}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Recent deliveries */}
      <div className={styles['section']}>
        <div className={styles['sectionTitle']}>Recent deliveries</div>
        {w.deliveryHistory.slice(0, 10).map((d, i) => (
          <div key={i} className={styles['deliveryRow']}>
            <StatusDot status={d.statusCode < 400 ? 'ok' : 'error'} size="sm" />
            <span className={styles['deliveryEvent']}>{d.eventType}</span>
            <span className={styles['deliveryTime']}>{formatRelative(d.occurredAt)}</span>
            <span className={`${styles['deliveryCode']} ${codeClass(d.statusCode)}`}>{d.statusCode}</span>
          </div>
        ))}
        <button type="button" className={styles['viewAllLink']}>View all in Delivery Log {'\u2192'}</button>
      </div>
    </SlideInPanel>
  )
}
