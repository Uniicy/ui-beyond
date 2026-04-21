import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './split.module.css'

export type SplitRatio = '1-1' | '2-1' | '1-2' | '3-1' | '1-3' | '2-1-1' | '1-1-1'
export type SplitBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

export interface SplitProps extends HTMLAttributes<HTMLDivElement> {
  readonly children?: ReactNode
  /** Column ratio. `'2-1'` = 2fr 1fr. Three-column ratios (`'2-1-1'`, `'1-1-1'`) also supported. */
  readonly ratio?: SplitRatio
  /** Breakpoint below which columns stack vertically. */
  readonly collapseBelow?: SplitBreakpoint
  readonly gap?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * CSS-grid two/three-column layout with a responsive collapse breakpoint.
 * Use for master-detail pages, dashboards, side-by-side comparisons.
 */

const RATIO_MAP: Record<SplitRatio, string> = {
  '1-1': '1fr 1fr',
  '2-1': '2fr 1fr',
  '1-2': '1fr 2fr',
  '3-1': '3fr 1fr',
  '1-3': '1fr 3fr',
  '2-1-1': '2fr 1fr 1fr',
  '1-1-1': '1fr 1fr 1fr',
}

const GAP_MAP: Record<NonNullable<SplitProps['gap']>, string> = {
  sm: 'var(--ub-space-3)',
  md: 'var(--ub-space-4)',
  lg: 'var(--ub-space-6)',
  xl: 'var(--ub-space-8)',
}

export function Split({
  children,
  ratio = '2-1',
  collapseBelow = 'lg',
  gap,
  className,
  style,
  ...rest
}: SplitProps) {
  const c = [styles['split'], className].filter(Boolean).join(' ')
  const cols = RATIO_MAP[ratio]
  const merged: CSSProperties = {
    ...style,
    ['--split-cols' as string]: cols,
    ['--split-cols-expanded' as string]: cols,
    ...(gap !== undefined ? { gap: GAP_MAP[gap] } : {}),
  }
  return (
    <div className={c} data-collapse-below={collapseBelow} style={merged} {...rest}>
      {children}
    </div>
  )
}
