import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './kpi-row.module.css'

export interface KpiRowProps extends HTMLAttributes<HTMLDivElement> {
  readonly children?: ReactNode
  readonly minItemWidth?: number
}

export function KpiRow({ children, minItemWidth, className, style, ...rest }: KpiRowProps) {
  const c = [styles['kpiRow'], className].filter(Boolean).join(' ')
  const merged: CSSProperties = {
    ...style,
    ...(minItemWidth !== undefined ? { '--kpi-min': `${minItemWidth}px` } as CSSProperties : {}),
  }
  return (
    <div className={c} style={merged} {...rest}>
      {children}
    </div>
  )
}
