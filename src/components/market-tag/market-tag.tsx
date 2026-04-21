import { type HTMLAttributes } from 'react'
import 'flag-icons/css/flag-icons.min.css'
import styles from './market-tag.module.css'

type Market = 'de' | 'mu' | 'nl' | 'gb'
type MarketTagSize = 'sm' | 'md'

interface MarketConfig {
  readonly code: string
  readonly license: string
  readonly label: string
}

const MARKETS: Record<Market, MarketConfig> = {
  de: { code: 'de', license: 'GGL', label: 'Germany' },
  mu: { code: 'mu', license: 'GRA', label: 'Mauritius' },
  nl: { code: 'nl', license: 'KSA', label: 'Netherlands' },
  gb: { code: 'gb', license: 'UKGC', label: 'United Kingdom' },
}

export interface MarketTagProps extends HTMLAttributes<HTMLSpanElement> {
  readonly market: Market
  readonly showFlag?: boolean
  readonly showLicense?: boolean
  readonly size?: MarketTagSize
}

export function MarketTag({
  market,
  showFlag = true,
  showLicense = true,
  size = 'md',
  className,
  ...props
}: MarketTagProps) {
  const config = MARKETS[market]

  const classNames = [
    styles['tag'],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...props}>
      {showFlag && <span className={`fi fi-${config.code} ${styles['flag']}`} aria-label={config.label} />}
      <span className={styles['label']}>{config.label}</span>
      {showLicense && <span className={styles['license']}>{config.license}</span>}
    </span>
  )
}
