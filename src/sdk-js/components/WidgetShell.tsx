import { type ReactNode } from 'react'
import styles from './WidgetShell.module.css'

export type WidgetShellHeaderTint = 'success' | 'warning' | 'danger'

export interface WidgetShellProps {
  readonly title?: string
  readonly headerRight?: ReactNode
  readonly children: ReactNode
  readonly footer?: ReactNode
  readonly loading?: boolean
  readonly headerTint?: WidgetShellHeaderTint
}

const HEADER_TINT_CLASS: Record<WidgetShellHeaderTint, string | undefined> = {
  success: styles['headerTintSuccess'],
  warning: styles['headerTintWarning'],
  danger: styles['headerTintDanger'],
}

export function WidgetShell({
  title,
  headerRight,
  children,
  footer,
  loading = false,
  headerTint,
}: WidgetShellProps) {
  const headerClass = [
    styles['header'],
    headerTint !== undefined ? HEADER_TINT_CLASS[headerTint] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles['shell']}>
      {title !== undefined && (
        <div className={headerClass}>
          <span className={styles['title']}>{title}</span>
          {headerRight !== undefined && (
            <div className={styles['headerRight']}>{headerRight}</div>
          )}
        </div>
      )}
      <div className={styles['body']}>
        {loading ? (
          <div className={styles['shimmerWrap']}>
            <div className={`${styles['shimmerBar']} ${styles['bar60']}`} />
            <div className={`${styles['shimmerBar']} ${styles['bar85']}`} />
            <div className={`${styles['shimmerBar']} ${styles['bar45']}`} />
          </div>
        ) : (
          children
        )}
      </div>
      {footer !== undefined && (
        <div className={styles['footer']}>{footer}</div>
      )}
      <div
        className={styles['brand']}
        role="contentinfo"
        aria-label="Powered by Identity Beyond"
      >
        <span className={styles['brandDot']} aria-hidden="true" />
        <span className={styles['brandText']}>Powered by Identity Beyond</span>
      </div>
    </div>
  )
}
