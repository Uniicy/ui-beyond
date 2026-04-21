import { useState, useRef, useEffect, useCallback, type HTMLAttributes } from 'react'
import { Checkbox } from '../checkbox'
import { FilterChip } from '../filter-chip'
import styles from './filter-bar.module.css'

export interface FilterBarTab {
  readonly value: string
  readonly label: string
  readonly count?: number
}

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  readonly tabs: ReadonlyArray<FilterBarTab>
  readonly activeTab: string
  readonly onTabChange: (value: string) => void
  readonly activeProvider?: string
  readonly onProviderChange?: (provider: string) => void
  readonly activeMarkets?: ReadonlyArray<string>
  readonly onMarketsChange?: (markets: string[]) => void
  readonly searchQuery?: string
  readonly onSearchChange?: (q: string) => void
  readonly dateFrom?: string
  readonly dateTo?: string
  readonly onDateChange?: (from: string, to: string) => void
  readonly onClearAll?: () => void
  readonly activeFilterCount?: number
}

const PROVIDERS = ['All', 'Onfido', 'Jumio'] as const
const MARKETS = ['DE', 'MU', 'NL', 'GB'] as const

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  activeProvider,
  onProviderChange,
  activeMarkets,
  onMarketsChange,
  searchQuery,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateChange,
  onClearAll,
  activeFilterCount,
  className,
  ...props
}: FilterBarProps) {
  const [marketOpen, setMarketOpen] = useState(false)
  const marketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marketOpen) return
    function handleClick(e: MouseEvent) {
      if (marketRef.current && !marketRef.current.contains(e.target as Node)) {
        setMarketOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [marketOpen])

  const toggleMarket = useCallback((market: string) => {
    if (onMarketsChange === undefined || activeMarkets === undefined) return
    const current = [...activeMarkets]
    const index = current.indexOf(market)
    if (index >= 0) {
      current.splice(index, 1)
    } else {
      current.push(market)
    }
    onMarketsChange(current)
  }, [activeMarkets, onMarketsChange])

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = []

  if (activeProvider !== undefined && activeProvider !== '' && activeProvider !== 'All' && onProviderChange !== undefined) {
    chips.push({ key: 'provider', label: `Provider: ${activeProvider}`, onRemove: () => onProviderChange('All') })
  }

  if (activeMarkets !== undefined && onMarketsChange !== undefined) {
    for (const m of activeMarkets) {
      chips.push({ key: `market-${m}`, label: `Market: ${m}`, onRemove: () => toggleMarket(m) })
    }
  }

  if (dateFrom !== undefined && dateFrom !== '' && onDateChange !== undefined) {
    const dateLabel = dateTo !== undefined && dateTo !== ''
      ? `Date: ${dateFrom} \u2013 ${dateTo}`
      : `Date from: ${dateFrom}`
    chips.push({ key: 'date', label: dateLabel, onRemove: () => onDateChange('', '') })
  }

  if (searchQuery !== undefined && searchQuery !== '' && onSearchChange !== undefined) {
    chips.push({ key: 'search', label: `Search: "${searchQuery}"`, onRemove: () => onSearchChange('') })
  }

  const wrapperClassNames = [styles['filterBar'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      {/* Row 1: Tabs */}
      <div className={styles['tabs']}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`${styles['tab']} ${activeTab === tab.value ? styles['tabActive'] : ''}`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={styles['tabCount']}>({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Row 2: Filter controls */}
      <div className={styles['controls']}>
        {/* Provider select */}
        {onProviderChange !== undefined && (
          <select
            className={styles['select']}
            value={activeProvider ?? 'All'}
            onChange={(e) => onProviderChange(e.target.value)}
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>{p === 'All' ? 'All providers' : p}</option>
            ))}
          </select>
        )}

        {/* Market multi-select */}
        {onMarketsChange !== undefined && (
          <div className={styles['marketWrapper']} ref={marketRef}>
            <button
              type="button"
              className={styles['marketBtn']}
              onClick={() => setMarketOpen((p) => !p)}
            >
              Markets {activeMarkets !== undefined && activeMarkets.length > 0 ? `(${activeMarkets.length})` : ''}
              <span style={{ fontSize: '8px' }}>{'\u25BC'}</span>
            </button>
            {marketOpen && (
              <div className={styles['marketDropdown']}>
                {MARKETS.map((m) => (
                  <Checkbox
                    key={m}
                    checked={activeMarkets?.includes(m) ?? false}
                    onChange={() => toggleMarket(m)}
                    label={m}
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date inputs */}
        {onDateChange !== undefined && (
          <>
            <input
              type="date"
              className={styles['dateInput']}
              value={dateFrom ?? ''}
              onChange={(e) => onDateChange(e.target.value, dateTo ?? '')}
              aria-label="Date from"
            />
            <input
              type="date"
              className={styles['dateInput']}
              value={dateTo ?? ''}
              onChange={(e) => onDateChange(dateFrom ?? '', e.target.value)}
              aria-label="Date to"
            />
          </>
        )}

        {/* Search */}
        {onSearchChange !== undefined && (
          <input
            type="text"
            className={styles['searchInput']}
            placeholder="Search players, IDs..."
            value={searchQuery ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        {/* Clear all */}
        {onClearAll !== undefined && activeFilterCount !== undefined && activeFilterCount > 0 && (
          <button type="button" className={styles['clearAll']} onClick={onClearAll}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Row 3: Active filter chips */}
      {chips.length > 0 && (
        <div className={styles['chips']}>
          {chips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
