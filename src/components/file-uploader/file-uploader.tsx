import { useState, useRef, useCallback, type DragEvent } from 'react'
import { IconButton } from '../icon-button'
import { ProgressBar } from '../progress-bar'
import styles from './file-uploader.module.css'

export interface UploadedFile {
  readonly id: string
  readonly name: string
  readonly sizeMb: number
  readonly status: 'pending' | 'uploading' | 'complete' | 'error'
  readonly progress?: number
  readonly errorMessage?: string
}

export interface FileUploaderProps {
  readonly accept?: string
  readonly maxSizeMb?: number
  readonly maxFiles?: number
  readonly files: ReadonlyArray<UploadedFile>
  readonly onFilesChange: (files: UploadedFile[]) => void
  readonly uploading?: boolean
  readonly className?: string
}

const UploadIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M12 3v10M8 7l4-4 4 4" /></svg>)
const RemoveIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>)

function fileTypeIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return '\u{1F4C4}'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '\u{1F5BC}'
  return '\u{1F4CE}'
}

export function FileUploader({ accept, maxSizeMb = 10, maxFiles = 5, files, onFilesChange, uploading = false, className }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFiles = files.length > 0
  const atLimit = files.length >= maxFiles

  const handleRemove = useCallback((id: string) => {
    onFilesChange([...files.filter((f) => f.id !== id)])
  }, [files, onFilesChange])

  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); setDragOver(true) }, [])
  const handleDragLeave = useCallback(() => setDragOver(false), [])
  const handleDrop = useCallback((e: DragEvent) => { e.preventDefault(); setDragOver(false) }, [])

  const zoneCls = [
    styles['zone'],
    hasFiles ? styles['zoneCompact'] : undefined,
    dragOver ? styles['zoneDragOver'] : undefined,
  ].filter(Boolean).join(' ')

  const wrapperCls = [styles['wrapper'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperCls}>
      {!atLimit && (
        <div className={zoneCls} onClick={() => inputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <input ref={inputRef} type="file" className={styles['hiddenInput']} accept={accept} multiple />
          <span className={styles['zoneIcon']}>{UploadIcon}</span>
          <span className={styles['zoneText']}>Drag files here or click to browse</span>
          <span className={styles['zoneHint']}>{accept ?? 'Any file type'} {'\u00b7'} Max {maxSizeMb}MB per file</span>
        </div>
      )}

      {atLimit && <span className={styles['limitWarning']}>Maximum {maxFiles} files reached</span>}

      {hasFiles && (
        <div className={styles['fileList']}>
          {files.map((f) => (
            <div key={f.id} className={styles['fileRow']}>
              <span className={styles['fileIcon']}>{fileTypeIcon(f.name)}</span>
              <div className={styles['fileInfo']}>
                <span className={styles['fileName']}>{f.name}</span>
                <span className={styles['fileSize']}>{f.sizeMb.toFixed(1)} MB</span>
                {f.status === 'error' && f.errorMessage !== undefined && (
                  <span className={styles['fileError']}>{f.errorMessage}<button type="button" className={styles['retryLink']}>Retry</button></span>
                )}
              </div>
              {f.status === 'uploading' && f.progress !== undefined && (
                <div className={styles['progressBar']}><ProgressBar value={f.progress} height="xs" intent="primary" rounded /></div>
              )}
              <span className={styles['statusIcon']}>
                {f.status === 'complete' && <span className={styles['statusComplete']}>{'\u2713'}</span>}
                {f.status === 'error' && <span className={styles['statusError']}>{'\u2717'}</span>}
                {f.status === 'uploading' && <svg className={styles['spinner']} width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" /><path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              </span>
              <IconButton icon={RemoveIcon} label="Remove" size="sm" variant="ghost" onClick={() => handleRemove(f.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
