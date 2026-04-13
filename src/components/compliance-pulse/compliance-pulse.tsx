import { type HTMLAttributes } from 'react'
import styles from './compliance-pulse.module.css'

export interface CompliancePulseProps extends HTMLAttributes<HTMLSpanElement> {
  readonly label?: string
  readonly animate?: boolean
}

export function CompliancePulse({
  label = 'Identity Verified',
  animate = true,
  className,
  ...props
}: CompliancePulseProps) {
  const classNames = [
    styles['chip'],
    animate ? styles['pulse'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...props}>
      <span className={styles['dot']} aria-hidden="true" />
      {label}
    </span>
  )
}
