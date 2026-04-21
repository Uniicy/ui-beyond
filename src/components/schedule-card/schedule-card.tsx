import { type HTMLAttributes } from 'react'
import { IconButton } from '../icon-button'
import styles from './schedule-card.module.css'

type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly'
type Format = 'pdf' | 'csv' | 'both'

export interface Schedule {
  readonly id: string
  readonly reportName: string
  readonly frequency: Frequency
  readonly nextRunAt: string
  readonly format: Format
  readonly recipients: ReadonlyArray<string>
  readonly active: boolean
}

export interface ScheduleCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly schedule: Schedule
  readonly onToggleActive: (id: string, active: boolean) => void
  readonly onEdit: (id: string) => void
  readonly onDelete: (id: string) => void
}

const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly',
}

const FORMAT_LABEL: Record<Format, string> = {
  pdf: 'PDF', csv: 'CSV', both: 'PDF + CSV',
}

const EditIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5Z" />
  </svg>
)

const DeleteIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4" />
  </svg>
)

function formatNextRun(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatRecipients(recipients: ReadonlyArray<string>): string {
  if (recipients.length === 0) return 'No recipients'
  if (recipients.length === 1) return recipients[0]!
  return `${recipients[0]!} +${recipients.length - 1} more`
}

export function ScheduleCard({ schedule: s, onToggleActive, onEdit, onDelete, className, ...props }: ScheduleCardProps) {
  const cardCls = [styles['card'], !s.active && styles['paused'], className].filter(Boolean).join(' ')
  const pillCls = [styles['freqPill'], s.frequency === 'quarterly' ? styles['freqWarning'] : styles['freqInfo']].filter(Boolean).join(' ')

  return (
    <div className={cardCls} {...props}>
      {/* Left: frequency pill */}
      <span className={pillCls}>{FREQUENCY_LABEL[s.frequency]}</span>

      {/* Centre: info */}
      <div className={styles['info']}>
        <span className={styles['reportName']}>{s.reportName}</span>
        {s.active ? (
          <span className={styles['nextRun']}>Next: {formatNextRun(s.nextRunAt)}</span>
        ) : (
          <span className={styles['pausedLabel']}>Paused</span>
        )}
        <span className={styles['recipients']}>{formatRecipients(s.recipients)}</span>
      </div>

      {/* Right: format + controls */}
      <div className={styles['controls']}>
        <span className={styles['formatBadge']}>{FORMAT_LABEL[s.format]}</span>

        <label className={styles['toggle']}>
          <span className={styles['srOnly']}>
            {s.active ? 'Pause schedule' : 'Activate schedule'}
          </span>
          <input
            type="checkbox"
            checked={s.active}
            onChange={() => onToggleActive(s.id, !s.active)}
            className={styles['toggleInput']}
          />
          <span className={[styles['toggleTrack'], s.active && styles['toggleActive']].filter(Boolean).join(' ')}>
            <span className={styles['toggleThumb']} />
          </span>
        </label>

        <IconButton icon={EditIcon} label="Edit schedule" size="sm" variant="ghost" onClick={() => onEdit(s.id)} />
        <IconButton icon={DeleteIcon} label="Delete schedule" size="sm" variant="ghost" intent="danger" onClick={() => onDelete(s.id)} />
      </div>
    </div>
  )
}
