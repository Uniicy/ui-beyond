import { type HTMLAttributes } from 'react'
import styles from './surface.module.css'

type SurfaceElevation = 'base' | 'low' | 'medium' | 'high' | 'highest'

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Depth in the elevation scale. Higher = more pronounced shadow. */
  readonly elevation?: SurfaceElevation
  /** Frosted-glass background (requires backdrop-filter support). Overrides `elevation`. */
  readonly glass?: boolean
  /** Fixed/sticky overlay treatment (stronger shadow, tighter border). */
  readonly floating?: boolean
  /** Indicates a surface nested within another surface (subtle tone-down). */
  readonly nested?: boolean
}

/**
 * Container primitive for visually separating content blocks. Every card,
 * panel, modal, popover should be a `Surface` so elevation stays
 * consistent with design tokens.
 */

export function Surface({
  elevation = 'base',
  glass = false,
  floating = false,
  nested = false,
  className,
  ...props
}: SurfaceProps) {
  const classNames = [
    styles['surface'],
    glass ? styles['glass'] : styles[elevation],
    floating ? styles['floating'] : undefined,
    nested ? styles['nested'] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classNames} {...props} />
}
