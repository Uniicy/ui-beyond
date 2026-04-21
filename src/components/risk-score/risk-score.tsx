import { useState, useEffect, type HTMLAttributes } from 'react'
import { ProgressBar } from '../progress-bar'
import styles from './risk-score.module.css'

type RiskScoreMode = 'inline' | 'full'

export interface RiskScoreProps extends HTMLAttributes<HTMLDivElement> {
  readonly score: number
  readonly mode?: RiskScoreMode
  readonly showLabel?: boolean
  readonly animated?: boolean
}

interface Band {
  readonly intent: 'success' | 'warning' | 'danger'
  readonly label: string
  readonly colorClass: string
  readonly critical: boolean
}

function getBand(score: number): Band {
  if (score < 40) return { intent: 'success', label: 'Low risk', colorClass: styles['colorSuccess'] ?? '', critical: false }
  if (score < 70) return { intent: 'warning', label: 'Medium', colorClass: styles['colorWarning'] ?? '', critical: false }
  if (score < 85) return { intent: 'danger', label: 'High risk', colorClass: styles['colorDanger'] ?? '', critical: false }
  return { intent: 'danger', label: 'Critical', colorClass: styles['colorDanger'] ?? '', critical: true }
}

export function RiskScore({
  score,
  mode = 'inline',
  showLabel = false,
  animated = false,
  className,
  ...props
}: RiskScoreProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score)
      return
    }

    setDisplayScore(0)
    const duration = 600
    const steps = 30
    const increment = score / steps
    let current = 0
    let step = 0

    const id = setInterval(() => {
      step++
      current = Math.min(score, Math.round(increment * step))
      setDisplayScore(current)
      if (step >= steps) {
        clearInterval(id)
        setDisplayScore(score)
      }
    }, duration / steps)

    return () => clearInterval(id)
  }, [score, animated])

  const band = getBand(score)

  const wrapperClassNames = [
    styles['wrapper'],
    styles[mode],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const scoreClassNames = [
    styles['score'],
    band.colorClass,
    band.critical ? styles['pulse'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  if (mode === 'inline') {
    return (
      <div className={wrapperClassNames} {...props}>
        <span className={scoreClassNames}>{displayScore}</span>
        <ProgressBar value={displayScore} height="xs" intent={band.intent} rounded />
      </div>
    )
  }

  return (
    <div className={wrapperClassNames} {...props}>
      <span className={scoreClassNames}>{displayScore}</span>
      {showLabel && <span className={styles['bandLabel']}>{band.label}</span>}
      <ProgressBar
        value={displayScore}
        height="sm"
        intent={band.intent}
        rounded
        label={`${displayScore} / 100`}
      />
      <span className={styles['context']}>Updated 2 hours ago</span>
    </div>
  )
}
