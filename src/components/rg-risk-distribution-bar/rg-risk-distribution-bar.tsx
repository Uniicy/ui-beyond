import { type HTMLAttributes } from 'react'
import styles from './rg-risk-distribution-bar.module.css'

type BandLabel = 'Low' | 'Medium' | 'Elevated' | 'High'

interface Band {
  readonly label: BandLabel
  readonly count: number
  readonly percentage: number
  readonly trend?: number
}

export interface RgRiskDistributionBarProps extends HTMLAttributes<HTMLDivElement> {
  readonly bands: ReadonlyArray<Band>
  readonly total: number
  readonly activeband?: string
  readonly onBandClick?: (band: string | null) => void
}

const COUNT_CLASS: Record<BandLabel, string> = {
  Low: styles['countLow'] ?? '',
  Medium: styles['countMedium'] ?? '',
  Elevated: styles['countElevated'] ?? '',
  High: styles['countHigh'] ?? '',
}

const SEG_CLASS: Record<BandLabel, string> = {
  Low: styles['segLow'] ?? '',
  Medium: styles['segMedium'] ?? '',
  Elevated: styles['segElevated'] ?? '',
  High: styles['segHigh'] ?? '',
}

const DOT_CLASS: Record<BandLabel, string> = {
  Low: styles['dotLow'] ?? '',
  Medium: styles['dotMedium'] ?? '',
  Elevated: styles['dotElevated'] ?? '',
  High: styles['dotHigh'] ?? '',
}

export function RgRiskDistributionBar({
  bands,
  total,
  activeband,
  onBandClick,
  className,
  ...props
}: RgRiskDistributionBarProps) {
  const hasFilter = activeband !== undefined
  const isClickable = onBandClick !== undefined

  const handleSegClick = (label: string) => {
    if (onBandClick === undefined) return
    onBandClick(activeband === label ? null : label)
  }

  const wrapperClassNames = [styles['wrapper'], className]
    .filter(Boolean)
    .join(' ')

  const activeBand = hasFilter ? bands.find((b) => b.label === activeband) : undefined

  return (
    <div className={wrapperClassNames} {...props}>
      {/* Row 1: Labels */}
      <div className={styles['labels']}>
        {bands.map((band) => (
          <div
            key={band.label}
            className={styles['labelBlock']}
            style={{ width: `${band.percentage}%` }}
          >
            {band.percentage >= 5 && (
              <>
                <span className={styles['bandName']}>{band.label}</span>
                <span className={`${styles['bandCount']} ${COUNT_CLASS[band.label]}`}>
                  {band.count.toLocaleString('en')}
                </span>
                {band.trend !== undefined && band.trend !== 0 && (
                  <span className={`${styles['trend']} ${band.trend > 0 ? styles['trendUp'] : styles['trendDown']}`}>
                    {band.trend > 0 ? '\u2191' : '\u2193'}{Math.abs(band.trend)}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Row 2: Bar */}
      <div className={styles['bar']}>
        {bands.map((band) => {
          const isActive = activeband === band.label
          const isDimmed = hasFilter && !isActive

          const segClassNames = [
            styles['segment'],
            SEG_CLASS[band.label],
            isClickable ? styles['clickable'] : undefined,
            isActive ? styles['segActive'] : undefined,
            isDimmed ? styles['segDimmed'] : undefined,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={band.label}
              className={segClassNames}
              style={{ width: `${band.percentage}%` }}
              onClick={() => handleSegClick(band.label)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSegClick(band.label) } } : undefined}
              aria-label={`${band.label}: ${band.count} players (${band.percentage}%)`}
            />
          )
        })}
      </div>

      {/* Row 3: Legend + total */}
      <div className={styles['legendRow']}>
        <div className={styles['legend']}>
          {bands.map((band) => (
            <span key={band.label} className={styles['legendItem']}>
              <span className={`${styles['legendDot']} ${DOT_CLASS[band.label]}`} />
              {band.label}
            </span>
          ))}
        </div>
        <span className={styles['totalLabel']}>{total.toLocaleString('en')} players total</span>
      </div>

      {/* Row 4: Active filter strip */}
      {hasFilter && activeBand !== undefined && (
        <div className={styles['filterStrip']}>
          Filtering by {activeBand.label} risk {'\u00b7'} {activeBand.count.toLocaleString('en')} players
          <button type="button" className={styles['clearFilter']} onClick={() => onBandClick?.(null)}>
            Clear filter {'\u00d7'}
          </button>
        </div>
      )}
    </div>
  )
}
