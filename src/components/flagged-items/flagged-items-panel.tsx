import { type HTMLAttributes } from 'react'
import { FlaggedItemCard, type FlaggedItemCardProps } from './flagged-item-card'
import styles from './flagged-items-panel.module.css'

export interface FlaggedItemsPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly items: ReadonlyArray<Omit<FlaggedItemCardProps, keyof HTMLAttributes<HTMLDivElement>>>
  readonly title?: string
}

export function FlaggedItemsPanel({
  items,
  title = 'Flagged items',
  className,
  ...props
}: FlaggedItemsPanelProps) {
  const classNames = [styles['panel'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      <div className={styles['header']}>{title}</div>
      {items.map((item) => (
        <FlaggedItemCard key={item.category} {...item} />
      ))}
    </div>
  )
}
