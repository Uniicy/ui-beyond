import type { Meta, StoryObj } from '@storybook/react'
import { ReportCard, type Report } from './report-card'

function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const base: Report = {
  id: 'rpt-1',
  name: 'Monthly AML Activity Report',
  description: 'Summarises all AML alerts, SARs filed, and investigation outcomes for the reporting period.',
  markets: ['de', 'mu'],
  formats: ['pdf', 'csv'],
  lastGeneratedAt: daysAgo(12),
  generationStatus: 'idle',
}

const meta = {
  title: 'Components/ReportCard',
  component: ReportCard,
  args: {
    report: base,
    onGenerate: () => {},
  },
} satisfies Meta<typeof ReportCard>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Generating: Story = {
  args: { report: { ...base, generationStatus: 'generating' } },
}

export const ReadyBothFormats: Story = {
  args: {
    report: {
      ...base,
      generationStatus: 'ready',
      downloadUrls: { pdf: '#pdf', csv: '#csv' },
      expiresAt: hoursFromNow(18),
    },
  },
}

export const ReadyPdfOnly: Story = {
  args: {
    report: {
      ...base,
      formats: ['pdf'],
      generationStatus: 'ready',
      downloadUrls: { pdf: '#pdf' },
      expiresAt: hoursFromNow(6),
    },
  },
}

export const Failed: Story = {
  args: { report: { ...base, generationStatus: 'failed' } },
}

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 960 }}>
      <ReportCard report={base} onGenerate={() => {}} />
      <ReportCard report={{ ...base, id: 'rpt-2', name: 'KYC Verification Summary', description: 'All identity verifications performed, including pass rates and document types.', markets: ['de', 'nl', 'gb'], generationStatus: 'generating' }} onGenerate={() => {}} />
      <ReportCard report={{ ...base, id: 'rpt-3', name: 'CEMS Transaction Report', description: 'Real-time transaction data reported to the Mauritius Revenue Authority.', markets: ['mu'], formats: ['csv'], generationStatus: 'ready', downloadUrls: { csv: '#csv' }, expiresAt: hoursFromNow(22) }} onGenerate={() => {}} />
      <ReportCard report={{ ...base, id: 'rpt-4', name: 'Player Risk Assessment', description: 'Risk scores and RG intervention history per player.', markets: ['de'], generationStatus: 'failed' }} onGenerate={() => {}} />
      <ReportCard report={{ ...base, id: 'rpt-5', name: 'LUGAS Sync Log', description: 'Daily LUGAS synchronisation results including failures and player limit events.', markets: ['de'], formats: ['csv'], lastGeneratedAt: undefined, generationStatus: 'idle' }} onGenerate={() => {}} />
      <ReportCard report={{ ...base, id: 'rpt-6', name: 'Chargeback Analysis', description: 'Chargeback volume, dispute rates, and evidence submission metrics.', markets: ['de', 'mu', 'gb'], generationStatus: 'idle' }} onGenerate={() => {}} />
    </div>
  ),
}
