import styles from './sparkline-bar.module.css'

export interface SparklineBarProps {
  readonly data: ReadonlyArray<number>
  readonly width?: number
  readonly height?: number
  readonly showTooltip?: boolean
  readonly className?: string
}

function statusClass(v: number): string {
  if (v >= 0.9) return styles['healthy'] ?? ''
  if (v >= 0.5) return styles['degraded'] ?? ''
  return styles['down'] ?? ''
}

function statusLabel(v: number): string {
  if (v >= 0.9) return 'Healthy'
  if (v >= 0.5) return 'Degraded'
  return 'Down'
}

export function SparklineBar({ data, width = 140, height = 32, showTooltip = true, className }: SparklineBarProps) {
  const count = data.length
  const segW = count > 1 ? (width - (count - 1)) / count : width
  const barCls = [styles['bar'], className].filter(Boolean).join(' ')

  return (
    <div className={barCls} style={{ width, height }}>
      {data.map((v, i) => {
        const hoursAgo = count - 1 - i
        const tooltip = `${hoursAgo === 0 ? 'Now' : `${hoursAgo}h ago`}: ${statusLabel(v)}`
        return (
          <div
            key={i}
            className={`${styles['segment']} ${statusClass(v)} ${!showTooltip ? styles['noTooltip'] ?? '' : ''}`}
            style={{ width: segW, height }}
            data-tooltip={showTooltip ? tooltip : undefined}
          />
        )
      })}
    </div>
  )
}
