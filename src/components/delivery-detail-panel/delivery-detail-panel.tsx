import { useState, useCallback, useEffect, useRef } from 'react'
import type { Delivery } from '../delivery-log-row'
import { Badge } from '../badge'
import { Button } from '../button'
import { JsonViewer } from '../json-viewer'
import { SlideInPanel } from '../slide-in-panel'
import {
  type ReplayState,
  REPLAY_RESULT_DISPLAY_MS,
  getHttpStatusBadge,
  formatOrdinal,
  formatTimestamp,
  formatResponseTime,
} from '../delivery-log-row/delivery-utils'
import styles from './delivery-detail-panel.module.css'

export interface DeliveryDetailPanelProps {
  readonly delivery: Delivery & {
    readonly requestHeaders: Record<string, string>
    readonly responseHeaders: Record<string, string>
  }
  readonly onReplay: (id: string) => Promise<{ readonly status: number; readonly durationMs: number }>
  readonly onViewAuditLog?: () => void
  readonly open: boolean
  readonly onClose: () => void
}

export function DeliveryDetailPanel({
  delivery: d,
  onReplay,
  onViewAuditLog,
  open,
  onClose,
}: DeliveryDetailPanelProps) {
  const [replay, setReplay] = useState<ReplayState>({ phase: 'idle' })
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    setReplay({ phase: 'idle' })
  }, [d.id])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current)
    }
  }, [])

  const httpBadge = getHttpStatusBadge(d.httpStatus)
  const ts = formatTimestamp(d.occurredAt)

  const handleReplay = useCallback(async () => {
    if (replay.phase === 'loading') return

    setReplay({ phase: 'loading' })

    try {
      const result = await onReplay(d.id)
      if (!mountedRef.current) return
      const success = result.status >= 200 && result.status < 300
      setReplay({ phase: 'result', status: result.status, success })
    } catch {
      if (!mountedRef.current) return
      setReplay({ phase: 'result', status: 0, success: false })
    }

    if (!mountedRef.current) return
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current)
    resultTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setReplay({ phase: 'idle' })
    }, REPLAY_RESULT_DISPLAY_MS)
  }, [d.id, onReplay, replay.phase])

  const replayButtonLabel = (() => {
    if (replay.phase === 'loading') return 'Replaying…'
    if (replay.phase === 'result' && replay.success) return `✓ ${replay.status}`
    if (replay.phase === 'result' && !replay.success) return `✗ ${replay.status || 'Error'}`
    return 'Replay delivery →'
  })()

  const footer = (
    <div className={styles['footer']}>
      <button
        type="button"
        className={styles['auditLink']}
        onClick={onViewAuditLog}
        disabled={onViewAuditLog === undefined}
      >
        View event in audit log →
      </button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleReplay}
        disabled={replay.phase === 'loading'}
      >
        <span aria-live="polite">{replayButtonLabel}</span>
      </Button>
    </div>
  )

  return (
    <SlideInPanel
      open={open}
      onClose={onClose}
      title={d.eventType}
      subtitle={d.endpointUrl}
      width={620}
      footer={footer}
    >
      {/* Status row */}
      <div className={styles['statusRow']}>
        <Badge variant={httpBadge.variant} size="md" label={httpBadge.label} />
        <span className={styles['statusMeta']}>
          {formatResponseTime(d.responseTimeMs)}
        </span>
        <span className={styles['statusMeta']}>
          Attempt {formatOrdinal(d.attemptNumber)}
        </span>
        <span className={styles['statusMeta']}>
          {ts.date} · {ts.time}
        </span>
      </div>

      {/* REQUEST section */}
      <section className={styles['section']}>
        <h3 className={styles['sectionTitle']}>Request</h3>

        <div className={styles['subSection']}>
          <span className={styles['subLabel']}>Headers</span>
          <div className={styles['viewerContainer']}>
            <JsonViewer
              data={d.requestHeaders}
              initialDepth={0}
              searchable={false}
              maxHeight="100px"
              theme="dark"
            />
          </div>
        </div>

        <div className={styles['subSection']}>
          <span className={styles['subLabel']}>Body</span>
          <div className={styles['viewerContainer']}>
            <JsonViewer
              data={d.requestBody}
              initialDepth={2}
              searchable
              maxHeight="220px"
              theme="dark"
            />
          </div>
        </div>
      </section>

      {/* RESPONSE section */}
      <section className={styles['section']}>
        <h3 className={styles['sectionTitle']}>Response</h3>

        <div className={styles['subSection']}>
          <span className={styles['subLabel']}>Headers</span>
          <div className={styles['viewerContainer']}>
            <JsonViewer
              data={d.responseHeaders}
              initialDepth={0}
              searchable={false}
              maxHeight="100px"
              theme="dark"
            />
          </div>
        </div>

        <div className={styles['subSection']}>
          <span className={styles['subLabel']}>Body</span>
          <div className={styles['viewerContainer']}>
            <JsonViewer
              data={d.responseBody}
              initialDepth={2}
              searchable
              maxHeight="200px"
              theme="dark"
            />
          </div>
        </div>
      </section>

      {/* Failed callout */}
      {d.status === 'failed' && (
        <div className={styles['failedCallout']}>
          This delivery failed. Replay sends the identical payload to the endpoint again.
        </div>
      )}
    </SlideInPanel>
  )
}
