import { type HTMLAttributes } from 'react'
import styles from './pagination.module.css'

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  /** 1-based current page. */
  readonly page: number
  /** Rows per page. */
  readonly pageSize: number
  /** Total number of items across all pages (drives page count + summary). */
  readonly total: number
  readonly onPageChange: (page: number) => void
  /** Enables the page-size dropdown when provided. */
  readonly onPageSizeChange?: (size: number) => void
  /** Options in the page-size dropdown. */
  readonly pageSizeOptions?: ReadonlyArray<number>
}

/**
 * Paginator with compacting ellipsis logic, prev/next controls, optional
 * page-size selector, and a "Showing X–Y of N" summary. Stateless —
 * consumer owns `page` + `pageSize`.
 */

function computePageNumbers(current: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | 'ellipsis'> = [1]

  if (current > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < totalPages - 2) {
    pages.push('ellipsis')
  }

  pages.push(totalPages)

  return pages
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className,
  ...props
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pageNumbers = computePageNumbers(page, totalPages)

  const wrapperClassNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onPageSizeChange !== undefined && (
          <select
            className={styles['pageSizeSelect']}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt} / page</option>
            ))}
          </select>
        )}
        <span className={styles['summary']}>
          Showing {from}\u2013{to} of {total} results
        </span>
      </div>

      <div className={styles['right']}>
        <button
          type="button"
          className={styles['navBtn']}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {'\u2190'} Prev
        </button>

        {pageNumbers.map((item, i) =>
          item === 'ellipsis' ? (
            <span key={`e-${i}`} className={styles['ellipsis']}>{'\u2026'}</span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles['pageBtn']} ${item === page ? styles['pageBtnActive'] : ''}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className={styles['navBtn']}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next {'\u2192'}
        </button>
      </div>
    </div>
  )
}
