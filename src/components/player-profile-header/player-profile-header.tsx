import { type HTMLAttributes } from 'react'
import { PlayerHeader, type PlayerHeaderPlayer } from '../player-header'
import { TabBar } from '../tab-bar'
import styles from './player-profile-header.module.css'

interface TabItem {
  readonly value: string
  readonly label: string
  readonly badge?: number
  readonly disabled?: boolean
}

export interface PlayerProfileHeaderProps extends HTMLAttributes<HTMLDivElement> {
  readonly player: PlayerHeaderPlayer
  readonly tabs: ReadonlyArray<TabItem>
  readonly activeTab: string
  readonly onTabChange: (value: string) => void
  readonly onNewVerification?: () => void
  readonly onFlagPlayer?: () => void
}

export function PlayerProfileHeader({
  player,
  tabs,
  activeTab,
  onTabChange,
  onNewVerification,
  onFlagPlayer,
  className,
  ...props
}: PlayerProfileHeaderProps) {
  const wrapperClassNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassNames} {...props}>
      <PlayerHeader
        player={player}
        onNewVerification={onNewVerification}
        onFlagPlayer={onFlagPlayer}
      />
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        flush
        bordered={false}
      />
    </div>
  )
}
