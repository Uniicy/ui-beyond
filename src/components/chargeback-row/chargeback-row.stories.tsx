import type { Meta, StoryObj } from '@storybook/react'
import { ChargebackRow, type ChargebackEntry } from './chargeback-row'

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function hoursFromNow(h: number): string { return new Date(Date.now() + h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const openNoEvidence: ChargebackEntry = { id: 'cb-1', player: { id: 'p1', name: 'Thomas Huber' }, originalAmount: 20000, currency: 'EUR', provider: 'trustly', providerRef: 'TRS-88291', reasonCode: '4853', reasonLabel: 'Cardholder dispute', evidenceDeadline: hoursFromNow(48), evidenceCreatedAt: hoursAgo(24), evidenceUploaded: 0, evidenceRequired: 3, status: 'open', assignedAgent: { id: 'a-1', name: 'Sarah Klein' } }
const openPartial: ChargebackEntry = { ...openNoEvidence, id: 'cb-2', player: { id: 'p2', name: 'Anna Fischer' }, evidenceUploaded: 1, evidenceDeadline: hoursFromNow(12), reasonCode: '4837', reasonLabel: 'No cardholder authorisation', provider: 'nuvei', providerRef: 'NUV-44102' }
const openComplete: ChargebackEntry = { ...openNoEvidence, id: 'cb-3', player: { id: 'p3', name: 'Klaus Wagner' }, evidenceUploaded: 3, status: 'disputed', reasonCode: '4853', reasonLabel: 'Cardholder dispute', provider: 'paysafe', providerRef: 'PSF-55008' }
const accepted: ChargebackEntry = { ...openNoEvidence, id: 'cb-4', player: { id: 'p4', name: 'Lisa Bauer' }, status: 'accepted', evidenceUploaded: 0, evidenceDeadline: daysAgo(2), evidenceCreatedAt: daysAgo(5), provider: 'trustly', providerRef: 'TRS-66119' }
const disputed: ChargebackEntry = { ...openNoEvidence, id: 'cb-5', player: { id: 'p5', name: 'Markus Weber' }, status: 'disputed', evidenceUploaded: 3, provider: 'nuvei', providerRef: 'NUV-77230', assignedAgent: { id: 'a-2', name: 'Max Mustermann' } }

const meta = { title: 'Components/ChargebackRow', component: ChargebackRow, args: { cb: openNoEvidence, onSelect: () => {}, onClick: () => {} } } satisfies Meta<typeof ChargebackRow>
export default meta
type Story = StoryObj<typeof meta>

export const OpenNoEvidence: Story = {}
export const OpenPartialEvidence: Story = { args: { cb: openPartial } }
export const OpenAllEvidence: Story = { args: { cb: openComplete } }
export const Accepted: Story = { args: { cb: accepted } }
export const Disputed: Story = { args: { cb: disputed } }
export const Table: Story = { render: () => (<div>{[openNoEvidence, openPartial, openComplete, accepted, disputed].map((c) => <ChargebackRow key={c.id} cb={c} onSelect={() => {}} onClick={() => {}} />)}</div>), args: { cb: openNoEvidence } }
