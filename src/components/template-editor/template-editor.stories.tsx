import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TemplateEditor, type LocaleTemplate, type TemplateNode } from './template-editor'

const locales = ['de-DE', 'en-GB', 'fr-FR', 'nl-NL']

const blankValue: Record<string, LocaleTemplate> = {
  'de-DE': { subject: '', body: [] },
  'en-GB': { subject: '', body: [] },
  'fr-FR': { subject: '', body: [] },
  'nl-NL': { subject: '', body: [] },
}

const withVars: Record<string, LocaleTemplate> = {
  'de-DE': {
    subject: 'KYC Verification Result',
    body: [
      { type: 'text', content: 'Dear ' },
      { type: 'variable', key: 'player.name' },
      { type: 'text', content: ', your ' },
      { type: 'variable', key: 'kyc.document_type' },
      { type: 'text', content: ' verification was ' },
      { type: 'variable', key: 'kyc.status' },
      { type: 'text', content: '.' },
    ],
  },
  'en-GB': { subject: '', body: [] },
  'fr-FR': { subject: '', body: [] },
  'nl-NL': { subject: '', body: [] },
}

const meta = {
  title: 'Components/TemplateEditor',
  component: TemplateEditor,
  args: {
    templateId: 'tpl-001', templateName: 'KYC Verification Result', locales,
    value: blankValue, onChange: () => {}, onSave: async () => { await new Promise((r) => setTimeout(r, 1000)) }, isDirty: false,
  },
} satisfies Meta<typeof TemplateEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Blank: Story = {}

export const WithVariables: Story = {
  args: { value: withVars, isDirty: false },
}

export const IsDirty: Story = {
  args: { value: withVars, isDirty: true },
}

export const LocaleSwitching: Story = {
  args: { value: withVars },
  render: (args) => {
    const [val, setVal] = useState<Record<string, LocaleTemplate>>({ ...withVars })
    return <TemplateEditor {...args} value={val} onChange={(loc, tpl) => setVal((v) => ({ ...v, [loc]: tpl }))} isDirty />
  },
}

export const PreviewOpen: Story = {
  args: { value: withVars },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 300))
    const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Preview'))
    btn?.click()
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState<Record<string, LocaleTemplate>>({ ...withVars })
    const [dirty, setDirty] = useState(false)
    return (
      <TemplateEditor
        {...args}
        value={val}
        onChange={(loc, tpl) => { setVal((v) => ({ ...v, [loc]: tpl })); setDirty(true) }}
        onSave={async () => { await new Promise((r) => setTimeout(r, 1000)); setDirty(false) }}
        isDirty={dirty}
      />
    )
  },
}
