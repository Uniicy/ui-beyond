import { useRef, useEffect, type HTMLAttributes } from 'react'
import styles from './checkbox.module.css'

type CheckboxSize = 'sm' | 'md'

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** Whether the box is checked. Controlled — pair with `onChange`. */
  readonly checked: boolean
  /** Fired with the new checked state. */
  readonly onChange: (checked: boolean) => void
  /** Render the mixed/partial state (used for "select all" rows). Overrides the visual check. */
  readonly indeterminate?: boolean
  readonly disabled?: boolean
  /** Inline text label. Clicking the label also toggles the box. */
  readonly label?: string
  /** `sm` for tables, `md` (default) elsewhere. */
  readonly size?: CheckboxSize
}

/**
 * Controlled checkbox with first-class indeterminate support. Use for row
 * selection in `DataTable`, settings, filter dropdowns.
 */

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  size = 'md',
  className,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const wrapperClassNames = [
    styles['wrapper'],
    styles[size],
    disabled ? styles['disabled'] : undefined,
    checked && !indeterminate ? styles['checked'] : undefined,
    indeterminate ? styles['indeterminate'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const iconSize = size === 'sm' ? 10 : 12

  return (
    <label className={wrapperClassNames} {...props}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles['input']}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles['box']}>
        <svg
          className={styles['checkIcon']}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="var(--ub-color-on-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className={styles['dashIcon']}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="5"
            width="8"
            height="2"
            rx="1"
            fill="var(--ub-color-on-primary)"
          />
        </svg>
      </span>
      {label !== undefined && <span className={styles['label']}>{label}</span>}
    </label>
  )
}
