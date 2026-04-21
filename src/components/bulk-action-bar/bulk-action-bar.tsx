import { useState, useRef, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import styles from './bulk-action-bar.module.css'

interface Agent {
  readonly id: string
  readonly name: string
}

export interface BulkActionBarProps {
  readonly selectedCount: number
  readonly agents: ReadonlyArray<Agent>
  readonly onAssignToMe: () => void
  readonly onAssignTo: (agentId: string) => void
  readonly onExport: () => void
  readonly onClearSelection: () => void
  readonly visible: boolean
  readonly className?: string
}

export function BulkActionBar({
  selectedCount,
  agents,
  onAssignToMe,
  onAssignTo,
  onExport,
  onClearSelection,
  visible,
  className,
}: BulkActionBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const barClassNames = [
    styles['bar'],
    !visible ? styles['hidden'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={barClassNames}>
      <div className={styles['left']}>
        <Badge variant="count" count={selectedCount} />
        <span className={styles['selectedText']}>selected</span>
      </div>

      <div className={styles['right']}>
        <button type="button" className={styles['ghostBtn']} onClick={onAssignToMe}>
          Assign to me
        </button>

        <div className={styles['assignWrapper']} ref={dropdownRef}>
          <button
            type="button"
            className={styles['ghostBtn']}
            onClick={() => setDropdownOpen((p) => !p)}
          >
            Assign to {'\u25BE'}
          </button>
          {dropdownOpen && (
            <div className={styles['assignDropdown']}>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  className={styles['assignItem']}
                  onClick={() => { onAssignTo(agent.id); setDropdownOpen(false) }}
                >
                  <Avatar name={agent.name} size="xs" />
                  {agent.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={styles['divider']} />

        <button type="button" className={styles['ghostBtn']} onClick={onExport}>
          Export
        </button>

        <span className={styles['divider']} />

        <button type="button" className={styles['clearBtn']} onClick={onClearSelection}>
          Clear
        </button>
      </div>
    </div>
  )
}
