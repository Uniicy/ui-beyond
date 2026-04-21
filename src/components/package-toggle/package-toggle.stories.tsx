import type { Meta, StoryObj } from '@storybook/react'
import { PackageToggle, type Package } from './package-toggle'

const kycPkg: Package = { id: 'pkg-kyc', module: 'kyc', active: true, tier: 'growth', usage: [{ label: 'Verifications this month', current: 490, included: 1000, unit: 'verifications' }, { label: 'Registered players', current: 12847, included: null, unit: 'players' }], activeMarkets: ['de', 'mu'] }
const amlPkg: Package = { id: 'pkg-aml', module: 'aml', active: true, tier: 'growth', usage: [{ label: 'Alerts this month', current: 72, included: 100, unit: 'alerts' }], activeMarkets: ['de'] }
const rgPkg: Package = { id: 'pkg-rg', module: 'rg', active: false, tier: 'starter', usage: [], activeMarkets: [] }
const pspPkg: Package = { id: 'pkg-psp', module: 'psp', active: true, tier: 'growth', usage: [{ label: 'Transactions this month', current: 8900, included: 10000, unit: 'transactions' }], activeMarkets: ['de'] }
const auditPkg: Package = { id: 'pkg-audit', module: 'audit', active: true, tier: 'enterprise', usage: [{ label: 'Events stored', current: 2400000, included: null, unit: 'events' }, { label: 'Reports generated', current: 12, included: null, unit: 'reports' }], activeMarkets: ['de', 'mu', 'nl', 'gb'] }
const notifyPkg: Package = { id: 'pkg-notify', module: 'notify', active: true, tier: 'growth', usage: [{ label: 'Deliveries this month', current: 8442, included: 50000, unit: 'deliveries' }], activeMarkets: ['de', 'mu'] }

const meta = { title: 'Components/PackageToggle', component: PackageToggle, args: { pkg: kycPkg, onToggle: () => {} } } satisfies Meta<typeof PackageToggle>
export default meta; type Story = StoryObj<typeof meta>

export const KycActive: Story = {}
export const AmlWarning: Story = { args: { pkg: amlPkg } }
export const RgInactive: Story = { args: { pkg: rgPkg } }
export const PspNearLimit: Story = { args: { pkg: pspPkg } }
export const EnterpriseUnlimited: Story = { args: { pkg: auditPkg } }

export const FullGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
      {[kycPkg, amlPkg, rgPkg, pspPkg, auditPkg, notifyPkg].map((p) => <PackageToggle key={p.id} pkg={p} onToggle={() => {}} />)}
    </div>
  ),
  args: { pkg: kycPkg },
}
