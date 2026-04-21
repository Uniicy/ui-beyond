import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import styles from './icon-button.module.css'

type IconButtonSize = 'sm' | 'md' | 'lg'
type IconButtonVariant = 'ghost' | 'outline' | 'filled'
type IconButtonIntent = 'neutral' | 'primary' | 'danger'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element (e.g. from `lucide-react`). Sized automatically via container. */
  readonly icon: ReactNode
  /** Accessible name — used as `aria-label` and (when `tooltip`) hover text. Required for a11y. */
  readonly label: string
  readonly size?: IconButtonSize
  /** `ghost` (default) for toolbars, `outline` for standalone actions, `filled` for emphasis. */
  readonly variant?: IconButtonVariant
  /** Color role. `danger` for destructive (delete, reject), `primary` for primary action. */
  readonly intent?: IconButtonIntent
  /** Show `label` as a hover tooltip. Suppressed while `loading`. */
  readonly tooltip?: boolean
  /** Replace icon with a spinner and disable the button. */
  readonly loading?: boolean
}

/**
 * Compact icon-only action button. Always requires a `label` for screen
 * readers. Prefer this over `Button` when space is tight (table rows,
 * toolbars) or when the icon alone is unambiguous.
 */

function Spinner({ size }: { readonly size: IconButtonSize }) {
  const px = size === 'sm' ? 14 : size === 'md' ? 16 : 18
  return (
    <svg
      className={styles['spinner']}
      width={px}
      height={px}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  intent = 'neutral',
  tooltip = true,
  loading = false,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const classNames = [
    styles['iconButton'],
    styles[size],
    styles[variant],
    styles[intent],
    tooltip && !loading ? styles['tooltip'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classNames}
      aria-label={label}
      disabled={disabled ?? loading}
      data-tooltip={tooltip ? label : undefined}
      {...props}
    >
      <span className={styles['iconInner']}>
        {loading ? <Spinner size={size} /> : icon}
      </span>
    </button>
  )
}
