import { type HTMLAttributes } from 'react'
import styles from './surface.module.css'

type SurfaceElevation = 'base' | 'low' | 'medium' | 'high' | 'highest'

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  readonly elevation?: SurfaceElevation
  readonly glass?: boolean
  readonly floating?: boolean
  readonly nested?: boolean
}

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
