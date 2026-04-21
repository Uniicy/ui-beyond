import { type CSSProperties, type ReactNode, type HTMLAttributes } from 'react'
import { BulkActionBar, type BulkActionBarProps } from '../bulk-action-bar'
import { EmptyState, type EmptyStateProps } from '../empty-state'
import { Pagination } from '../pagination'
import { TableHeader, buildGridTemplate, type TableColumn } from '../table-header'
import styles from './data-table.module.css'

/**
 * Custom property that downstream row components consume so their
 * `grid-template-columns` always matches the header. See `*-row` CSS
 * modules: `grid-template-columns: var(--ub-row-grid-template, ...)`.
 */
type GridCSSVar = CSSProperties & { '--ub-row-grid-template'?: string }

export interface DataTableProps extends HTMLAttributes<HTMLDivElement> {
  readonly columns: ReadonlyArray<TableColumn>
  readonly rows: ReadonlyArray<ReactNode>
  readonly selectable?: boolean
  readonly selectedIds?: ReadonlyArray<string>
  readonly onSelectAll?: () => void
  readonly sortKey?: string
  readonly sortDir?: 'asc' | 'desc'
  readonly onSort?: (key: string) => void
  readonly loading?: boolean
  readonly empty?: boolean
  readonly emptyProps?: EmptyStateProps
  readonly page?: number
  readonly pageSize?: number
  readonly total?: number
  readonly onPageChange?: (page: number) => void
  readonly bulkActions?: BulkActionBarProps
}

function selectState(selectedIds?: ReadonlyArray<string>, totalRows?: number): 'none' | 'some' | 'all' {
  if (selectedIds === undefined || selectedIds.length === 0) return 'none'
  if (totalRows !== undefined && selectedIds.length >= totalRows) return 'all'
  return 'some'
}

export function DataTable({
  columns,
  rows,
  selectable = false,
  selectedIds,
  onSelectAll,
  sortKey,
  sortDir,
  onSort,
  loading = false,
  empty = false,
  emptyProps,
  page,
  pageSize,
  total,
  onPageChange,
  bulkActions,
  className,
  style,
  ...props
}: DataTableProps) {
  const gridTemplate = buildGridTemplate(columns, { selectable })

  const showBulk = bulkActions !== undefined && selectedIds !== undefined && selectedIds.length > 0

  const tableClassNames = [styles['table'], className]
    .filter(Boolean)
    .join(' ')

  // Expose the computed template to descendant rows so their
  // `grid-template-columns: var(--ub-row-grid-template, ...)` aligns 1:1
  // with the header. This is the single source of truth.
  const tableStyle: GridCSSVar = { ...style, '--ub-row-grid-template': gridTemplate }

  return (
    <div className={tableClassNames} style={tableStyle} {...props}>
      {/* Bulk action bar */}
      {bulkActions !== undefined && (
        <BulkActionBar {...bulkActions} visible={showBulk} />
      )}

      {/* Header */}
      <TableHeader
        columns={columns}
        gridTemplate={gridTemplate}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        selectable={selectable}
        selectState={selectState(selectedIds, rows.length)}
        onSelectAll={onSelectAll !== undefined ? () => onSelectAll() : undefined}
      />

      {/* Body */}
      <div className={styles['body']}>
        {loading ? (
          Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={styles['skeletonRow']}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {selectable && <div className={styles['skeletonCell']}><div className={styles['skeletonBar']} style={{ width: 14 }} /></div>}
              {columns.map((col) => (
                <div key={col.key} className={styles['skeletonCell']}>
                  <div className={styles['skeletonBar']} style={{ width: `${40 + Math.random() * 40}%` }} />
                </div>
              ))}
            </div>
          ))
        ) : empty ? (
          <EmptyState
            variant={emptyProps?.variant ?? 'no-results'}
            title={emptyProps?.title ?? 'No results found'}
            description={emptyProps?.description}
            action={emptyProps?.action}
          />
        ) : (
          rows
        )}
      </div>

      {/* Pagination */}
      {page !== undefined && pageSize !== undefined && total !== undefined && onPageChange !== undefined && (
        <div className={styles['footer']}>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
