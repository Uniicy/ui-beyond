import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { DuplicateMatchCard, type DuplicateMatch } from '../duplicate-match-card'
import { EmptyState } from '../empty-state'
import { TabBar } from '../tab-bar'
import styles from './duplicate-panel.module.css'

export interface DuplicatePanelProps {
  readonly matches: ReadonlyArray<DuplicateMatch>
  readonly onConfirmMerge: (matchId: string) => void
  readonly onDismiss: (matchId: string) => void
  readonly onBack: () => void
  readonly loading?: boolean
  readonly className?: string
}

type ConfBand = 'all' | 'high' | 'medium' | 'low' | 'dismissed'

function getBand(conf: number): 'high' | 'medium' | 'low' {
  if (conf >= 0.9) return 'high'
  if (conf >= 0.7) return 'medium'
  return 'low'
}

function filterMatches(matches: ReadonlyArray<DuplicateMatch>, tab: ConfBand): ReadonlyArray<DuplicateMatch> {
  if (tab === 'all') return matches.filter((m) => m.status !== 'dismissed')
  if (tab === 'dismissed') return matches.filter((m) => m.status === 'dismissed')
  return matches.filter((m) => m.status !== 'dismissed' && getBand(m.confidence) === tab)
}

export function DuplicatePanel({
  matches,
  onConfirmMerge,
  onDismiss,
  onBack,
  loading = false,
  className,
}: DuplicatePanelProps) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [mergeTarget, setMergeTarget] = useState<DuplicateMatch | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const highCount = matches.filter((m) => m.status !== 'dismissed' && getBand(m.confidence) === 'high').length
  const medCount = matches.filter((m) => m.status !== 'dismissed' && getBand(m.confidence) === 'medium').length
  const lowCount = matches.filter((m) => m.status !== 'dismissed' && getBand(m.confidence) === 'low').length
  const dismissedCount = matches.filter((m) => m.status === 'dismissed').length

  const tabs = [
    { value: 'all', label: 'All', count: highCount + medCount + lowCount },
    { value: 'high', label: 'High confidence', count: highCount },
    { value: 'medium', label: 'Medium', count: medCount },
    { value: 'low', label: 'Low', count: lowCount },
    { value: 'dismissed', label: 'Dismissed', count: dismissedCount },
  ]

  const filtered = filterMatches(matches, activeTab as ConfBand)

  const handleMergeClick = useCallback((matchId: string) => {
    const m = matches.find((x) => x.id === matchId)
    if (m) setMergeTarget(m)
  }, [matches])

  const confirmMerge = useCallback(() => {
    if (mergeTarget === null) return
    onConfirmMerge(mergeTarget.id)
    setToast(`Accounts merged \u2014 ${mergeTarget.playerA.id} is now the primary account`)
    setMergeTarget(null)
  }, [mergeTarget, onConfirmMerge])

  useEffect(() => {
    if (toast === null) return
    const id = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(id)
  }, [toast])

  const wrapperClassNames = [className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClassNames}>
      {/* Subheader */}
      <div className={styles['subheader']}>
        <div className={styles['subLeft']}>
          <button type="button" className={styles['backLink']} onClick={onBack}>
            {'\u2190'} Back to players
          </button>
          <span className={styles['divider']} />
          <span className={styles['title']}>Suspected duplicates</span>
        </div>
        <div className={styles['subRight']}>
          {highCount > 0 && <Badge variant="critical" size="sm" label={`${highCount} high`} />}
          {medCount > 0 && <Badge variant="pending" size="sm" label={`${medCount} medium`} />}
          {lowCount > 0 && <Badge variant="standard" size="sm" label={`${lowCount} low`} />}
        </div>
      </div>

      {/* Filter tabs */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} size="sm" flush bordered />

      {/* Content */}
      <div className={styles['content']}>
        {loading ? (
          <>
            <div className={styles['skeleton']} />
            <div className={styles['skeleton']} />
            <div className={styles['skeleton']} />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="no-data"
            title="No suspected duplicates"
            description="The duplicate detection engine will surface new pairs as players register."
          />
        ) : (
          filtered.map((m) => (
            <DuplicateMatchCard
              key={m.id}
              match={m}
              onConfirmMerge={handleMergeClick}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>

      {/* Merge confirm modal */}
      {mergeTarget !== null && typeof document !== 'undefined' && createPortal(
        <div className={styles['modalBackdrop']} onClick={() => setMergeTarget(null)}>
          <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
            <span className={styles['modalTitle']}>Confirm account merge</span>
            <span className={styles['modalDesc']}>
              This will permanently merge these two accounts. The older account becomes the primary. This action cannot be undone.
            </span>
            <div className={styles['modalPlayers']}>
              <Avatar name={mergeTarget.playerA.name} size="sm" />
              <span>{mergeTarget.playerA.name}</span>
              <span className={styles['modalPrimary']}>(primary)</span>
              <span className={styles['modalArrow']}>{'\u2190'}</span>
              <Avatar name={mergeTarget.playerB.name} size="sm" />
              <span>{mergeTarget.playerB.name}</span>
            </div>
            <div className={styles['modalActions']}>
              <Button variant="ghost" size="sm" onClick={() => setMergeTarget(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={confirmMerge}>Merge accounts</Button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Toast */}
      {toast !== null && typeof document !== 'undefined' && createPortal(
        <div className={styles['toast']}>
          {'\u2713'} {toast}
        </div>,
        document.body,
      )}
    </div>
  )
}
