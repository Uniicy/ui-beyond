import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChargebackDetailPanel } from './chargeback-detail-panel'
import type { ChargebackEntry } from '../chargeback-row'
import type { Transaction } from '../transaction-summary-table'
import type { UploadedFile } from '../file-uploader'

const cb: ChargebackEntry = {
  id: 'cb-401',
  player: { id: 'PLR-29481', name: 'Martin Richter' },
  originalAmount: 15000,
  currency: 'EUR',
  provider: 'nuvei',
  providerRef: 'NUV-77120-AB',
  reasonCode: '4853',
  reasonLabel: 'Cardholder disputes quality of goods/services',
  evidenceDeadline: new Date(Date.now() + 5 * 86_400_000).toISOString(),
  evidenceCreatedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  evidenceUploaded: 2,
  evidenceRequired: 3,
  status: 'open',
}

const originalTx: Transaction = {
  id: 'tx-orig-401',
  occurredAt: new Date(Date.now() - 15 * 86_400_000).toISOString(),
  type: 'deposit',
  amount: 15000,
  currency: 'EUR',
  provider: 'nuvei',
  balanceAfter: 22300,
}

const uploadedFiles: UploadedFile[] = [
  { id: 'f1', name: 'deposit-confirmation.pdf', sizeMb: 1.2, status: 'complete' },
  { id: 'f2', name: 'session-log-screenshot.png', sizeMb: 0.8, status: 'complete' },
]

function Wrapper(props: React.ComponentProps<typeof ChargebackDetailPanel>) {
  const [files, setFiles] = useState<UploadedFile[]>([...props.files])
  return <ChargebackDetailPanel {...props} files={files} onFilesChange={setFiles} />
}

const meta = {
  title: 'Components/ChargebackDetailPanel',
  component: ChargebackDetailPanel,
  render: (args) => <Wrapper {...args} />,
  args: {
    chargeback: cb,
    originalTransaction: originalTx,
    files: uploadedFiles,
    onFilesChange: () => {},
    onDispute: () => {},
    onAccept: () => {},
    onSubmitEvidence: () => {},
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof ChargebackDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

export const OpenWithFiles: Story = {}

export const AcceptConfirmation: Story = {
  name: 'Accept confirmation visible',
}
