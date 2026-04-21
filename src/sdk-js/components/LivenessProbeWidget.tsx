import { type ReactNode } from 'react'
import { WidgetShell } from './WidgetShell'
import { WidgetStepIndicator } from './WidgetStepIndicator'
import { CameraViewport, type ChallengeDirection } from './CameraViewport'
import styles from './LivenessProbeWidget.module.css'

export type LivenessState =
  | 'instructions'
  | 'searching'
  | 'detected'
  | 'challenge'
  | 'processing'
  | 'passed'
  | 'poor_lighting'
  | 'spoof_detected'
  | 'max_retries'
  | 'timeout'

export interface LivenessConfidence {
  readonly liveness: number
  readonly faceMatch: number
  readonly spoofDetection: number
}

export interface LivenessProbeWidgetProps {
  readonly state: LivenessState
  readonly challengeDirection?: ChallengeDirection
  readonly confidence?: LivenessConfidence
  readonly attemptNumber?: number
  readonly maxAttempts?: number
  readonly onStartCamera?: () => void
  readonly onRetry?: () => void
  readonly onContactSupport?: () => void
  readonly playerEmail?: string
}

/* ── Icons ─────────────────────────────────────────── */

const LIGHT_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M5.6 18.4l1.4-1.4M19.4 5.6l-1.4 1.4M21 12h-2M19.4 18.4l-1.4-1.4M12 19v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const EYE_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const PHONE_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
  </svg>
)

const NO_HAT_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const LOCK_ICON_LG: ReactNode = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const CLOCK_ICON: ReactNode = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#EF4444" />
    <circle cx="24" cy="24" r="16" stroke="#ffffff" strokeWidth="2.4" />
    <path d="M24 14v10l7 5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Constants ─────────────────────────────────────── */

const PREP_INSTRUCTIONS: readonly { icon: ReactNode; text: string }[] = [
  { icon: LIGHT_ICON,  text: 'Find a well-lit area — avoid backlight' },
  { icon: NO_HAT_ICON, text: 'Remove hats, glasses, and face coverings' },
  { icon: PHONE_ICON,  text: 'Hold your phone at eye level' },
  { icon: EYE_ICON,    text: 'Look directly into the camera' },
]

const DEFAULT_CONFIDENCE: LivenessConfidence = {
  liveness: 96,
  faceMatch: 92,
  spoofDetection: 99,
}

const ATTEMPT_FAILURES: readonly { step: string; reason: string }[] = [
  { step: 'Attempt 1', reason: 'Poor lighting — unable to align face' },
  { step: 'Attempt 2', reason: 'Challenge failed — turned the wrong way' },
  { step: 'Attempt 3', reason: 'Session timed out' },
]

/* ── Small reusable bits ───────────────────────────── */

function StatusLine({ tone, text }: { tone: 'grey' | 'green' | 'purple'; text: string }) {
  const dotClass = [
    styles['statusDot'],
    tone === 'grey' ? styles['statusDotGrey'] : undefined,
    tone === 'green' ? styles['statusDotGreen'] : undefined,
    tone === 'purple' ? styles['statusDotPurple'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={styles['statusRow']}>
      <span className={dotClass} aria-hidden="true" />
      <span className={styles['statusText']}>{text}</span>
    </div>
  )
}

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles['confRow']}>
      <div className={styles['confHead']}>
        <span className={styles['confLabel']}>{label}</span>
        <span className={styles['confValue']}>{value}%</span>
      </div>
      <div className={styles['confTrack']}>
        <div
          className={styles['confFill']}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

function AccentBar({ tone }: { tone: 'success' | 'warning' | 'danger' }) {
  const cls = [
    styles['accentBar'],
    tone === 'success' ? styles['accentSuccess'] : undefined,
    tone === 'warning' ? styles['accentWarning'] : undefined,
    tone === 'danger' ? styles['accentDanger'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')
  return <div className={cls} aria-hidden="true" />
}

/* ── Component ─────────────────────────────────────── */

export function LivenessProbeWidget(props: LivenessProbeWidgetProps) {
  const {
    state,
    challengeDirection = 'left',
    confidence,
    attemptNumber = 1,
    maxAttempts = 2,
    onStartCamera,
    onRetry,
    onContactSupport,
    playerEmail,
  } = props

  const stepIndicator = (
    <WidgetStepIndicator steps={['Document', 'Selfie']} currentStep={1} />
  )

  if (state === 'instructions') {
    return (
      <WidgetShell
        title="Liveness check"
        headerRight={stepIndicator}
        footer={
          <button type="button" className={styles['btnPrimary']} onClick={onStartCamera}>
            Open camera
          </button>
        }
      >
        <div className={styles['instructionsBody']}>
          <p className={styles['introCopy']}>
            We need a quick selfie to make sure it's really you. Takes about 15
            seconds.
          </p>
          <ul className={styles['prepList']}>
            {PREP_INSTRUCTIONS.map((p) => (
              <li key={p.text} className={styles['prepItem']}>
                <span className={styles['prepIcon']}>{p.icon}</span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'searching') {
    return (
      <WidgetShell title="Position your face">
        <div className={styles['cameraBody']}>
          <CameraViewport state="searching" width={340} height={360} />
          <StatusLine tone="grey" text="Searching for face…" />
        </div>
      </WidgetShell>
    )
  }

  if (state === 'detected') {
    return (
      <WidgetShell title="Hold still">
        <div className={styles['cameraBody']}>
          <CameraViewport state="detected" showFace width={340} height={360} />
          <StatusLine tone="green" text="Face aligned" />
        </div>
      </WidgetShell>
    )
  }

  if (state === 'challenge') {
    const current = Math.min(attemptNumber, maxAttempts)
    return (
      <WidgetShell title="Follow the instruction">
        <div className={styles['cameraBody']}>
          <CameraViewport
            state="challenge"
            showFace
            challengeDirection={challengeDirection}
            width={340}
            height={360}
          />
          <div className={styles['challengeFoot']}>
            <div className={styles['challengeDots']} aria-hidden="true">
              {Array.from({ length: maxAttempts }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < current
                      ? `${styles['challengeDot']} ${styles['challengeDotActive']}`
                      : styles['challengeDot']
                  }
                />
              ))}
            </div>
            <span className={styles['challengeLabel']}>
              Challenge {current} of {maxAttempts}
            </span>
          </div>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'processing') {
    return (
      <WidgetShell title="Analysing…">
        <div className={styles['cameraBody']}>
          <CameraViewport state="processing" showFace width={340} height={360} />
          <StatusLine tone="purple" text="Processing biometric data — ~10 seconds" />
        </div>
      </WidgetShell>
    )
  }

  if (state === 'passed') {
    const c = confidence ?? DEFAULT_CONFIDENCE
    return (
      <WidgetShell title="Liveness confirmed">
        <AccentBar tone="success" />
        <div className={styles['cameraBody']}>
          <CameraViewport state="passed" showFace width={340} height={260} />
          <div className={styles['confidenceStack']}>
            <ConfidenceBar label="Liveness" value={c.liveness} />
            <ConfidenceBar label="Face match" value={c.faceMatch} />
            <ConfidenceBar label="Spoof detection" value={c.spoofDetection} />
          </div>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'poor_lighting') {
    return (
      <WidgetShell
        title="Lighting issue"
        footer={
          <button type="button" className={styles['btnGhost']} onClick={onRetry}>
            I'm ready — try again
          </button>
        }
      >
        <AccentBar tone="warning" />
        <div className={styles['cameraBody']}>
          <CameraViewport state="failed" showFace width={340} height={300} />
          <div className={styles['warningCard']}>
            <div className={styles['warningTitle']}>Move to better lighting</div>
            <p className={styles['warningCopy']}>
              Your face was too dark to verify. Find a spot facing a window or a
              bright lamp, then try again.
            </p>
          </div>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'spoof_detected') {
    return (
      <WidgetShell
        title="Verification blocked"
        footer={
          <div className={styles['footerStack']}>
            <button type="button" className={styles['btnDanger']} onClick={onRetry}>
              Retry with live camera
            </button>
            <button type="button" className={styles['btnGhost']} onClick={onContactSupport}>
              Contact support
            </button>
          </div>
        }
      >
        <AccentBar tone="danger" />
        <div className={styles['cameraBody']}>
          <CameraViewport state="failed" showFace width={340} height={280} />
          <div className={styles['dangerCard']}>
            <div className={styles['dangerTitle']}>Please use your real face</div>
            <p className={styles['dangerCopy']}>
              We detected a photo, screen, or mask. Liveness checks require a live
              camera feed of your face.
            </p>
          </div>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'max_retries') {
    return (
      <WidgetShell title="Automatic check failed">
        <div className={styles['manualBody']}>
          <div className={styles['iconCircleDanger']}>{LOCK_ICON_LG}</div>
          <div className={styles['manualTitle']}>
            {maxAttempts} attempts failed
          </div>
          <p className={styles['manualCopy']}>
            We couldn't verify you automatically. A human reviewer will take a look
            — this typically completes within 2–4 hours.
          </p>
          <div className={styles['attemptsTable']}>
            <div className={styles['attemptsHead']}>Attempt log</div>
            <ul className={styles['attemptsList']}>
              {ATTEMPT_FAILURES.slice(0, maxAttempts).map((a) => (
                <li key={a.step} className={styles['attemptsRow']}>
                  <span className={styles['attemptStep']}>{a.step}</span>
                  <span className={styles['attemptReason']}>{a.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          {playerEmail !== undefined && (
            <p className={styles['emailNotice']}>
              We'll email{' '}
              <span className={styles['emailValue']}>{playerEmail}</span> when the
              review completes.
            </p>
          )}
        </div>
      </WidgetShell>
    )
  }

  // state === 'timeout'
  return (
    <WidgetShell
      title="Session expired"
      footer={
        <button type="button" className={styles['btnPrimary']} onClick={onStartCamera}>
          Restart verification
        </button>
      }
    >
      <div className={styles['cameraBody']}>
        <div className={styles['clockWrap']}>
          <CameraViewport state="failed" width={340} height={280} />
          <div className={styles['clockOverlay']}>{CLOCK_ICON}</div>
        </div>
        <p className={styles['timeoutCopy']}>
          Your verification window closed after no activity. Start again to pick up
          where you left off.
        </p>
      </div>
    </WidgetShell>
  )
}
