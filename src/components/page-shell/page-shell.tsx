import type { HTMLAttributes, ReactNode } from 'react'
import styles from './page-shell.module.css'
import { SIDEBAR_COLLAPSE_ID, SIDEBAR_DRAWER_ID } from './constants'

const PANEL_TOGGLE_ID = 'ub-detail-panel'

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode
  readonly defaultSidebarCollapsed?: boolean
  readonly defaultDetailPanelOpen?: boolean
}

export function PageShell({
  children,
  defaultSidebarCollapsed = false,
  defaultDetailPanelOpen = false,
  className,
  ...rest
}: PageShellProps) {
  const shellClass = [styles['shell'], className].filter(Boolean).join(' ')

  return (
    <div className={shellClass} {...rest}>
      <input
        type="checkbox"
        id={SIDEBAR_COLLAPSE_ID}
        className={styles['toggle']}
        data-role="collapse"
        defaultChecked={defaultSidebarCollapsed}
        aria-label="Collapse sidebar"
      />
      <input
        type="checkbox"
        id={SIDEBAR_DRAWER_ID}
        className={styles['toggle']}
        data-role="drawer"
        aria-label="Open navigation menu"
      />
      <input
        type="checkbox"
        id={PANEL_TOGGLE_ID}
        className={styles['toggle']}
        data-role="panel"
        defaultChecked={defaultDetailPanelOpen}
        aria-label="Open detail panel"
      />
      {children}
      <label htmlFor={SIDEBAR_DRAWER_ID} className={styles['backdrop']} aria-label="Close navigation menu" />
    </div>
  )
}

export interface PageShellSidebarProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode
}

PageShell.Sidebar = function PageShellSidebar({ children, className, ...rest }: PageShellSidebarProps) {
  const c = [styles['sidebar'], className].filter(Boolean).join(' ')
  return (
    <aside className={c} {...rest}>
      {children}
    </aside>
  )
}

export interface PageShellHeaderProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode
}

PageShell.Header = function PageShellHeader({ children, className, ...rest }: PageShellHeaderProps) {
  const c = [styles['header'], className].filter(Boolean).join(' ')
  return (
    <div className={c} {...rest}>
      {children}
    </div>
  )
}

export interface PageShellBodyProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode
}

PageShell.Body = function PageShellBody({ children, className, ...rest }: PageShellBodyProps) {
  const c = [styles['body'], className].filter(Boolean).join(' ')
  return (
    <div className={c} {...rest}>
      {children}
    </div>
  )
}

export interface PageShellMainProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode
}

PageShell.Main = function PageShellMain({ children, className, ...rest }: PageShellMainProps) {
  const c = [styles['main'], className].filter(Boolean).join(' ')
  return (
    <main className={c} {...rest}>
      {children}
    </main>
  )
}

export interface PageShellDetailPanelProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode
}

PageShell.DetailPanel = function PageShellDetailPanel({ children, className, ...rest }: PageShellDetailPanelProps) {
  const c = [styles['detailPanel'], className].filter(Boolean).join(' ')
  return (
    <aside className={c} {...rest}>
      {children}
    </aside>
  )
}

export { SIDEBAR_COLLAPSE_ID, SIDEBAR_DRAWER_ID, PANEL_TOGGLE_ID }
