import type React from 'react'
import { type HTMLAttributes } from 'react'
import styles from './empty-state.module.css'

type EmptyStateVariant = 'no-results' | 'no-data' | 'error'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Drives the icon. `no-results` (after filter/search), `no-data` (first-run), `error` (failure). */
  readonly variant: EmptyStateVariant
  readonly title: string
  /** Optional guidance on how to resolve. */
  readonly description?: string
  /** Call-to-action button (e.g. "Clear filters", "Retry"). */
  readonly action?: { readonly label: string; readonly onClick: () => void }
}

/**
 * Placeholder for zero-state, filtered-to-empty, and error containers.
 * Always paired with a clear next step via `action`.
 */

function NoResultsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="2.5" />
      <line x1="32" y1="32" x2="42" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17" y1="17" x2="27" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="17" x2="17" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NoDataIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="8" y="12" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M8 20h32" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="26" x2="24" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 6L44 42H4L24 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="24" y1="20" x2="24" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="35" r="1.5" fill="currentColor" />
    </svg>
  )
}

const ICONS: Record<EmptyStateVariant, () => React.JSX.Element> = {
  'no-results': NoResultsIcon,
  'no-data': NoDataIcon,
  'error': ErrorIcon,
}

export function EmptyState({
  variant,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  const Icon = ICONS[variant]

  const classNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      <div className={styles['icon']}>
        <Icon />
      </div>
      <span className={styles['title']}>{title}</span>
      {description !== undefined && (
        <span className={styles['description']}>{description}</span>
      )}
      {action !== undefined && (
        <button type="button" className={styles['actionBtn']} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
