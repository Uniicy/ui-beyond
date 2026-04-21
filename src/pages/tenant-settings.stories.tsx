import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { TabBar } from '../components/tab-bar'
import { Button } from '../components/button'
import { Badge } from '../components/badge'
import { Avatar } from '../components/avatar'
import { Surface } from '../components/surface'
import { BrandRow, type Brand } from '../components/brand-row'
import { LicenseRow, type License } from '../components/license-row'
import { PackageToggle, type Package } from '../components/package-toggle'
import { UserRow, type TenantUser } from '../components/user-row'
import { InviteUserPanel } from '../components/invite-user-panel'
import { ApiKeyRow, type ApiKey } from '../components/api-key-row'
import { CreateApiKeyPanel } from '../components/create-api-key-panel'
import type { TableColumn } from '../components/table-header'
import { DataTable } from '../components/data-table'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'

/* helpers */
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }
function daysFromNow(d: number): string { return new Date(Date.now() + d * 86_400_000).toISOString() }

const brands_data = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]
const tenantTabs = [{ value: 'org', label: 'Organisation' }, { value: 'brands', label: 'Brands' }, { value: 'licenses', label: 'Licenses' }, { value: 'packages', label: 'Packages' }, { value: 'users', label: 'Users' }, { value: 'apikeys', label: 'API Keys' }]

/* fixtures */
const brandRows: Brand[] = [
  { id: 'b-1', name: 'Tipico DE', domain: 'tipico.de', locale: 'de-DE', currency: 'EUR', markets: ['de'], playerCount: 12847, status: 'active' },
  { id: 'b-2', name: 'Tipico MU', domain: 'tipico.mu', locale: 'en-MU', currency: 'MUR', markets: ['mu'], playerCount: 2841, status: 'active' },
]
const licenseRows: License[] = [
  { id: 'lic-1', market: 'de', licenseNumber: 'GGL-2024-001847', authority: 'GGL', validFrom: '2024-01-01', validTo: '2026-12-31', status: 'active', brandId: 'b-1', brandName: 'Tipico DE' },
  { id: 'lic-2', market: 'mu', licenseNumber: 'GRA-MU-2025-0042', authority: 'GRA', validFrom: '2025-03-01', validTo: '2027-03-01', status: 'active', brandId: 'b-2', brandName: 'Tipico MU' },
  { id: 'lic-3', market: 'gb', licenseNumber: 'UKGC-054821', authority: 'UKGC', validFrom: '2024-06-01', validTo: '2026-06-01', status: 'expires_soon', brandId: 'b-1', brandName: 'Tipico DE' },
  { id: 'lic-4', market: 'nl', licenseNumber: 'KSA-NL-2023-7721', authority: 'KSA', validFrom: '2023-01-01', validTo: '2025-01-01', status: 'expired', brandId: 'b-1', brandName: 'Tipico DE' },
]
const packages: Package[] = [
  { id: 'pkg-kyc', module: 'kyc', active: true, tier: 'growth', usage: [{ label: 'Verifications', current: 2441, included: 5000 }, { label: 'Players', current: 12847, included: null }], activeMarkets: ['de', 'mu'] },
  { id: 'pkg-aml', module: 'aml', active: true, tier: 'growth', usage: [{ label: 'Alerts', current: 126, included: null }], activeMarkets: ['de', 'mu'] },
  { id: 'pkg-rg', module: 'rg', active: true, tier: 'growth', usage: [{ label: 'Players', current: 12847, included: null }], activeMarkets: ['de', 'mu'] },
  { id: 'pkg-psp', module: 'psp', active: true, tier: 'growth', usage: [{ label: 'Transactions', current: 18441, included: 25000 }], activeMarkets: ['de', 'mu'] },
  { id: 'pkg-audit', module: 'audit', active: true, tier: 'growth', usage: [{ label: 'Storage', current: 284, included: 420, unit: 'GB' }], activeMarkets: ['de', 'mu'] },
  { id: 'pkg-notify', module: 'notify', active: true, tier: 'growth', usage: [{ label: 'Deliveries', current: 8442, included: null }], activeMarkets: ['de', 'mu'] },
]
const users: TenantUser[] = [
  { id: 'u-1', name: 'Sarah Klein', email: 'sarah@tipico.de', roles: ['compliance-manager', 'kyc-agent'], brandScope: 'all', lastActiveAt: hoursAgo(2), status: 'active' },
  { id: 'u-2', name: 'James Leroux', email: 'james@tipico.de', roles: ['aml-analyst'], brandScope: 'all', lastActiveAt: daysAgo(1), status: 'active' },
  { id: 'u-3', name: 'Peter Schmidt', email: 'peter@tipico.de', roles: ['read-only'], brandScope: ['b-1'], brandNames: ['Tipico DE'], lastActiveAt: daysAgo(5), status: 'active' },
  { id: 'u-4', name: 'Invited User', email: 'new@tipico.de', roles: ['kyc-agent'], brandScope: ['b-2'], brandNames: ['Tipico MU'], status: 'invited', invitedAt: daysAgo(2) },
  { id: 'u-5', name: 'Former Agent', email: 'former@tipico.de', roles: ['org-admin'], brandScope: 'all', lastActiveAt: daysAgo(30), status: 'suspended' },
]
const apiKeys: ApiKey[] = [
  { id: 'ak-1', name: 'Production webhook integration', environment: 'production', maskedKey: 'sk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022a4f9', scopes: ['kyc:read', 'kyc:write', 'player:read', 'aml:read', 'aml:write', 'rg:read', 'psp:read', 'webhook:read'], createdAt: daysAgo(12), lastUsedAt: hoursAgo(2), status: 'active' },
  { id: 'ak-2', name: 'Staging development', environment: 'staging', maskedKey: 'sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20228e2c', scopes: ['kyc:read', 'player:read', 'aml:read', 'psp:read'], createdAt: daysAgo(30), lastUsedAt: daysAgo(3), expiresAt: daysFromNow(61), status: 'active' },
  { id: 'ak-3', name: 'Legacy integration', environment: 'production', maskedKey: '', scopes: Array.from({ length: 12 }, (_, i) => `scope${i}:read`), createdAt: daysAgo(72), status: 'revoked' },
  { id: 'ak-4', name: 'Expired test key', environment: 'staging', maskedKey: '', scopes: ['kyc:read', 'player:read'], createdAt: daysAgo(104), lastUsedAt: daysAgo(44), expiresAt: daysAgo(13), status: 'expired' },
]
const revealFn = async () => 'sk_demo_EXAMPLE-ONLY-not-a-real-stripe-key'

/* columns */
const brandCols: TableColumn[] = [{ key: 'brand', label: 'Brand', width: '220px' }, { key: 'domain', label: 'Domain', width: '180px' }, { key: 'locale', label: 'Locale', width: '120px' }, { key: 'markets', label: 'Markets', width: '120px' }, { key: 'players', label: 'Players', width: '100px' }, { key: 'status', label: 'Status', width: '90px' }, { key: 'actions', label: '', width: '70px' }]
const licenseCols: TableColumn[] = [{ key: 'market', label: 'Market', width: '90px' }, { key: 'license', label: 'License', width: '180px' }, { key: 'authority', label: 'Authority', width: '90px' }, { key: 'validity', label: 'Validity', width: '200px' }, { key: 'status', label: 'Status', width: '110px' }, { key: 'actions', label: '', width: '70px' }]
const userCols: TableColumn[] = [{ key: 'agent', label: 'Agent', width: '240px' }, { key: 'roles', label: 'Roles', width: '200px' }, { key: 'scope', label: 'Brands', width: '150px' }, { key: 'active', label: 'Last active', width: '110px' }, { key: 'status', label: 'Status', width: '110px' }, { key: 'actions', label: '', width: '80px' }]
const apiKeyCols: TableColumn[] = [{ key: 'name', label: 'Name', width: '180px' }, { key: 'key', label: 'Key', width: '240px' }, { key: 'scopes', label: 'Scopes', width: '180px' }, { key: 'created', label: 'Created', width: '100px' }, { key: 'used', label: 'Last used', width: '100px' }, { key: 'expires', label: 'Expires', width: '100px' }, { key: 'actions', label: '', width: '100px' }]

const s: React.CSSProperties = { fontFamily: 'var(--ub-font-body)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 12 }
const fieldRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8, alignItems: 'center', marginBottom: 10 }
const fieldLabel: React.CSSProperties = { fontFamily: 'var(--ub-font-body)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }
const fieldInput: React.CSSProperties = { height: 34, padding: '0 10px', border: '0.5px solid var(--ub-color-secondary-container)', borderRadius: 'var(--ub-radius-md)', backgroundColor: 'var(--ub-color-surface-container-low)', fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface)' }
const readOnly: React.CSSProperties = { fontFamily: 'var(--ub-font-body)', fontSize: 13, color: 'var(--ub-color-on-surface)' }

/* tabs */
function OrgTab() {
  return (
    <Surface elevation="low" style={{ padding: 20, borderRadius: 10, maxWidth: 720 }}>
      <div style={s}>Organisation details</div>
      {[['Legal entity name', 'Tipico GmbH'], ['Registration number', 'HRB 12345 M\u00fcnchen'], ['Billing email', 'finance@tipico.de'], ['Support email', 'support@tipico.de']].map(([l, v]) => (
        <div key={l} style={fieldRow}><span style={fieldLabel}>{l}</span><input style={fieldInput} defaultValue={v} /></div>
      ))}
      <div style={{ ...s, marginTop: 20 }}>Contract</div>
      <div style={fieldRow}><span style={fieldLabel}>Tier</span><span style={readOnly}><Badge variant="enhanced" size="sm" label="Growth" /> <span style={{ fontSize: 11, color: 'var(--ub-color-on-surface-variant)' }}>Managed by UNIICY</span></span></div>
      <div style={fieldRow}><span style={fieldLabel}>Start</span><span style={readOnly}>1 Feb 2026</span></div>
      <div style={fieldRow}><span style={fieldLabel}>Next renewal</span><span style={readOnly}>1 Feb 2027</span></div>
      <div style={fieldRow}><span style={fieldLabel}>Account manager</span><span style={{ ...readOnly, display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name="Max Meier" size="xs" /> Max Meier — max@uniicy.com</span></div>
      <div style={{ marginTop: 16 }}><Button variant="primary" size="sm" disabled>Save changes</Button></div>
    </Surface>
  )
}

function BrandsTab() {
  const rows = brandRows.map((b) => <BrandRow key={b.id} brand={b} onEdit={() => {}} onDisable={() => {}} onClick={() => {}} />)
  return (<><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><Button variant="primary" size="sm">Add brand {'\u2192'}</Button></div><DataTable columns={brandCols} rows={rows} /></>)
}

function LicensesTab() {
  const rows = licenseRows.map((l) => <LicenseRow key={l.id} license={l} onDeactivate={() => {}} />)
  return <DataTable columns={licenseCols} rows={rows} />
}

function PackagesTab() {
  return (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>{packages.map((p) => <PackageToggle key={p.id} pkg={p} onToggle={() => {}} />)}</div>)
}

function UsersTab({ inviteOpen, setInviteOpen }: { inviteOpen: boolean; setInviteOpen: (v: boolean) => void }) {
  const rows = users.map((u) => <UserRow key={u.id} user={u} onEdit={() => {}} onSuspend={() => {}} onRemove={() => {}} />)
  return (
    <><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>Invite agent {'\u2192'}</Button></div>
    <DataTable columns={userCols} rows={rows} />
    <InviteUserPanel open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={async () => { await new Promise((r) => setTimeout(r, 1000)) }} brands={[{ id: 'b-1', name: 'Tipico DE' }, { id: 'b-2', name: 'Tipico MU' }]} existingEmails={['sarah@tipico.de']} /></>
  )
}

function ApiKeysTab({ createOpen, setCreateOpen }: { createOpen: boolean; setCreateOpen: (v: boolean) => void }) {
  const rows = apiKeys.map((k) => <ApiKeyRow key={k.id} apiKey={k} onReveal={revealFn} onCopy={() => {}} onRotate={() => {}} onRevoke={() => {}} />)
  return (
    <><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>Generate key {'\u2192'}</Button></div>
    <DataTable columns={apiKeyCols} rows={rows} />
    <CreateApiKeyPanel open={createOpen} onClose={() => setCreateOpen(false)} onCreate={async () => { await new Promise((r) => setTimeout(r, 1000)); return { id: 'ak-new', fullKey: 'sk_demo_EXAMPLE-ONLY-not-a-real-stripe-key' } }} /></>
  )
}

/* page */
interface TenantPageProps { initialTab: string; sidebarCollapsed: boolean; inviteOpen: boolean; createKeyOpen: boolean }

function TenantPage({ initialTab, sidebarCollapsed, inviteOpen: initInvite, createKeyOpen: initCreate }: TenantPageProps) {
  const [tab, setTab] = useState(initialTab)
  const [inviteOpen, setInviteOpen] = useState(initInvite)
  const [createOpen, setCreateOpen] = useState(initCreate)

  const content: Record<string, React.JSX.Element> = {
    org: <OrgTab />, brands: <BrandsTab />, licenses: <LicensesTab />, packages: <PackagesTab />,
    users: <UsersTab inviteOpen={inviteOpen} setInviteOpen={setInviteOpen} />,
    apikeys: <ApiKeysTab createOpen={createOpen} setCreateOpen={setCreateOpen} />,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar activePath="/tenant" brand={brands_data[0]!} brands={brands_data} onBrandChange={() => {}} onNavigate={() => {}} agentName="Sarah Klein" agentRole="Org Admin" badgeCounts={{ kyc: 6, aml: 2 }} />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="Tenant Settings" breadcrumbs={[{ label: 'Tenant Settings' }]} notificationCount={0} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Active brands" value="2" change="Tipico DE \u00b7 Tipico MU" changeVariant="positive" status="ok" />
              <KpiCard label="Licensed markets" value="3" change="DE \u00b7 MU \u00b7 GB (beta)" changeVariant="positive" status="ok" />
              <KpiCard label="Agents" value="8" change="1 invite pending" changeVariant="positive" status="ok" />
              <KpiCard label="API keys" value="4" change="0 expiring soon" changeVariant="positive" status="ok" />
            </KpiRow>
            <TabBar tabs={tenantTabs} activeTab={tab} onTabChange={setTab} bordered />
            <div>{content[tab]}</div>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* storybook */
const meta = {
  title: 'Pages/TenantSettings', component: TenantPage,
  argTypes: { initialTab: { control: 'select', options: tenantTabs.map((t) => t.value) }, sidebarCollapsed: { control: 'boolean' }, inviteOpen: { control: 'boolean' }, createKeyOpen: { control: 'boolean' } },
  args: { initialTab: 'org', sidebarCollapsed: false, inviteOpen: false, createKeyOpen: false },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TenantPage>

export default meta; type Story = StoryObj<typeof meta>

export const Organisation: Story = {}
export const Brands: Story = { args: { initialTab: 'brands' } }
export const Licenses: Story = { args: { initialTab: 'licenses' } }
export const Packages: Story = { args: { initialTab: 'packages' } }
export const UsersInvite: Story = { args: { initialTab: 'users', inviteOpen: true } }
export const ApiKeysReveal: Story = {
  args: { initialTab: 'apikeys' },
  play: async ({ canvasElement }) => { await new Promise((r) => setTimeout(r, 300)); const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'Reveal'); btn?.click() },
}
export const ApiKeysCreate: Story = { args: { initialTab: 'apikeys', createKeyOpen: true } }
export const CollapsedSidebar: Story = { args: { sidebarCollapsed: true } }
