import { type HTMLAttributes, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import styles from './json-viewer.module.css'

export interface JsonViewerProps extends HTMLAttributes<HTMLDivElement> {
  readonly data: unknown
  readonly initialDepth?: number
  readonly searchable?: boolean
  readonly copyable?: boolean
  readonly maxHeight?: string
  readonly theme?: 'dark' | 'light'
}

interface NodeState {
  readonly [path: string]: boolean
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isExpandable(value: unknown): boolean {
  return isObject(value) || Array.isArray(value)
}

function getEntries(value: unknown): ReadonlyArray<readonly [string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((v, i) => [String(i), v] as const)
  }
  if (isObject(value)) {
    return Object.entries(value)
  }
  return []
}

function buildDefaultExpanded(data: unknown, depth: number, path: string): NodeState {
  if (depth <= 0 || !isExpandable(data)) {
    return {}
  }

  const entries = getEntries(data)

  return entries.reduce(
    (acc, [key, value]) => {
      const childPath = path ? `${path}.${key}` : key
      return { ...acc, ...buildDefaultExpanded(value, depth - 1, childPath) }
    },
    { [path]: true } as NodeState,
  )
}

function collectAllPaths(data: unknown, path: string): ReadonlyArray<string> {
  if (!isExpandable(data)) {
    return []
  }

  const paths: Array<string> = [path]
  const entries = getEntries(data)

  for (const [key, value] of entries) {
    const childPath = path ? `${path}.${key}` : key
    const childPaths = collectAllPaths(value, childPath)
    paths.push(...childPaths)
  }

  return paths
}

function findMatchPaths(
  data: unknown,
  query: string,
  path: string,
): ReadonlyArray<string> {
  if (!query) return []

  const matches: Array<string> = []
  const lowerQuery = query.toLowerCase()

  if (isExpandable(data)) {
    const entries = getEntries(data)
    for (const [key, value] of entries) {
      const childPath = path ? `${path}.${key}` : key

      if (key.toLowerCase().includes(lowerQuery)) {
        matches.push(childPath)
      }

      const childMatches = findMatchPaths(value, query, childPath)
      matches.push(...childMatches)
    }
  }

  return matches
}

function getAncestorPaths(path: string): ReadonlyArray<string> {
  const parts = path.split('.')
  const ancestors: Array<string> = []

  for (let i = 1; i < parts.length; i++) {
    ancestors.push(parts.slice(0, i).join('.'))
  }

  return ancestors
}

function CollapsedPreview({ value }: { readonly value: unknown }) {
  const entries = getEntries(value)
  const isArr = Array.isArray(value)
  const open = isArr ? '[' : '{'
  const close = isArr ? ']' : '}'
  const maxPreview = 3
  const shown = entries.slice(0, maxPreview)
  const remaining = entries.length - shown.length

  return (
    <span className={styles['preview']}>
      {open}{' '}
      {shown.map(([key], i) => (
        <span key={key}>
          {!isArr && <span className={styles['previewKey']}>{key}</span>}
          {i < shown.length - 1 && ', '}
        </span>
      ))}
      {remaining > 0 && (
        <span className={styles['previewMore']}>{shown.length > 0 && ', '}...+{remaining}</span>
      )}
      {' '}{close}
    </span>
  )
}

function ValueRenderer({ value }: { readonly value: unknown }) {
  if (value === null) {
    return <span className={styles['null']}>null</span>
  }

  if (typeof value === 'boolean') {
    return <span className={styles['boolean']}>{String(value)}</span>
  }

  if (typeof value === 'number') {
    return <span className={styles['number']}>{value}</span>
  }

  if (typeof value === 'string') {
    return <span className={styles['string']}>"{value}"</span>
  }

  return <span className={styles['null']}>undefined</span>
}

interface JsonNodeProps {
  readonly nodeKey: string
  readonly value: unknown
  readonly path: string
  readonly depth: number
  readonly expanded: NodeState
  readonly onToggle: (path: string) => void
  readonly copyable: boolean
  readonly onCopyPath: (path: string) => void
  readonly copiedPath: string | null
  readonly matchingPaths: ReadonlySet<string>
  readonly searchQuery: string
  readonly isRoot?: boolean
}

function JsonNode({
  nodeKey,
  value,
  path,
  depth,
  expanded,
  onToggle,
  copyable,
  onCopyPath,
  copiedPath,
  matchingPaths,
  searchQuery,
  isRoot = false,
}: JsonNodeProps) {
  const expandable = isExpandable(value)
  const isExpanded = expanded[path] ?? false
  const entries = expandable ? getEntries(value) : []
  const isArr = Array.isArray(value)
  const isMatch = searchQuery !== '' && matchingPaths.has(path)

  const rowClassNames = [
    styles['row'],
    isMatch ? styles['highlighted'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const caretClassNames = [
    styles['caret'],
    isExpanded ? styles['caretOpen'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles['node']}>
      <div
        className={rowClassNames}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={expandable ? () => onToggle(path) : undefined}
        role={expandable ? 'button' : undefined}
        tabIndex={expandable ? 0 : undefined}
        onKeyDown={expandable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle(path)
          }
        } : undefined}
      >
        <span className={styles['caretSlot']}>
          {expandable && <span className={caretClassNames}>▶</span>}
        </span>

        {!isRoot && (
          <>
            <span className={styles['key']}>{nodeKey}</span>
            <span className={styles['colon']}>:&nbsp;</span>
          </>
        )}

        {expandable && !isExpanded && <CollapsedPreview value={value} />}
        {expandable && isExpanded && (
          <span className={styles['bracket']}>
            {isArr ? `[${entries.length}]` : `{${entries.length}}`}
          </span>
        )}
        {!expandable && <ValueRenderer value={value} />}

        {copyable && !isRoot && (
          <span className={styles['copySlot']}>
            <button
              type="button"
              className={styles['copyBtn']}
              onClick={(e) => {
                e.stopPropagation()
                onCopyPath(path)
              }}
              aria-label={`Copy path ${path}`}
            >
              {copiedPath === path ? (
                <span className={styles['copiedTooltip']}>Copied</span>
              ) : (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          </span>
        )}
      </div>

      {expandable && isExpanded && (
        <div className={styles['children']}>
          {entries.map(([childKey, childValue]) => {
            const childPath = path ? `${path}.${childKey}` : childKey
            return (
              <JsonNode
                key={childKey}
                nodeKey={childKey}
                value={childValue}
                path={childPath}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                copyable={copyable}
                onCopyPath={onCopyPath}
                copiedPath={copiedPath}
                matchingPaths={matchingPaths}
                searchQuery={searchQuery}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export function JsonViewer({
  data,
  initialDepth = 2,
  searchable = false,
  copyable = true,
  maxHeight = 'none',
  theme = 'dark',
  className,
  ...props
}: JsonViewerProps) {
  const [expanded, setExpanded] = useState<NodeState>(() =>
    buildDefaultExpanded(data, initialDepth, '$'),
  )
  useEffect(() => {
    setExpanded(buildDefaultExpanded(data, initialDepth, '$'))
  }, [data, initialDepth])

  const [searchQuery, setSearchQuery] = useState('')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const matchingPathsList = useMemo(
    () => (searchQuery ? findMatchPaths(data, searchQuery, '$') : []),
    [data, searchQuery],
  )

  const matchingPaths = useMemo(
    () => new Set(matchingPathsList),
    [matchingPathsList],
  )

  const searchExpandedPaths = useMemo(() => {
    if (!searchQuery || matchingPaths.size === 0) return {}

    const pathsToExpand: Record<string, boolean> = { $: true }
    for (const mp of matchingPaths) {
      const ancestors = getAncestorPaths(mp)
      for (const a of ancestors) {
        pathsToExpand[a] = true
      }
      if (isExpandable(getValueAtPath(data, mp))) {
        pathsToExpand[mp] = true
      }
    }
    return pathsToExpand
  }, [data, matchingPaths, searchQuery])

  const effectiveExpanded = searchQuery ? searchExpandedPaths : expanded

  const handleToggle = useCallback((path: string) => {
    if (searchQuery) return
    setExpanded((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }, [searchQuery])

  const handleExpandAll = useCallback(() => {
    const allPaths = collectAllPaths(data, '$')
    const allExpanded: Record<string, boolean> = {}
    for (const p of allPaths) {
      allExpanded[p] = true
    }
    setExpanded(allExpanded)
  }, [data])

  const handleCollapseAll = useCallback(() => {
    setExpanded({ $: true })
  }, [])

  const handleCopyPath = useCallback((path: string) => {
    const displayPath = path.replace(/^\$\.?/, 'data.')
    const cleanPath = displayPath.endsWith('.') ? displayPath.slice(0, -1) : displayPath
    const finalPath = cleanPath === 'data.' ? 'data' : cleanPath
    navigator.clipboard.writeText(finalPath).catch(() => {})

    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current)
    }

    setCopiedPath(path)
    copiedTimerRef.current = setTimeout(() => {
      setCopiedPath(null)
    }, 1200)
  }, [])

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const containerClassNames = [
    styles['jsonViewer'],
    styles[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const scrollStyle = maxHeight !== 'none' ? { maxHeight, overflow: 'auto' as const } : undefined

  return (
    <div className={containerClassNames} {...props}>
      <div className={styles['toolbar']}>
        {searchable && (
          <div className={styles['searchBar']}>
            <input
              type="text"
              className={styles['searchInput']}
              placeholder="Filter keys…"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <>
                <span className={styles['matchCount']}>
                  {matchingPaths.size} match{matchingPaths.size !== 1 ? 'es' : ''}
                </span>
                <button
                  type="button"
                  className={styles['clearBtn']}
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              </>
            )}
          </div>
        )}

        {!searchable && (
          <div className={styles['expandControls']}>
            <button type="button" className={styles['controlLink']} onClick={handleExpandAll}>
              Expand all
            </button>
            <span className={styles['controlSep']}>·</span>
            <button type="button" className={styles['controlLink']} onClick={handleCollapseAll}>
              Collapse all
            </button>
          </div>
        )}
      </div>

      <div className={styles['tree']} style={scrollStyle}>
        <JsonNode
          nodeKey="$"
          value={data}
          path="$"
          depth={0}
          expanded={effectiveExpanded}
          onToggle={handleToggle}
          copyable={copyable}
          onCopyPath={handleCopyPath}
          copiedPath={copiedPath}
          matchingPaths={matchingPaths}
          searchQuery={searchQuery}
          isRoot
        />
      </div>
    </div>
  )
}

function getValueAtPath(data: unknown, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = data

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part === '$') continue
    if (!isObject(current) && !Array.isArray(current)) return undefined
    current = (current as Record<string, unknown>)[part!]
  }

  return current
}
