import { useState, type ReactNode } from 'react'
import { WidgetShell } from './WidgetShell'
import { WidgetStepIndicator } from './WidgetStepIndicator'
import { WidgetUploadZone } from './WidgetUploadZone'
import styles from './KycUploadWidget.module.css'

export type KycUploadState =
  | 'prompt'
  | 'upload'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'manual_review'

export type KycDocumentType = 'passport' | 'id_card' | 'driving_licence'

export interface KycUploadWidgetProps {
  readonly state: KycUploadState
  readonly documentType?: KycDocumentType
  readonly onDocumentTypeChange?: (type: string) => void
  readonly onStart?: () => void
  readonly onFileUpload?: (file: File) => void
  readonly onRetry?: () => void
  readonly onContactSupport?: () => void
  readonly rejectionReason?: string
  readonly playerEmail?: string
  readonly providerName?: string
}

const DOC_LABEL: Record<KycDocumentType, string> = {
  passport: 'Passport',
  id_card: 'ID card',
  driving_licence: "Driver's licence",
}

const DOC_ORDER: readonly KycDocumentType[] = ['passport', 'id_card', 'driving_licence']

/* ── Icons ────────────────────────────────────────────── */

const ID_CARD_ICON: ReactNode = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 16.5c.8-1.6 2.1-2.3 3.5-2.3s2.7.7 3.5 2.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M14 10h5M14 13h4M14 16h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const CHECK_LARGE_ICON: ReactNode = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12.5L10 17.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const X_ICON: ReactNode = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

const HOURGLASS_ICON: ReactNode = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 3h10M7 21h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M7 3c0 4 3 5 5 7s5 3 5 7M17 3c0 4-3 5-5 7s-5 3-5 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CHECK_SMALL_ICON: ReactNode = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6.3L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DOC_PILL_ICONS: Record<KycDocumentType, ReactNode> = {
  passport: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  id_card: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.5 10.5h5M13.5 13.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  driving_licence: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9h4M7 12h4M14 9h3M14 12h3M7 15h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
}

const PROMPT_CHECKLIST: readonly string[] = [
  'Takes 2–5 minutes',
  'Passport, ID card, or driver\u2019s licence',
  'Selfie or liveness check',
  'Your data is encrypted and secure',
]

type ProgressItem = { readonly label: string; readonly status: 'complete' | 'active' | 'pending' }

const PROCESSING_ITEMS: readonly ProgressItem[] = [
  { label: 'Document uploaded', status: 'complete' },
  { label: 'Extracting document data', status: 'complete' },
  { label: 'Verifying authenticity', status: 'active' },
  { label: 'Cross-checking sanctions lists', status: 'pending' },
]

const APPROVED_DETAILS: readonly { label: string; value: string; accent?: boolean }[] = [
  { label: 'Document', value: 'Passport' },
  { label: 'Verified', value: 'Today' },
  { label: 'Valid until', value: 'Jun 2028' },
  { label: 'Status', value: 'Full access', accent: true },
]

/* ── Widget ───────────────────────────────────────────── */

export function KycUploadWidget(props: KycUploadWidgetProps) {
  const {
    state,
    documentType,
    onDocumentTypeChange,
    onStart,
    onFileUpload,
    onRetry,
    onContactSupport,
    rejectionReason,
    playerEmail,
    providerName,
  } = props

  void providerName

  const [internalDocType, setInternalDocType] = useState<KycDocumentType>(
    documentType ?? 'passport',
  )
  const [file, setFile] = useState<File | null>(null)

  const activeDoc: KycDocumentType = documentType ?? internalDocType

  function handleDocChange(next: KycDocumentType) {
    if (documentType === undefined) setInternalDocType(next)
    onDocumentTypeChange?.(next)
  }

  function handleContinue() {
    if (file !== null) onFileUpload?.(file)
  }

  if (state === 'prompt') {
    return (
      <WidgetShell
        title="Verify your identity"
        footer={
          <button type="button" className={styles['btnPrimary']} onClick={onStart}>
            Start verification
          </button>
        }
      >
        <div className={styles['promptBody']}>
          <div className={`${styles['iconSquare']} ${styles['iconSquarePrimary']}`}>
            {ID_CARD_ICON}
          </div>
          <div className={styles['promptTitle']}>Identity verification required</div>
          <p className={styles['promptDesc']}>
            To comply with regulatory requirements, we need to confirm your identity
            before you can deposit and withdraw funds.
          </p>
          <ul className={styles['checklist']}>
            {PROMPT_CHECKLIST.map((item) => (
              <li key={item} className={styles['checklistItem']}>
                <span className={styles['checklistCheck']}>{CHECK_SMALL_ICON}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'upload') {
    return (
      <WidgetShell
        title="Upload your document"
        headerRight={<WidgetStepIndicator steps={['Document', 'Selfie']} currentStep={0} />}
        footer={
          <div className={styles['footerRow']}>
            <button type="button" className={styles['btnGhost']}>
              Back
            </button>
            <button
              type="button"
              className={styles['btnPrimary']}
              onClick={handleContinue}
              disabled={file === null}
            >
              Continue
            </button>
          </div>
        }
      >
        <div className={styles['uploadBody']}>
          <div className={styles['docTypeLabel']}>Document type</div>
          <div className={styles['pillRow']} role="radiogroup" aria-label="Document type">
            {DOC_ORDER.map((type) => {
              const selected = activeDoc === type
              const pillClass = [
                styles['docPill'],
                selected ? styles['docPillSelected'] : undefined,
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={pillClass}
                  onClick={() => handleDocChange(type)}
                >
                  <span className={styles['docPillIcon']}>{DOC_PILL_ICONS[type]}</span>
                  <span>{DOC_LABEL[type]}</span>
                </button>
              )
            })}
          </div>
          <WidgetUploadZone file={file} onFileChange={setFile} />
        </div>
      </WidgetShell>
    )
  }

  if (state === 'processing') {
    return (
      <WidgetShell title="Checking your document">
        <div className={styles['processingBody']}>
          <div className={styles['spinnerLarge']} role="status" aria-label="Verifying" />
          <div className={styles['processingTitle']}>Verifying your identity</div>
          <p className={styles['processingCopy']}>
            This usually takes a few seconds. You can leave this page — we'll
            email you when it's done.
          </p>
          <ul className={styles['progressList']}>
            {PROCESSING_ITEMS.map((item) => {
              const indicator =
                item.status === 'complete' ? (
                  <span
                    className={`${styles['progressIndicator']} ${styles['progressComplete']}`}
                  >
                    {CHECK_SMALL_ICON}
                  </span>
                ) : item.status === 'active' ? (
                  <span
                    className={`${styles['progressIndicator']} ${styles['progressActive']}`}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={`${styles['progressIndicator']} ${styles['progressPending']}`}
                    aria-hidden="true"
                  />
                )
              const textClass = [
                styles['progressText'],
                item.status === 'pending' ? styles['progressTextPending'] : undefined,
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <li key={item.label} className={styles['progressItem']}>
                  {indicator}
                  <span className={textClass}>{item.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'approved') {
    return (
      <WidgetShell
        title="Verification complete"
        footer={
          <button type="button" className={styles['btnSuccess']}>
            Continue to deposit
          </button>
        }
      >
        <div className={styles['approvedBody']}>
          <div className={`${styles['iconCircle']} ${styles['iconCircleSuccess']}`}>
            {CHECK_LARGE_ICON}
          </div>
          <div className={styles['approvedTitle']}>Identity verified</div>
          <dl className={styles['detailGrid']}>
            {APPROVED_DETAILS.map((d) => (
              <div key={d.label} className={styles['detailPair']}>
                <dt className={styles['detailLabel']}>{d.label}</dt>
                <dd
                  className={
                    d.accent === true
                      ? `${styles['detailValue']} ${styles['detailValueAccent']}`
                      : styles['detailValue']
                  }
                >
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </WidgetShell>
    )
  }

  if (state === 'rejected') {
    const reason =
      rejectionReason ?? 'The photo was blurry. Please retake in good lighting.'
    return (
      <WidgetShell
        title="Verification failed"
        footer={
          <div className={styles['footerStack']}>
            <button type="button" className={styles['btnPrimary']} onClick={onRetry}>
              Try again
            </button>
            <button type="button" className={styles['btnGhost']}>
              Upload different document
            </button>
            <button
              type="button"
              className={styles['btnLink']}
              onClick={onContactSupport}
            >
              Contact support
            </button>
          </div>
        }
      >
        <div className={styles['rejectedBody']}>
          <div className={`${styles['iconCircle']} ${styles['iconCircleDanger']}`}>
            {X_ICON}
          </div>
          <div className={styles['rejectedTitle']}>
            We couldn't verify your document
          </div>
          <div className={styles['reasonBlock']}>{reason}</div>
        </div>
      </WidgetShell>
    )
  }

  // state === 'manual_review'
  return (
    <WidgetShell title="Under review">
      <div className={styles['manualBody']}>
        <div className={`${styles['iconCircle']} ${styles['iconCircleWarning']}`}>
          {HOURGLASS_ICON}
        </div>
        <div className={styles['manualTitle']}>Manual review in progress</div>
        <p className={styles['manualCopy']}>Typically 2–4 hours</p>
        <div className={styles['amberCard']}>
          <div className={styles['amberTitle']}>Restricted access</div>
          <p className={styles['amberCopy']}>
            Your account has limited functionality until verification completes. You
            can browse, but deposits and withdrawals are paused.
          </p>
        </div>
        {playerEmail !== undefined && (
          <p className={styles['emailNotice']}>
            We'll email <span className={styles['emailValue']}>{playerEmail}</span>{' '}
            when the review completes.
          </p>
        )}
      </div>
    </WidgetShell>
  )
}
