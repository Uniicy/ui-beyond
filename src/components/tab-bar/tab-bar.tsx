import { useRef, useCallback, type HTMLAttributes, type KeyboardEvent } from 'react'
import { Badge } from '../badge'
import styles from './tab-bar.module.css'

interface TabItem {
  readonly value: string
  readonly label: string
  readonly badge?: number
  readonly disabled?: boolean
}

type TabBarSize = 'sm' | 'md'

export interface TabBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab definitions in render order. Supports `badge` for notification counts and `disabled`. */
  readonly tabs: ReadonlyArray<TabItem>
  /** Currently selected tab value (controlled). */
  readonly activeTab: string
  readonly onTabChange: (value: string) => void
  readonly size?: TabBarSize
  /** Draw a bottom border under the whole bar. */
  readonly bordered?: boolean
  /** Remove horizontal padding. Use when wrapping in an already-padded container. */
  readonly flush?: boolean
}

/**
 * Keyboard-navigable tab strip (ArrowLeft/Right, Home, End) with WAI-ARIA
 * tablist semantics. Consumer owns the panel content and selected state.
 */

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  size = 'md',
  bordered = true,
  flush = false,
  className,
  ...props
}: TabBarProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const enabledTabs = tabs.filter((t) => !t.disabled)

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabledIndices = tabs
      .map((t, i) => ({ disabled: t.disabled, index: i }))
      .filter((t) => !t.disabled)
      .map((t) => t.index)

    const currentEnabledPos = enabledIndices.indexOf(index)
    if (currentEnabledPos === -1) return

    let nextIndex: number | undefined

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextPos = (currentEnabledPos + 1) % enabledIndices.length
      nextIndex = enabledIndices[nextPos]
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevPos = (currentEnabledPos - 1 + enabledIndices.length) % enabledIndices.length
      nextIndex = enabledIndices[prevPos]
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = enabledIndices[0]
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = enabledIndices[enabledIndices.length - 1]
    }

    if (nextIndex !== undefined) {
      tabRefs.current[nextIndex]?.focus()
      const tab = tabs[nextIndex]
      if (tab !== undefined) {
        onTabChange(tab.value)
      }
    }
  }, [tabs, onTabChange])

  const barClassNames = [
    styles['tabBar'],
    styles[size],
    bordered ? styles['bordered'] : undefined,
    !flush ? styles['padded'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={barClassNames} role="tablist" {...props}>
      {tabs.map((tab, i) => {
        const isActive = tab.value === activeTab

        const tabClassNames = [
          styles['tab'],
          isActive ? styles['tabActive'] : undefined,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={tab.value}
            ref={(el) => { tabRefs.current[i] = el }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            className={tabClassNames}
            onClick={() => onTabChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="count" count={tab.badge} />
            )}
          </button>
        )
      })}
    </div>
  )
}
