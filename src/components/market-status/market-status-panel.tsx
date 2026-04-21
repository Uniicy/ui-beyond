import { type HTMLAttributes } from 'react'
import { MarketStatusRow, type MarketStatusRowProps } from './market-status-row'
import styles from './market-status-panel.module.css'

export interface MarketStatusPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly title?: string
  readonly rows: ReadonlyArray<Omit<MarketStatusRowProps, keyof HTMLAttributes<HTMLDivElement>>>
}

export function MarketStatusPanel({
  title = 'Market status',
  rows,
  className,
  ...props
}: MarketStatusPanelProps) {
  const classNames = [styles['panel'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      <div className={styles['header']}>{title}</div>
      {rows.map((row) => (
        <MarketStatusRow key={row.market} {...row} />
      ))}
    </div>
  )
}
