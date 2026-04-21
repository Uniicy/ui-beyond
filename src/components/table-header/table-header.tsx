import { type HTMLAttributes } from 'react'
import { Checkbox } from '../checkbox'
import styles from './table-header.module.css'

export interface TableColumn {
  readonly key: string
  readonly label: string
  readonly sortable?: boolean
  /**
   * Track size for this column. Accepts any valid `grid-template-columns`
   * track expression (`px`, `fr`, `%`, `minmax(...)`, `auto`, ...).
   * When omitted, the column defaults to `1fr` (filling available space).
   */
  readonly width?: string
  /**
   * When true, the column expands to fill leftover horizontal space.
   * If `width` is set, it is treated as the column's minimum size:
   * the track becomes `minmax(<width>, 1fr)`. If `width` is omitted,
   * the track is `minmax(0, 1fr)`.
   */
  readonly grow?: boolean
  readonly align?: 'left' | 'right' | 'center'
}

type SelectState = 'none' | 'some' | 'all'

export interface BuildGridTemplateOptions {
  /** Prefix `40px` for the leading checkbox column. Default `false`. */
  readonly selectable?: boolean
  /**
   * When no column has `grow: true`, append a trailing `minmax(0, 1fr)`
   * filler track so the row visually fills its container. The track holds
   * no item; it just absorbs leftover width. Default `true`.
   */
  readonly fillRemaining?: boolean
}

const FLEX_TOKEN_RE = /(fr\b|%|minmax\s*\(|auto\b)/i

function trackForColumn(col: TableColumn): string {
  if (col.grow === true) {
    const min = col.width !== undefined && col.width !== '' ? col.width : '0'
    return `minmax(${min}, 1fr)`
  }
  if (col.width !== undefined && col.width !== '') return col.width
  return '1fr'
}

/**
 * Build a `grid-template-columns` string from a TableColumn[].
 *
 * Single source of truth shared by `TableHeader` and `DataTable` so that
 * row components (which read `--ub-row-grid-template`) always align with
 * the header.
 */
export function buildGridTemplate(
  columns: ReadonlyArray<TableColumn>,
  options: BuildGridTemplateOptions = {},
): string {
  const { selectable = false, fillRemaining = true } = options

  const tracks: string[] = []
  if (selectable) tracks.push('40px')

  let hasFlexible = false
  for (const col of columns) {
    const track = trackForColumn(col)
    if (FLEX_TOKEN_RE.test(track)) hasFlexible = true
    tracks.push(track)
  }

  if (fillRemaining && !hasFlexible) tracks.push('minmax(0, 1fr)')

  return tracks.join(' ')
}

export interface TableHeaderProps extends HTMLAttributes<HTMLDivElement> {
  readonly columns: ReadonlyArray<TableColumn>
  readonly sortKey?: string
  readonly sortDir?: 'asc' | 'desc'
  readonly onSort?: (key: string) => void
  readonly selectable?: boolean
  readonly selectState?: SelectState
  readonly onSelectAll?: (checked: boolean) => void
  /**
   * Pre-computed grid template. When supplied, overrides the internal
   * computation. `DataTable` passes this so header and rows share one
   * source of truth.
   */
  readonly gridTemplate?: string
}

function sortSymbol(key: string, sortKey?: string, sortDir?: 'asc' | 'desc'): string {
  if (key !== sortKey) return '\u2195'
  return sortDir === 'asc' ? '\u2191' : '\u2193'
}

export function TableHeader({
  columns,
  sortKey,
  sortDir,
  onSort,
  selectable = false,
  selectState = 'none',
  onSelectAll,
  gridTemplate,
  className,
  ...props
}: TableHeaderProps) {
  const template = gridTemplate ?? buildGridTemplate(columns, { selectable })

  const headerClassNames = [styles['header'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={headerClassNames} style={{ gridTemplateColumns: template }} {...props}>
      {selectable && (
        <div className={styles['checkCell']}>
          <Checkbox
            checked={selectState === 'all'}
            indeterminate={selectState === 'some'}
            onChange={(checked) => onSelectAll?.(checked)}
            size="sm"
          />
        </div>
      )}

      {columns.map((col) => {
        const isActive = col.key === sortKey
        const cellClassNames = [
          styles['cell'],
          styles[col.align ?? 'left'],
          col.sortable ? styles['sortable'] : undefined,
          isActive ? styles['sortActive'] : undefined,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div
            key={col.key}
            className={cellClassNames}
            onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
          >
            {col.label}
            {col.sortable && (
              <span className={styles['sortIcon']}>
                {sortSymbol(col.key, sortKey, sortDir)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
