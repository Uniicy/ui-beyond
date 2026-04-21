import { useState, useCallback, useEffect } from 'react'
import { type AuditEvent, SOURCE_BADGE_VARIANT, SOURCE_LABEL, CopyIcon } from '../audit-log-row'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import { JsonViewer } from '../json-viewer'
import { SlideInPanel } from '../slide-in-panel'
import styles from './audit-detail-panel.module.css'

export interface AuditDetailPanelProps {
  readonly event: AuditEvent & { readonly payload: unknown }
  readonly open: boolean
  readonly onClose: () => void
}

type VerifyState = 'idle' | 'verified' | 'mismatch'

const LinkIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1" />
    <path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1" />
  </svg>
)

const DownloadIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M8 2v9M4.5 7.5 8 11l3.5-3.5M3 14h10" />
  </svg>
)

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

async function computeSha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function downloadJson(payload: unknown, filename: string) {
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AuditDetailPanel({
  event: e,
  open,
  onClose,
}: AuditDetailPanelProps) {
  const [verifyState, setVerifyState] = useState<VerifyState>('idle')

  useEffect(() => {
    setVerifyState('idle')
  }, [e.id])

  const handleCopyPermalink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?event=${e.id}`
    copyToClipboard(url)
  }, [e.id])

  const handleCopyPayload = useCallback(() => {
    copyToClipboard(JSON.stringify(e.payload, null, 2))
  }, [e.payload])

  const handleCopyHash = useCallback(() => {
    copyToClipboard(e.sha256)
  }, [e.sha256])

  const handleVerify = useCallback(async () => {
    try {
      const canonical = JSON.stringify(e.payload)
      const computed = await computeSha256(canonical)
      setVerifyState(computed === e.sha256 ? 'verified' : 'mismatch')
    } catch {
      setVerifyState('mismatch')
    }
  }, [e.payload, e.sha256])

  const handleExport = useCallback(() => {
    downloadJson(e.payload, `${e.id}.json`)
  }, [e.payload, e.id])

  const footer = (
    <Button variant="secondary" onClick={handleExport}>
      <span className={styles['footerBtnContent']}>
        {DownloadIcon}
        Export event JSON
      </span>
    </Button>
  )

  return (
    <SlideInPanel
      open={open}
      onClose={onClose}
      title={e.eventType}
      subtitle={e.id}
      width={620}
      footer={footer}
    >
      {/* Header actions (permalink) */}
      <div className={styles['headerActions']}>
        <IconButton
          icon={LinkIcon}
          label="Copy permalink"
          size="sm"
          variant="ghost"
          onClick={handleCopyPermalink}
        />
      </div>

      {/* Section 1: Event summary */}
      <section className={styles['section']}>
        <h3 className={styles['sectionTitle']}>Event summary</h3>
        <div className={styles['grid']}>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Event ID</span>
            <span className={styles['gridValueMono']}>{e.id}</span>
          </div>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Source service</span>
            <Badge
              variant={SOURCE_BADGE_VARIANT[e.source]}
              size="sm"
              label={SOURCE_LABEL[e.source]}
            />
          </div>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Occurred at</span>
            <span className={styles['gridValueMono']}>{e.occurredAt}</span>
          </div>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Brand</span>
            <span className={styles['gridValue']}>{e.brandId}</span>
          </div>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Player</span>
            {e.playerId !== undefined && e.playerName !== undefined ? (
              <span className={styles['gridEntityRow']}>
                <Avatar name={e.playerName} size="sm" />
                <span className={styles['gridValue']}>{e.playerName}</span>
              </span>
            ) : (
              <span className={styles['gridValueDash']}>&mdash;</span>
            )}
          </div>
          <div className={styles['gridItem']}>
            <span className={styles['gridLabel']}>Agent</span>
            {e.agentId !== undefined && e.agentName !== undefined ? (
              <span className={styles['gridEntityRow']}>
                <Avatar name={e.agentName} size="sm" />
                <span className={styles['gridValue']}>{e.agentName}</span>
              </span>
            ) : (
              <span className={styles['gridValueMuted']}>system</span>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Payload */}
      <section className={styles['section']}>
        <div className={styles['sectionHeader']}>
          <h3 className={styles['sectionTitle']}>Payload</h3>
          <IconButton
            icon={CopyIcon}
            label="Copy payload"
            size="sm"
            variant="ghost"
            onClick={handleCopyPayload}
          />
        </div>
        <div className={styles['payloadContainer']}>
          <JsonViewer
            data={e.payload}
            initialDepth={2}
            searchable
            maxHeight="320px"
            theme="dark"
          />
        </div>
      </section>

      {/* Section 3: Integrity */}
      <section className={styles['section']}>
        <h3 className={styles['sectionTitle']}>Integrity</h3>

        <div className={styles['hashRow']}>
          <span className={styles['hashLabel']}>SHA-256</span>
          <div className={styles['hashValueRow']}>
            <span className={styles['hashValue']}>{e.sha256}</span>
            <IconButton
              icon={CopyIcon}
              label="Copy hash"
              size="sm"
              variant="ghost"
              onClick={handleCopyHash}
            />
          </div>
        </div>

        <div className={styles['verifyRow']}>
          {verifyState === 'idle' && (
            <button
              type="button"
              className={styles['verifyBtn']}
              onClick={handleVerify}
            >
              Verify integrity &rarr;
            </button>
          )}

          {verifyState === 'verified' && (
            <span className={styles['verifySuccess']}>
              &#10003; Hash verified &mdash; payload has not been modified
            </span>
          )}

          {verifyState === 'mismatch' && (
            <span className={styles['verifyDanger']}>
              &#10007; Hash mismatch &mdash; payload may have been altered
            </span>
          )}
        </div>

        <p className={styles['regulatoryNote']}>
          This event is stored immutably. SHA-256 hash is computed on the canonical JSON payload at the time of recording.
        </p>
      </section>
    </SlideInPanel>
  )
}
