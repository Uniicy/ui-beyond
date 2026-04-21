import { useState, useEffect, useRef, useCallback, type HTMLAttributes } from 'react'
import { Menu } from 'lucide-react'
import { Badge } from '../badge'
import { Button } from '../button'
import { SIDEBAR_DRAWER_ID } from '../page-shell/constants'
import styles from './admin-top-nav.module.css'

export interface Breadcrumb {
  readonly label: string
  readonly path?: string
}

export interface Action {
  readonly label: string
  readonly onClick: () => void
}

export interface AdminTopNavProps extends HTMLAttributes<HTMLElement> {
  readonly pageTitle: string
  readonly breadcrumbs?: ReadonlyArray<Breadcrumb>
  readonly primaryAction?: Action
  readonly secondaryAction?: Action
  readonly onSearch?: (query: string) => void
  readonly notificationCount?: number
  readonly drawerToggleId?: string
  readonly showMobileMenu?: boolean
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

export function AdminTopNav({
  pageTitle,
  breadcrumbs,
  primaryAction,
  secondaryAction,
  onSearch,
  notificationCount,
  drawerToggleId = SIDEBAR_DRAWER_ID,
  showMobileMenu = true,
  className,
  ...props
}: AdminTopNavProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLInputElement>(null)
  const prevQueryRef = useRef(debouncedQuery)

  useEffect(() => {
    if (onSearch !== undefined && debouncedQuery !== prevQueryRef.current) {
      prevQueryRef.current = debouncedQuery
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      searchRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (onSearch === undefined) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSearch, handleKeyDown])

  const navClassNames = [styles['topNav'], className]
    .filter(Boolean)
    .join(' ')

  const hasBreadcrumbs = breadcrumbs !== undefined && breadcrumbs.length > 0

  return (
    <header className={navClassNames} {...props}>
      {showMobileMenu && (
        <label htmlFor={drawerToggleId} className={styles['hamburger']} aria-label="Open navigation menu">
          <Menu size={18} />
        </label>
      )}

      {/* Left */}
      <div className={styles['left']}>
        {hasBreadcrumbs && (
          <div className={styles['breadcrumbs']}>
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <span key={crumb.label} style={{ display: 'contents' }}>
                  {i > 0 && <span className={styles['separator']}>/</span>}
                  {isLast || crumb.path === undefined ? (
                    <span className={isLast ? styles['breadcrumbCurrent'] : undefined}>
                      {crumb.label}
                    </span>
                  ) : (
                    <button type="button" className={styles['breadcrumbLink']}>
                      {crumb.label}
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        )}
        <span className={`${styles['pageTitle']} ${hasBreadcrumbs ? styles['pageTitleSmall'] : ''}`}>
          {pageTitle}
        </span>
      </div>

      {/* Centre */}
      {onSearch !== undefined ? (
        <div className={styles['centre']}>
          <div className={styles['searchWrapper']}>
            <span className={styles['searchIcon']} aria-hidden="true">{'\u2315'}</span>
            <input
              ref={searchRef}
              type="text"
              className={styles['searchInput']}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className={styles['searchHint']}>{'\u2318'}K</span>
          </div>
        </div>
      ) : (
        <div className={styles['spacer']} />
      )}

      {/* Right */}
      <div className={styles['right']}>
        <button type="button" className={styles['notificationBtn']} aria-label="Notifications">
          {'\u266A'}
          {notificationCount !== undefined && notificationCount > 0 && (
            <span className={styles['notificationBadge']}>
              <Badge variant="critical" size="sm" label={String(notificationCount)} />
            </span>
          )}
        </button>

        {secondaryAction !== undefined && (
          <Button variant="secondary" size="sm" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}

        {primaryAction !== undefined && (
          <Button variant="primary" size="sm" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
      </div>
    </header>
  )
}
