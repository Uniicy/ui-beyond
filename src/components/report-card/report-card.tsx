import { type HTMLAttributes } from 'react'
import { Button } from '../button'
import { MarketTag } from '../market-tag'
import { StatusDot } from '../status-dot'
import styles from './report-card.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type Format = 'pdf' | 'csv'
type GenerationStatus = 'idle' | 'generating' | 'ready' | 'failed'

export interface Report {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly markets: ReadonlyArray<Market>
  readonly formats: ReadonlyArray<Format>
  readonly lastGeneratedAt?: string
  readonly generationStatus: GenerationStatus
  readonly downloadUrls?: { readonly pdf?: string; readonly csv?: string }
  readonly expiresAt?: string
}

export interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly report: Report
  readonly onGenerate: (reportId: string) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'Unknown date'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url, 'https://placeholder')
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

function formatExpiry(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'Expiry unknown'
  const ms = d.getTime() - Date.now()
  if (ms <= 0) return 'Expired'
  const hours = Math.floor(ms / 3_600_000)
  if (hours < 1) return `Links expire in ${Math.max(1, Math.floor(ms / 60_000))}m`
  return `Links expire in ${hours}h`
}

const DownloadIcon = '\u2193'

export function ReportCard({ report: r, onGenerate, className, ...props }: ReportCardProps) {
  const wrapperCls = [styles['card'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperCls} {...props}>
      {/* Header */}
      <div className={styles['header']}>
        <span className={styles['name']}>{r.name}</span>
        <div className={styles['markets']}>
          {r.markets.map((m) => (
            <MarketTag key={m} market={m} size="sm" showLicense={false} />
          ))}
        </div>
      </div>

      {/* Description */}
      <p className={styles['description']}>{r.description}</p>

      {/* Last generated */}
      <span className={r.lastGeneratedAt !== undefined ? styles['lastRun'] : styles['lastRunNever']}>
        {r.lastGeneratedAt !== undefined ? `Last run: ${formatDate(r.lastGeneratedAt)}` : 'Never generated'}
      </span>

      {/* Format badges */}
      <div className={styles['formats']}>
        {r.formats.map((f) => (
          <span key={f} className={styles['formatBadge']}>{f.toUpperCase()}</span>
        ))}
      </div>

      {/* Action area */}
      <div className={styles['actions']}>
        {r.generationStatus === 'idle' && (
          <Button variant="primary" size="sm" onClick={() => onGenerate(r.id)}>
            Generate now
          </Button>
        )}

        {r.generationStatus === 'generating' && (
          <div className={styles['generatingRow']}>
            <StatusDot status="pending" size="sm" pulse />
            <span className={styles['generatingText']}>Generating\u2026</span>
            <Button variant="primary" size="sm" disabled>Generate now</Button>
          </div>
        )}

        {r.generationStatus === 'ready' && (
          <div className={styles['readyArea']}>
            <span className={styles['readyText']}>Ready to download</span>
            <div className={styles['downloadLinks']}>
              {r.downloadUrls?.pdf !== undefined && isSafeUrl(r.downloadUrls.pdf) && (
                <a href={r.downloadUrls.pdf} className={styles['downloadLink']} download>
                  {DownloadIcon} PDF
                </a>
              )}
              {r.downloadUrls?.csv !== undefined && isSafeUrl(r.downloadUrls.csv) && (
                <a href={r.downloadUrls.csv} className={styles['downloadLink']} download>
                  {DownloadIcon} CSV
                </a>
              )}
            </div>
            {r.expiresAt !== undefined && (
              <span className={styles['expiresText']}>{formatExpiry(r.expiresAt)}</span>
            )}
          </div>
        )}

        {r.generationStatus === 'failed' && (
          <div className={styles['failedRow']}>
            <span className={styles['failedText']}>Generation failed</span>
            <button type="button" className={styles['retryLink']} onClick={() => onGenerate(r.id)}>
              Retry {'\u2192'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
