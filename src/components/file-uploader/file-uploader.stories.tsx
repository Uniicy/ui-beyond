import type { Meta, StoryObj } from '@storybook/react'
import { FileUploader, type UploadedFile } from './file-uploader'

const noFiles: UploadedFile[] = []
const uploading: UploadedFile[] = [
  { id: 'f1', name: 'bank_statement_2026.pdf', sizeMb: 2.4, status: 'uploading', progress: 45 },
  { id: 'f2', name: 'selfie_verification.jpg', sizeMb: 1.1, status: 'uploading', progress: 80 },
]
const complete: UploadedFile[] = [
  { id: 'f1', name: 'bank_statement_2026.pdf', sizeMb: 2.4, status: 'complete' },
  { id: 'f2', name: 'selfie_verification.jpg', sizeMb: 1.1, status: 'complete' },
  { id: 'f3', name: 'utility_bill.pdf', sizeMb: 0.8, status: 'complete' },
]
const withError: UploadedFile[] = [
  { id: 'f1', name: 'bank_statement_2026.pdf', sizeMb: 2.4, status: 'complete' },
  { id: 'f2', name: 'corrupted_file.pdf', sizeMb: 12.1, status: 'error', errorMessage: 'File exceeds 10MB limit' },
]
const atMax: UploadedFile[] = Array.from({ length: 5 }, (_, i) => ({ id: `f${i}`, name: `document_${i + 1}.pdf`, sizeMb: 1 + i * 0.5, status: 'complete' as const }))

const meta = { title: 'Components/FileUploader', component: FileUploader, args: { files: noFiles, onFilesChange: () => {}, accept: 'application/pdf,image/*' } } satisfies Meta<typeof FileUploader>
export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}
export const Uploading: Story = { args: { files: uploading } }
export const Complete: Story = { args: { files: complete } }
export const WithError: Story = { args: { files: withError } }
export const AtMaxFiles: Story = { args: { files: atMax } }
