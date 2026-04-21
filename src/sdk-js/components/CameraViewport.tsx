import { type ReactNode } from 'react'
import styles from './CameraViewport.module.css'

export type CameraViewportState =
  | 'searching'
  | 'detected'
  | 'challenge'
  | 'processing'
  | 'passed'
  | 'failed'

export type ChallengeDirection = 'left' | 'right' | 'up'

export interface CameraViewportProps {
  readonly state: CameraViewportState
  readonly challengeDirection?: ChallengeDirection
  readonly instruction?: string
  /**
   * Storybook-only: renders a CSS face silhouette for demonstration.
   * Production consumers attach a live <video> element via their own ref.
   */
  readonly showFace?: boolean
  readonly width?: number
  readonly height?: number
}

const DEFAULT_INSTRUCTION: Record<CameraViewportState, string> = {
  searching: 'Searching for face…',
  detected: 'Hold still',
  challenge: 'Follow the arrow',
  processing: 'Analysing…',
  passed: 'Verified',
  failed: 'Please retry',
}

const OVAL_STATE_CLASS: Record<CameraViewportState, string | undefined> = {
  searching: styles['ovalSearching'],
  detected: styles['ovalDetected'],
  challenge: styles['ovalChallenge'],
  processing: styles['ovalProcessing'],
  passed: styles['ovalPassed'],
  failed: styles['ovalFailed'],
}

const PILL_STATE_CLASS: Record<CameraViewportState, string | undefined> = {
  searching: styles['pillSearching'],
  detected: styles['pillDetected'],
  challenge: styles['pillChallenge'],
  processing: styles['pillProcessing'],
  passed: styles['pillPassed'],
  failed: styles['pillFailed'],
}

const DIR_CLASS: Record<ChallengeDirection, string | undefined> = {
  left: styles['arrowLeft'],
  right: styles['arrowRight'],
  up: styles['arrowUp'],
}

const ARROW: Record<ChallengeDirection, ReactNode> = {
  left: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M10 20 L24 10 L24 16 L32 16 L32 24 L24 24 L24 30 Z" fill="currentColor" />
    </svg>
  ),
  right: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M30 20 L16 10 L16 16 L8 16 L8 24 L16 24 L16 30 Z" fill="currentColor" />
    </svg>
  ),
  up: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 8 L10 22 L16 22 L16 32 L24 32 L24 22 L30 22 Z" fill="currentColor" />
    </svg>
  ),
}

export function CameraViewport({
  state,
  challengeDirection = 'left',
  instruction,
  showFace = false,
  width = 340,
  height = 380,
}: CameraViewportProps) {
  const ovalClass = [styles['oval'], OVAL_STATE_CLASS[state]].filter(Boolean).join(' ')
  const pillClass = [styles['pill'], PILL_STATE_CLASS[state]].filter(Boolean).join(' ')
  const arrowClass = [styles['arrow'], DIR_CLASS[challengeDirection]].filter(Boolean).join(' ')
  const effectiveInstruction = instruction ?? DEFAULT_INSTRUCTION[state]

  return (
    <div className={styles['viewport']} style={{ width, height }}>
      {/* corner guides */}
      <span className={`${styles['corner']} ${styles['cornerTL']}`} aria-hidden="true" />
      <span className={`${styles['corner']} ${styles['cornerTR']}`} aria-hidden="true" />
      <span className={`${styles['corner']} ${styles['cornerBL']}`} aria-hidden="true" />
      <span className={`${styles['corner']} ${styles['cornerBR']}`} aria-hidden="true" />

      {/* optional face silhouette */}
      {showFace && <div className={styles['face']} aria-hidden="true" />}

      {/* oval guide */}
      <div className={ovalClass} aria-hidden="true" />

      {/* challenge arrow */}
      {state === 'challenge' && (
        <div className={arrowClass} aria-hidden="true">
          {ARROW[challengeDirection]}
        </div>
      )}

      {/* scan-line + overlay for processing */}
      {state === 'processing' && (
        <>
          <div className={styles['scanLine']} aria-hidden="true" />
          <div className={styles['processingOverlay']}>
            <div className={styles['processingSpinner']} />
            <div className={styles['processingText']}>Verifying…</div>
          </div>
        </>
      )}

      {/* passed tick overlay */}
      {state === 'passed' && (
        <div className={styles['passedOverlay']} aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" fill="#10B981" />
            <path d="M15 26 L23 34 L38 18" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* instruction pill */}
      <div className={pillClass}>{effectiveInstruction}</div>
    </div>
  )
}
