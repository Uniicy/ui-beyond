import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from '../icon-button'
import styles from './slide-in-panel.module.css'

export interface SlideInPanelProps {
  /** Controlled open state. */
  readonly open: boolean
  /** Fired on ESC, backdrop click, or close button. */
  readonly onClose: () => void
  readonly title: string
  readonly subtitle?: string
  /** Panel width in pixels. Defaults to `560`. */
  readonly width?: number
  readonly children: ReactNode
  /** Sticky footer (e.g. Save/Cancel buttons). */
  readonly footer?: ReactNode
}

/**
 * Right-side drawer rendered in a portal. Used for detail panels,
 * create/edit forms, and contextual workflows that shouldn't navigate
 * away. Closes on ESC or backdrop click.
 */

const CloseIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
)

export function SlideInPanel({
  open,
  onClose,
  title,
  subtitle,
  width = 560,
  children,
  footer,
}: SlideInPanelProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const content = (
    <>
      <div
        className={`${styles['backdrop']} ${open ? styles['backdropOpen'] : ''}`}
        onClick={onClose}
      />
      <div
        className={`${styles['panel']} ${open ? styles['panelOpen'] : ''}`}
        style={{ width }}
      >
        <div className={styles['header']}>
          <div className={styles['headerText']}>
            <span className={styles['title']}>{title}</span>
            {subtitle !== undefined && (
              <span className={styles['subtitle']}>{subtitle}</span>
            )}
          </div>
          <IconButton icon={CloseIcon} label="Close" size="sm" variant="ghost" onClick={onClose} />
        </div>

        <div className={styles['body']}>
          {children}
        </div>

        {footer !== undefined && (
          <div className={styles['footer']}>
            {footer}
          </div>
        )}
      </div>
    </>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
