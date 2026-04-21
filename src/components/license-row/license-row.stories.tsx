import type { Meta, StoryObj } from '@storybook/react'
import { LicenseRow, type License } from './license-row'

const active: License = { id: 'lic-1', market: 'de', licenseNumber: 'GGL-2024-001847', authority: 'GGL', validFrom: '2024-01-01', validTo: '2026-12-31', status: 'active', brandId: 'b-1', brandName: 'Pferdewetten' }
const expiresSoon: License = { id: 'lic-2', market: 'nl', licenseNumber: 'KSA-2023-004201', authority: 'KSA', validFrom: '2023-06-01', validTo: '2026-05-31', status: 'expires_soon', brandId: 'b-1', brandName: 'Pferdewetten' }
const expired: License = { id: 'lic-3', market: 'gb', licenseNumber: 'UKGC-2021-009312', authority: 'UKGC', validFrom: '2021-03-01', validTo: '2024-02-28', status: 'expired', brandId: 'b-1', brandName: 'Pferdewetten' }
const suspended: License = { id: 'lic-4', market: 'mu', licenseNumber: 'GRA-2022-000891', authority: 'GRA', validFrom: '2022-07-01', validTo: '2027-06-30', status: 'suspended', brandId: 'b-1', brandName: 'Pferdewetten' }
const indefinite: License = { id: 'lic-5', market: 'mu', licenseNumber: 'GRA-2020-000102', authority: 'GRA', validFrom: '2020-01-01', validTo: null, status: 'active', brandId: 'b-2', brandName: 'BetBird' }

const meta = { title: 'Components/LicenseRow', component: LicenseRow, args: { license: active, onDeactivate: () => {} } } satisfies Meta<typeof LicenseRow>
export default meta; type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const ExpiresSoon: Story = { args: { license: expiresSoon } }
export const Expired: Story = { args: { license: expired } }
export const Suspended: Story = { args: { license: suspended } }
export const Indefinite: Story = { args: { license: indefinite } }
export const Table: Story = { render: () => (<div>{[active, { ...active, id: 'lic-mu', market: 'mu' as const, licenseNumber: 'GRA-2023-000891', authority: 'GRA', status: 'active' as const }, expiresSoon, expired].map((l) => <LicenseRow key={l.id} license={l} onDeactivate={() => {}} />)}</div>), args: { license: active } }
