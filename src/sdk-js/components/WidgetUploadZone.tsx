import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import styles from './WidgetUploadZone.module.css'

export interface WidgetUploadZoneProps {
  readonly accept?: string
  readonly maxSizeMb?: number
  readonly label?: string
  readonly hint?: string
  readonly file: File | null
  readonly onFileChange: (file: File | null) => void
  readonly uploading?: boolean
  /**
   * Storybook-only visual override. Forces drag-over styling without
   * requiring a real drag interaction. Not intended for production use.
   */
  readonly forceDragOver?: boolean
  /**
   * Storybook-only visual override. Forces the error state with the given
   * message. Not intended for production use.
   */
  readonly forceError?: string | null
}

type ZoneState = 'idle' | 'dragOver' | 'selected' | 'uploading' | 'error'

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function truncateName(name: string, max: number): string {
  if (name.length <= max) return name
  return `${name.slice(0, max - 1)}…`
}

const TRAY_ICON: ReactNode = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 14v3a2 2 0 002 2h12a2 2 0 002-2v-3M12 15V4M7 8l5-4 5 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PDF_ICON: ReactNode = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <text
      x="12"
      y="17.5"
      textAnchor="middle"
      fontSize="5"
      fontWeight="700"
      fill="currentColor"
      fontFamily="system-ui, sans-serif"
    >
      PDF
    </text>
  </svg>
)

const IMAGE_ICON: ReactNode = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M21 15l-4-4-7 7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CAMERA_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const WARNING_ICON: ReactNode = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l10 18H2L12 3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 10v5M12 18v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const REMOVE_ICON: ReactNode = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export function WidgetUploadZone({
  accept,
  maxSizeMb = 10,
  label = 'Drag your document here',
  hint = 'JPG, PNG or PDF · max 10MB',
  file,
  onFileChange,
  uploading = false,
  forceDragOver = false,
  forceError = null,
}: WidgetUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  const error = forceError ?? internalError
  const maxBytes = maxSizeMb * 1024 * 1024

  function applyFile(next: File | null) {
    if (next === null) {
      setInternalError(null)
      onFileChange(null)
      return
    }
    if (next.size > maxBytes) {
      setInternalError(`File exceeds ${maxSizeMb}MB limit`)
      onFileChange(null)
      return
    }
    setInternalError(null)
    onFileChange(next)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null
    applyFile(next)
    e.target.value = ''
  }

  function handleClick() {
    if (uploading) return
    inputRef.current?.click()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (uploading) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (uploading) return
    setIsDragOver(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    if (uploading) return
    const next = e.dataTransfer.files?.[0] ?? null
    applyFile(next)
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation()
    applyFile(null)
  }

  function handleCamera() {
    const mock = new File(['mock-camera-capture'], 'camera_capture.jpg', { type: 'image/jpeg' })
    applyFile(mock)
  }

  const showDragOver = isDragOver || forceDragOver
  const hasError = error !== null
  const hasFile = file !== null && !hasError

  const zoneState: ZoneState = hasError
    ? 'error'
    : hasFile && uploading
    ? 'uploading'
    : hasFile
    ? 'selected'
    : showDragOver
    ? 'dragOver'
    : 'idle'

  const STATE_CLASS: Record<ZoneState, string | undefined> = {
    idle: styles['idle'],
    dragOver: styles['dragOver'],
    selected: styles['selected'],
    uploading: styles['uploading'],
    error: styles['error'],
  }

  const zoneClass = [styles['zone'], STATE_CLASS[zoneState]].filter(Boolean).join(' ')
  const showCamera = zoneState !== 'uploading'

  return (
    <div className={styles['wrapper']}>
      <input
        ref={inputRef}
        type="file"
        className={styles['input']}
        onChange={handleInputChange}
        tabIndex={-1}
        aria-hidden="true"
        {...(accept !== undefined ? { accept } : {})}
      />
      <div
        className={zoneClass}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={hasFile && file !== null ? `Selected file ${file.name}` : label}
      >
        {zoneState === 'error' && (
          <div className={styles['errorRow']}>
            <span className={styles['errorIcon']}>{WARNING_ICON}</span>
            <div className={styles['errorText']}>
              <div className={styles['errorTitle']}>{error}</div>
              <div className={styles['errorHint']}>Try a smaller file</div>
            </div>
          </div>
        )}

        {(zoneState === 'selected' || zoneState === 'uploading') && file !== null && (
          <div className={styles['fileRow']}>
            <span className={styles['fileIcon']}>
              {file.type === 'application/pdf' ? PDF_ICON : IMAGE_ICON}
            </span>
            <span className={styles['fileName']} title={file.name}>
              {truncateName(file.name, 30)}
            </span>
            <span className={styles['fileSize']}>{humanSize(file.size)}</span>
            {zoneState === 'uploading' ? (
              <span className={styles['spinner']} aria-label="Uploading" role="status" />
            ) : (
              <button
                type="button"
                className={styles['remove']}
                onClick={handleRemove}
                aria-label="Remove file"
              >
                {REMOVE_ICON}
              </button>
            )}
          </div>
        )}

        {(zoneState === 'idle' || zoneState === 'dragOver') && (
          <div className={styles['idleStack']}>
            <span className={styles['trayIcon']}>{TRAY_ICON}</span>
            <span className={styles['idleLabel']}>{label}</span>
            <span className={styles['idleHint']}>{hint}</span>
          </div>
        )}
      </div>

      {showCamera && (
        <button type="button" className={styles['cameraButton']} onClick={handleCamera}>
          <span className={styles['cameraIcon']}>{CAMERA_ICON}</span>
          <span>Take photo with camera</span>
        </button>
      )}
    </div>
  )
}
