import { type HTMLAttributes } from 'react'
import { AlertFeedItem, type AlertFeedItemProps } from './alert-feed-item'
import styles from './alert-feed.module.css'

type ItemData = Omit<AlertFeedItemProps, keyof HTMLAttributes<HTMLDivElement>>

export interface AlertFeedProps extends HTMLAttributes<HTMLDivElement> {
  readonly items: ReadonlyArray<ItemData>
  readonly title?: string
  readonly maxItems?: number
  readonly onViewAll?: () => void
}

export function AlertFeed({
  items,
  title = 'Recent activity',
  maxItems = 5,
  onViewAll,
  className,
  ...props
}: AlertFeedProps) {
  const visibleItems = items.slice(0, maxItems)
  const hasOverflow = items.length > maxItems

  const classNames = [styles['panel'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      <div className={styles['header']}>{title}</div>

      {items.length === 0 ? (
        <div className={styles['empty']}>No recent activity</div>
      ) : (
        <div className={styles['list']}>
          {visibleItems.map((item, i) => (
            <AlertFeedItem key={`${item.type}-${item.timestamp}-${i}`} {...item} />
          ))}
        </div>
      )}

      {hasOverflow && (
        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['viewAll']}
            onClick={onViewAll}
          >
            View all {items.length} events &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
