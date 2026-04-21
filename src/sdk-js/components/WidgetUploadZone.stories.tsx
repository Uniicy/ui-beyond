import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { WidgetUploadZone } from './WidgetUploadZone'

const noop = (): void => {}

const meta = {
  title: 'SDK/WidgetUploadZone',
  component: WidgetUploadZone,
  parameters: {
    layout: 'centered',
  },
  args: {
    file: null,
    onFileChange: noop,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 368,
          padding: 16,
          background: 'var(--sdk-bg)',
          borderRadius: 14,
          fontFamily: 'var(--sdk-font)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WidgetUploadZone>

export default meta
type Story = StoryObj<typeof meta>

function mockFile(name: string, type: string, sizeBytes: number): File {
  const blob = new Blob([new Uint8Array(Math.min(sizeBytes, 1024))], { type })
  const f = new File([blob], name, { type })
  Object.defineProperty(f, 'size', { value: sizeBytes })
  return f
}

function Harness(props: {
  initialFile?: File | null
  uploading?: boolean
  forceDragOver?: boolean
  forceError?: string | null
  maxSizeMb?: number
}) {
  const [file, setFile] = useState<File | null>(props.initialFile ?? null)
  return (
    <WidgetUploadZone
      file={file}
      onFileChange={setFile}
      {...(props.uploading !== undefined ? { uploading: props.uploading } : {})}
      {...(props.forceDragOver !== undefined ? { forceDragOver: props.forceDragOver } : {})}
      {...(props.forceError !== undefined ? { forceError: props.forceError } : {})}
      {...(props.maxSizeMb !== undefined ? { maxSizeMb: props.maxSizeMb } : {})}
    />
  )
}

export const Idle: Story = {
  render: () => <Harness />,
}

export const DragOver: Story = {
  name: 'Drag over',
  render: () => <Harness forceDragOver />,
}

export const FileSelectedPDF: Story = {
  name: 'File selected PDF',
  render: () => (
    <Harness
      initialFile={mockFile('passport_scan.pdf', 'application/pdf', 1_200_000)}
    />
  ),
}

export const FileSelectedImage: Story = {
  name: 'File selected image',
  render: () => (
    <Harness initialFile={mockFile('id_card.jpg', 'image/jpeg', 850_000)} />
  ),
}

export const Uploading: Story = {
  render: () => (
    <Harness
      initialFile={mockFile('passport_scan.pdf', 'application/pdf', 1_200_000)}
      uploading
    />
  ),
}

export const ErrorTooLarge: Story = {
  name: 'Error — file too large',
  render: () => <Harness forceError="File exceeds 10MB limit" maxSizeMb={10} />,
}
