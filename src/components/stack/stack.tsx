import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './stack.module.css'

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type StackDirection = 'row' | 'column'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  readonly children?: ReactNode
  /** Flex direction. `column` (default) for vertical stacks. */
  readonly direction?: StackDirection
  /** Space between items. Maps to design tokens (`--ub-space-*`). */
  readonly gap?: StackGap
  /** Cross-axis alignment. */
  readonly align?: StackAlign
  /** Main-axis distribution. */
  readonly justify?: StackJustify
}

/**
 * Flex-based layout primitive. Use for consistent gap-based spacing
 * without writing ad-hoc CSS. Prefer over raw `div` + margins.
 */

const GAP_MAP: Record<StackGap, string> = {
  none: '0',
  xs: 'var(--ub-space-1)',
  sm: 'var(--ub-space-2)',
  md: 'var(--ub-space-4)',
  lg: 'var(--ub-space-6)',
  xl: 'var(--ub-space-8)',
  '2xl': 'var(--ub-space-12)',
}

export function Stack({
  children,
  direction = 'column',
  gap = 'md',
  align,
  justify,
  className,
  style,
  ...rest
}: StackProps) {
  const c = [styles['stack'], className].filter(Boolean).join(' ')
  const merged: CSSProperties = { ...style, gap: GAP_MAP[gap] }
  return (
    <div
      className={c}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      style={merged}
      {...rest}
    >
      {children}
    </div>
  )
}
