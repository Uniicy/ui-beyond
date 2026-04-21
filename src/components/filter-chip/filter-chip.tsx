import { type HTMLAttributes } from 'react'
import styles from './filter-chip.module.css'

type FilterChipVariant = 'default' | 'primary'

export interface FilterChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Display text (e.g. `"Status: Approved"`). */
  readonly label: string
  /** Fired when the user clicks the × button. */
  readonly onRemove: () => void
  /** `primary` highlights an active filter; `default` for inactive chips. */
  readonly variant?: FilterChipVariant
}

/**
 * Removable token representing an applied filter. Rendered as a row inside
 * `FilterBar`, or stacked in `<Stack direction="row" gap="sm">` above a table.
 */

export function FilterChip({
  label,
  onRemove,
  variant = 'default',
  className,
  ...props
}: FilterChipProps) {
  const classNames = [
    styles['chip'],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...props}>
      {label}
      <button
        type="button"
        className={styles['removeBtn']}
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        {'\u00D7'}
      </button>
    </span>
  )
}
