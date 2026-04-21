import { Fragment } from 'react'
import styles from './WidgetStepIndicator.module.css'

export interface WidgetStepIndicatorProps {
  readonly steps: readonly string[]
  readonly currentStep: number
}

type StepState = 'past' | 'active' | 'future'

function classify(index: number, currentStep: number): StepState {
  if (index < currentStep) return 'past'
  if (index === currentStep) return 'active'
  return 'future'
}

const CIRCLE_STATE_CLASS: Record<StepState, string | undefined> = {
  past: styles['circlePast'],
  active: styles['circleActive'],
  future: styles['circleFuture'],
}

const LABEL_STATE_CLASS: Record<StepState, string | undefined> = {
  past: styles['labelPast'],
  active: styles['labelActive'],
  future: styles['labelFuture'],
}

const CHECK_ICON = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 6.3L5 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function WidgetStepIndicator({ steps, currentStep }: WidgetStepIndicatorProps) {
  return (
    <div className={styles['row']} role="list">
      {steps.map((step, i) => {
        const state = classify(i, currentStep)
        const hasNext = i < steps.length - 1
        const nextState = hasNext ? classify(i + 1, currentStep) : undefined
        const connectorComplete = state === 'past' && nextState === 'past'

        const circleClass = [styles['circle'], CIRCLE_STATE_CLASS[state]]
          .filter(Boolean)
          .join(' ')
        const labelClass = [styles['label'], LABEL_STATE_CLASS[state]]
          .filter(Boolean)
          .join(' ')
        const connectorClass = [
          styles['connector'],
          connectorComplete ? styles['connectorComplete'] : undefined,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <Fragment key={`${step}-${i}`}>
            <div className={styles['stepCell']} role="listitem" aria-current={state === 'active' ? 'step' : undefined}>
              <div className={circleClass}>
                {state === 'past' ? (
                  CHECK_ICON
                ) : (
                  <span className={styles['num']}>{i + 1}</span>
                )}
              </div>
              <span className={labelClass}>{step}</span>
            </div>
            {hasNext && <div className={connectorClass} aria-hidden="true" />}
          </Fragment>
        )
      })}
    </div>
  )
}
