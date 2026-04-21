import { type HTMLAttributes } from 'react'
import styles from './provider-badge.module.css'

type Provider = 'onfido' | 'jumio' | 'manual' | 'trustly' | 'nuvei' | 'paysafe' | 'mcb_juice' | 'zimpler' | 'paypal'
type BadgeStyle = 'filled' | 'bordered' | 'outlined'

export interface ProviderBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly provider: Provider
  readonly badgeStyle?: BadgeStyle
}

const LABELS: Record<Provider, string> = {
  onfido: 'Onfido',
  jumio: 'Jumio',
  manual: 'Manual',
  trustly: 'Trustly',
  nuvei: 'Nuvei',
  paysafe: 'PaySafe',
  mcb_juice: 'MCB Juice',
  zimpler: 'Zimpler',
  paypal: 'PayPal',
}

export function ProviderBadge({
  provider,
  badgeStyle = 'filled',
  className,
  ...props
}: ProviderBadgeProps) {
  const classNames = [
    styles['badge'],
    styles[badgeStyle],
    styles[provider],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...props}>
      {LABELS[provider]}
    </span>
  )
}
