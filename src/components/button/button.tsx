import { type ButtonHTMLAttributes } from 'react'
import styles from './button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` for main actions, `secondary` for complementary ones, `ghost` for low-emphasis, `danger` for destructive. */
  readonly variant?: ButtonVariant
  /** Control height and padding. Use `sm` for dense tables, `lg` for marketing/CTAs. */
  readonly size?: ButtonSize
}

/**
 * Primary interactive control for triggering actions.
 *
 * Accepts all native `<button>` props. Combine with icons inside `children`
 * for affordance, or use `IconButton` for icon-only actions.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const classNames = [
    styles['button'],
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button className={classNames} {...props} />
}
