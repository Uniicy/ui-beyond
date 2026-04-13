import { type ButtonHTMLAttributes } from 'react'
import styles from './button.module.css'

type ButtonVariant = 'solid' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
}

export function Button({
  variant = 'solid',
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
