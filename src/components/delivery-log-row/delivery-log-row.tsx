import { useState, useCallback, useRef, useEffect } from 'react'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { JsonViewer } from '../json-viewer'
import {
  type ReplayState,
  REPLAY_RESULT_DISPLAY_MS,
  getHttpStatusBadge,
  formatOrdinal,
  formatTimestamp,
} from './delivery-utils'
import styles from './delivery-log-row.module.css'

type DeliveryStatus = 'success' | 'failed' | 'retrying'

export interface Delivery {
  readonly id: string
  readonly occurredAt: string
  readonly eventType: string
  readonly endpointUrl: string
  readonly httpStatus: number
  readonly responseTimeMs: number
  readonly attemptNumber: number
  readonly requestBody: unknown
  readonly responseBody: unknown
  readonly status: DeliveryStatus
}

export interface DeliveryLogRowProps {
  readonly delivery: Delivery
  readonly onReplay: (deliveryId: string) => Promise<{ readonly status: number; readonly durationMs: number }>
  readonly onClick: (deliveryId: string) => void
  readonly className?: string
}

const ChevronIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 4l4 4-4 4" />
  </svg>
)

function truncateUrl(url: string, maxLen: number): string {
  return url.length > maxLen ? `${url.slice(0, maxLen)}…` : url
}

function getResponseTimeClass(ms: number): string {
  if (ms < 500) return 'rtSuccess'
  if (ms <= 2000) return 'rtWarning'
  return 'rtDanger'
}

export function DeliveryLogRow({
  delivery: d,
  onReplay,
  onClick,
  className,
}: DeliveryLogRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [replay, setReplay] = useState<ReplayState>({ phase: 'idle' })
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current)
    }
  }, [])

  const ts = formatTimestamp(d.occurredAt)
  const httpBadge = getHttpStatusBadge(d.httpStatus)
  const rtClass = getResponseTimeClass(d.responseTimeMs)

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  const handleReplay = useCallback(async (ev: React.MouseEvent) => {
    ev.stopPropagation()
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

  const handleViewDetail = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation()
    onClick(d.id)
  }, [d.id, onClick])

  const rowClassNames = [
    styles['row'],
    d.status === 'failed' ? styles['borderDanger'] : undefined,
    d.status === 'retrying' ? styles['borderWarning'] : undefined,
    expanded ? styles['expanded'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const chevronClassNames = [
    styles['chevron'],
    expanded ? styles['chevronOpen'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rowClassNames}>
      <div
        className={styles['cells']}
        onClick={handleToggle}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault()
            handleToggle()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Timestamp */}
        <div className={styles['tsCell']}>
          <span className={styles['tsDate']}>{ts.date}</span>
          <span className={styles['tsTime']}>{ts.time}</span>
        </div>

        {/* Event type */}
        <div className={styles['eventCell']}>
          <span className={styles['eventType']}>{d.eventType}</span>
        </div>

        {/* Endpoint */}
        <div className={styles['endpointCell']}>
          <span className={styles['endpointUrl']}>{truncateUrl(d.endpointUrl, 30)}</span>
        </div>

        {/* Status */}
        <div className={styles['cell']}>
          {d.status === 'retrying' ? (
            <span className={styles['retryingBadge']}>Retrying</span>
          ) : (
            <Badge variant={httpBadge.variant} size="sm" label={httpBadge.label} />
          )}
        </div>

        {/* Response time */}
        <div className={styles['cell']}>
          <span className={`${styles['responseTime']} ${styles[rtClass] ?? ''}`}>
            {d.responseTimeMs}ms
          </span>
        </div>

        {/* Attempt */}
        <div className={styles['attemptCell']}>
          {d.attemptNumber > 1 ? (
            <span className={styles['retryAttempt']}>Retry {formatOrdinal(d.attemptNumber)}</span>
          ) : (
            <span className={styles['attemptText']}>{formatOrdinal(d.attemptNumber)}</span>
          )}
        </div>

        {/* Actions */}
        <div className={styles['actionsCell']} onClick={(ev) => ev.stopPropagation()}>
          <button
            type="button"
            className={styles['replayBtn']}
            onClick={handleReplay}
            disabled={replay.phase === 'loading'}
          >
            <span aria-live="polite">
              {replay.phase === 'idle' && 'Replay →'}
              {replay.phase === 'loading' && (
                <span className={styles['replayLoading']}>
                  <span className={styles['spinner']} />
                  Replaying…
                </span>
              )}
              {replay.phase === 'result' && replay.success && (
                <span className={styles['replaySuccess']}>✓ {replay.status}</span>
              )}
              {replay.phase === 'result' && !replay.success && (
                <span className={styles['replayFail']}>✗ {replay.status || 'Err'}</span>
              )}
            </span>
          </button>
          <IconButton
            icon={<span className={chevronClassNames}>{ChevronIcon}</span>}
            label={expanded ? 'Collapse' : 'Expand'}
            size="sm"
            variant="ghost"
            tooltip={false}
            onClick={handleToggle}
          />
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className={styles['expandedBody']}>
          <div className={styles['bodyColumns']}>
            <div className={styles['bodyColumn']}>
              <span className={styles['bodyLabel']}>Request body</span>
              <div className={styles['bodyViewer']}>
                <JsonViewer data={d.requestBody} initialDepth={1} maxHeight="120px" theme="dark" />
              </div>
            </div>
            <div className={styles['bodyColumn']}>
              <span className={styles['bodyLabel']}>Response body</span>
              <div className={styles['bodyViewer']}>
                <JsonViewer data={d.responseBody} initialDepth={1} maxHeight="120px" theme="dark" />
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles['detailLink']}
            onClick={handleViewDetail}
          >
            View full detail →
          </button>
        </div>
      )}
    </div>
  )
}
