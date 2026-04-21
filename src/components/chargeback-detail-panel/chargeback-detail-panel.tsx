import { useState, useCallback } from 'react'
import { Button } from '../button'
import { FileUploader, type UploadedFile } from '../file-uploader'
import { SlaCountdown } from '../sla-countdown'
import { SlideInPanel } from '../slide-in-panel'
import { TransactionSummaryTable, type Transaction } from '../transaction-summary-table'
import type { ChargebackEntry } from '../chargeback-row'
import styles from './chargeback-detail-panel.module.css'

export interface ChargebackDetailPanelProps {
  readonly chargeback: ChargebackEntry
  readonly originalTransaction: Transaction
  readonly files: ReadonlyArray<UploadedFile>
  readonly onFilesChange: (files: UploadedFile[]) => void
  readonly uploading?: boolean
  readonly onDispute: (id: string, note: string) => void
  readonly onAccept: (id: string) => void
  readonly onSubmitEvidence: (id: string) => void
  readonly open: boolean
  readonly onClose: () => void
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', USD: '$' }

function formatAmount(minor: number, currency: string): string {
  const major = (minor / 100).toLocaleString('en', { minimumFractionDigits: 2 })
  const sym = CURRENCY_SYMBOLS[currency]
  return sym !== undefined ? `${sym}${major}` : `${currency} ${major}`
}

export function ChargebackDetailPanel({
  chargeback: cb,
  originalTransaction,
  files,
  onFilesChange,
  uploading = false,
  onDispute,
  onAccept,
  onSubmitEvidence,
  open,
  onClose,
}: ChargebackDetailPanelProps) {
  const [note, setNote] = useState('')
  const [confirmAccept, setConfirmAccept] = useState(false)

  const hasFiles = files.length > 0

  const handleAccept = useCallback(() => {
    if (!confirmAccept) {
      setConfirmAccept(true)
      return
    }
    onAccept(cb.id)
    setConfirmAccept(false)
  }, [confirmAccept, cb.id, onAccept])

  const handleSubmit = useCallback(() => {
    if (!hasFiles) return
    if (note !== '') {
      onDispute(cb.id, note)
    }
    onSubmitEvidence(cb.id)
  }, [hasFiles, cb.id, note, onDispute, onSubmitEvidence])

  const footer = (
    <div className={styles['footer']}>
      <div className={styles['footerLeft']}>
        {!confirmAccept ? (
          <Button variant="ghost" size="sm" className={styles['dangerGhost']} onClick={handleAccept}>
            Accept chargeback
          </Button>
        ) : (
          <div className={styles['confirmBlock']}>
            <span className={styles['confirmWarning']}>
              {formatAmount(cb.originalAmount, cb.currency)} will be refunded to cardholder
            </span>
            <div className={styles['confirmActions']}>
              <Button variant="danger" size="sm" onClick={handleAccept}>Confirm accept</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmAccept(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
      <Button variant="primary" size="sm" disabled={!hasFiles} onClick={handleSubmit}>
        Submit evidence &amp; dispute
      </Button>
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={onClose} title={`Chargeback \u2014 ${cb.reasonCode}`} footer={footer}>
      <div className={styles['body']}>
        {/* 1. Chargeback header card */}
        <div className={styles['headerCard']}>
          <div className={styles['headerRow']}>
            <span className={styles['reasonCode']}>{cb.reasonCode}</span>
            <span className={styles['reasonLabel']}>{cb.reasonLabel}</span>
          </div>
          <span className={styles['providerRef']}>Ref: {cb.providerRef}</span>
        </div>

        {/* 2. Original transaction */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Original transaction</div>
          <TransactionSummaryTable
            transactions={[originalTransaction]}
            currency={originalTransaction.currency}
            maxRows={1}
          />
        </div>

        {/* 3. Evidence deadline */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Evidence deadline</div>
          <SlaCountdown
            createdAt={cb.evidenceCreatedAt}
            deadline={cb.evidenceDeadline}
            mode="full"
          />
        </div>

        {/* 4. Evidence upload */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Evidence files</div>
          <FileUploader
            accept="application/pdf,image/*"
            maxFiles={5}
            files={[...files]}
            onFilesChange={onFilesChange}
            uploading={uploading}
          />
        </div>

        {/* 5. Response note */}
        <div className={styles['section']}>
          <div className={styles['sectionTitle']}>Dispute narrative</div>
          <textarea
            className={styles['textarea']}
            placeholder="Add dispute narrative\u2026"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </SlideInPanel>
  )
}
