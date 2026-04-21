import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AdminSidebar } from '../components/admin-sidebar'
import { AdminTopNav } from '../components/admin-top-nav'
import { KpiCard } from '../components/kpi-card'
import { TabBar } from '../components/tab-bar'
import { WebhookRow, type WebhookSummary } from '../components/webhook-row'
import { WebhookDetailPanel, type WebhookDetail } from '../components/webhook-detail-panel'
import { FilterBar } from '../components/filter-bar'
import { DataTable } from '../components/data-table'
import { DeliveryLogRow, type Delivery } from '../components/delivery-log-row'
import { DeliveryDetailPanel } from '../components/delivery-detail-panel'
import { AlertRoutingRow, type AlertRoutingRule } from '../components/alert-routing-row'
import { TemplateEditor, type LocaleTemplate } from '../components/template-editor'
import { Button } from '../components/button'
import { PageShell } from '../components/page-shell'
import { KpiRow } from '../components/kpi-row'
import { Stack } from '../components/stack'
import type { TableColumn } from '../components/table-header'

/* ── Helpers ── */
function minutesAgo(m: number): string { return new Date(Date.now() - m * 60_000).toISOString() }
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString() }
function daysAgo(d: number): string { return new Date(Date.now() - d * 86_400_000).toISOString() }

const brands = [{ name: 'Pferdewetten', id: 'pfw' }, { name: 'BetBird', id: 'bb' }]
const notiTabs = [{ value: 'webhooks', label: 'Webhooks' }, { value: 'delivery', label: 'Delivery Log' }, { value: 'routing', label: 'Alert Routing' }, { value: 'templates', label: 'Templates' }]

/* ── Webhook fixtures ── */
const webhooks: WebhookSummary[] = [
  { id: 'wh-1', url: 'https://ops.tipico.de/webhooks/trackeo', description: 'Trackeo ops sync', eventCount: 28, active: true, lastDeliveryAt: minutesAgo(2), lastDeliveryStatus: 'success', failureCount24h: 0 },
  { id: 'wh-2', url: 'https://slack-relay.internal/kyc', description: 'KYC Slack alerts', eventCount: 4, active: true, lastDeliveryAt: minutesAgo(14), lastDeliveryStatus: 'success', failureCount24h: 0 },
  { id: 'wh-3', url: 'https://compliance.example.com/alerts', description: 'Compliance sink', eventCount: 8, active: true, lastDeliveryAt: hoursAgo(2), lastDeliveryStatus: 'failed', failureCount24h: 6 },
  { id: 'wh-4', url: 'https://legacy.reporting.de/hook', description: 'Legacy reporting', eventCount: 12, active: false, lastDeliveryAt: daysAgo(3), lastDeliveryStatus: 'failed', failureCount24h: 0 },
]

const allEvents = ['kyc.verification.created', 'kyc.verification.completed', 'kyc.verification.rejected', 'kyc.player.blocked', 'aml.alert.created', 'aml.alert.dismissed', 'aml.sar.submitted', 'rg.limit.set', 'rg.limit.reached', 'rg.exclusion.applied', 'psp.deposit.completed', 'psp.withdrawal.completed']

const whDetail: WebhookDetail = {
  ...webhooks[2]!, secret: 'whsec_fail_endpoint_a1b2c3d4',
  subscribedEvents: allEvents.slice(0, 8),
  deliveryHistory: [
    { occurredAt: hoursAgo(2), eventType: 'aml.alert.created', statusCode: 500, durationMs: 1200 },
    { occurredAt: hoursAgo(2.1), eventType: 'aml.alert.created', statusCode: 500, durationMs: 1100 },
    { occurredAt: hoursAgo(2.2), eventType: 'kyc.verification.completed', statusCode: 500, durationMs: 900 },
  ],
}

/* ── Delivery fixtures ── */
const delivColumns: TableColumn[] = [
  { key: 'time', label: 'Time', width: '130px', sortable: true }, { key: 'event', label: 'Event', width: '200px' },
  { key: 'endpoint', label: 'Endpoint', width: '200px' }, { key: 'status', label: 'Status', width: '80px' },
  { key: 'duration', label: 'Duration', width: '80px' }, { key: 'attempt', label: 'Attempt', width: '80px' },
  { key: 'actions', label: '', width: '80px' },
]

const deliveries: Delivery[] = [
  { id: 'dl-1', occurredAt: minutesAgo(1), eventType: 'aml.alert.created', endpointUrl: 'compliance.example.com', httpStatus: 500, responseTimeMs: 1200, attemptNumber: 1, requestBody: { alertId: 'alt_88f', player: { id: 'usr_2b5e', name: 'Anna Fischer' } }, responseBody: { error: 'Internal Server Error' }, status: 'failed' },
  { id: 'dl-2', occurredAt: minutesAgo(2), eventType: 'aml.alert.created', endpointUrl: 'compliance.example.com', httpStatus: 500, responseTimeMs: 1100, attemptNumber: 2, requestBody: { alertId: 'alt_88f' }, responseBody: { error: 'Internal Server Error' }, status: 'failed' },
  { id: 'dl-3', occurredAt: minutesAgo(3), eventType: 'kyc.verification.completed', endpointUrl: 'compliance.example.com', httpStatus: 500, responseTimeMs: 900, attemptNumber: 3, requestBody: { verificationId: 'v_3c9d' }, responseBody: { error: 'Service Unavailable' }, status: 'failed' },
  { id: 'dl-4', occurredAt: hoursAgo(5), eventType: 'rg.exclusion.applied', endpointUrl: 'compliance.example.com', httpStatus: 503, responseTimeMs: 3100, attemptNumber: 1, requestBody: { exclusionId: 'ex_001' }, responseBody: null, status: 'failed' },
  { id: 'dl-5', occurredAt: hoursAgo(5.1), eventType: 'rg.exclusion.applied', endpointUrl: 'compliance.example.com', httpStatus: 503, responseTimeMs: 3000, attemptNumber: 2, requestBody: { exclusionId: 'ex_001' }, responseBody: null, status: 'failed' },
  { id: 'dl-6', occurredAt: hoursAgo(6), eventType: 'psp.withdrawal.approved', endpointUrl: 'legacy.reporting.de', httpStatus: 404, responseTimeMs: 400, attemptNumber: 1, requestBody: { txId: 'tx_9f2a' }, responseBody: { error: 'Not Found' }, status: 'failed' },
]

const detailDelivery = { ...deliveries[0]!, requestHeaders: { 'Content-Type': 'application/json', 'X-Webhook-Signature': 'sha256=abc123', 'User-Agent': 'IdentityBeyond/1.0' }, responseHeaders: { 'Content-Type': 'application/json', 'X-Request-Id': 'req_fail_001' } }

/* ── Routing fixtures ── */
const routingRules: AlertRoutingRule[] = [
  { id: 'ar-1', eventPattern: 'aml.*', channel: 'slack', channelTarget: '#compliance-alerts', throttle: 'Max 1/10min', active: true },
  { id: 'ar-2', eventPattern: 'kyc.player.blocked', channel: 'email', channelTarget: 'ops@tipico.de', throttle: null, active: true },
  { id: 'ar-3', eventPattern: 'kyc.verification.completed', channel: 'webhook', channelTarget: 'https://ops.tipico.de/webhooks/trackeo', throttle: null, active: true },
  { id: 'ar-4', eventPattern: 'rg.exclusion.applied', channel: 'slack', channelTarget: '#rg-alerts', throttle: 'Max 1/hr', active: true },
  { id: 'ar-5', eventPattern: 'tenant.*', channel: 'email', channelTarget: 'admin@tipico.de', throttle: null, active: false },
]

/* ── Template fixtures ── */
const templateLocales = ['de-DE', 'en-GB', 'fr-FR', 'nl-NL']
const templateNames = ['KYC approved', 'KYC rejected', 'Self-exclusion applied', 'Deposit limit reached', 'Affordability check request', 'Account created']

const kycApprovedValue: Record<string, LocaleTemplate> = {
  'de-DE': {
    subject: 'Ihre Identit\u00e4t wurde best\u00e4tigt \u2014 {{brand.name}}',
    body: [
      { type: 'text', content: 'Sehr geehrte/r ' }, { type: 'variable', key: 'player.name' },
      { type: 'text', content: ',\n\nIhre Identit\u00e4tspr\u00fcfung wurde erfolgreich abgeschlossen. Ihr ' },
      { type: 'variable', key: 'kyc.document_type' },
      { type: 'text', content: ' wurde am ' }, { type: 'variable', key: 'kyc.verified_at' },
      { type: 'text', content: ' verifiziert.\n\nSie k\u00f6nnen jetzt auf alle Funktionen zugreifen.\n\nMit freundlichen Gr\u00fc\u00dfen,\nDas ' },
      { type: 'variable', key: 'brand.name' },
      { type: 'text', content: '-Team\n' }, { type: 'variable', key: 'brand.support_email' },
    ],
  },
  'en-GB': {
    subject: 'Identity verified \u2014 {{brand.name}}',
    body: [
      { type: 'text', content: 'Dear ' }, { type: 'variable', key: 'player.name' },
      { type: 'text', content: ',\n\nYour identity verification is complete. Your ' },
      { type: 'variable', key: 'kyc.document_type' },
      { type: 'text', content: ' was verified on ' }, { type: 'variable', key: 'kyc.verified_at' },
      { type: 'text', content: '.\n\nYou now have full access.\n\nBest regards,\n' },
      { type: 'variable', key: 'brand.name' }, { type: 'text', content: ' Team' },
    ],
  },
  'fr-FR': { subject: '', body: [] },
  'nl-NL': { subject: '', body: [] },
}

/* ── Tab content ── */

function WebhooksTab({ panelOpen, setPanelOpen }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void }) {
  return (
    <>
      {webhooks.map((w) => <WebhookRow key={w.id} webhook={w} onToggle={() => {}} onTest={async () => ({ status: w.failureCount24h > 0 ? 500 : 200, durationMs: 142 })} onClick={() => setPanelOpen(true)} />)}
      <WebhookDetailPanel webhook={whDetail} allEventTypes={allEvents} onSave={async () => {}} onDelete={() => {}} onRotateSecret={async () => 'whsec_NEW_rotated'} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}

function DeliveryLogTab({ panelOpen, setPanelOpen }: { panelOpen: boolean; setPanelOpen: (v: boolean) => void }) {
  const rows = deliveries.map((d) => <DeliveryLogRow key={d.id} delivery={d} onReplay={async () => ({ status: 200, durationMs: 150 })} onClick={() => setPanelOpen(true)} />)
  return (
    <>
      <FilterBar tabs={[{ value: 'all', label: 'All', count: 8442 }, { value: 'success', label: 'Success', count: 8424 }, { value: 'failed', label: 'Failed', count: 18 }, { value: 'retrying', label: 'Retrying', count: 0 }]} activeTab="failed" onTabChange={() => {}} onSearchChange={() => {}} />
      <div style={{ marginTop: 16 }}>
        <DataTable columns={delivColumns} rows={rows} page={1} pageSize={25} total={18} onPageChange={() => {}} />
      </div>
      <DeliveryDetailPanel delivery={detailDelivery} onReplay={async () => ({ status: 200, durationMs: 150 })} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}

function RoutingTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}><Button variant="primary" size="sm">Add routing rule</Button></div>
      {routingRules.map((r) => <AlertRoutingRow key={r.id} rule={r} onToggleActive={() => {}} onEdit={() => {}} onDelete={() => {}} />)}
    </div>
  )
}

function TemplatesTab() {
  const [activeTpl, setActiveTpl] = useState('KYC approved')
  const [val, setVal] = useState(kycApprovedValue)
  const [dirty, setDirty] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 240, flexShrink: 0, borderRight: '0.5px solid var(--ub-ghost-border)', paddingRight: 16 }}>
        <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ub-color-on-surface-variant)', marginBottom: 8 }}>Templates</div>
        {templateNames.map((n) => (
          <button key={n} type="button" onClick={() => setActiveTpl(n)} style={{ display: 'block', width: '100%', padding: '8px 10px', border: 'none', background: activeTpl === n ? 'color-mix(in srgb, var(--ub-color-primary) 8%, transparent)' : 'none', borderRadius: 'var(--ub-radius-md)', cursor: 'pointer', fontFamily: 'var(--ub-font-body)', fontSize: 13, fontWeight: activeTpl === n ? 500 : 400, color: activeTpl === n ? 'var(--ub-color-primary)' : 'var(--ub-color-on-surface)', textAlign: 'left', marginBottom: 2 }}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <TemplateEditor
          templateId="tpl-001" templateName={activeTpl} locales={templateLocales}
          value={val} onChange={(loc, tpl) => { setVal((v) => ({ ...v, [loc]: tpl })); setDirty(true) }}
          onSave={async () => { await new Promise((r) => setTimeout(r, 1000)); setDirty(false) }} isDirty={dirty}
        />
      </div>
    </div>
  )
}

/* ── Page ── */

interface NotiPageProps { initialTab: string; sidebarCollapsed: boolean; whPanelOpen: boolean; dlPanelOpen: boolean }

function NotiPage({ initialTab, sidebarCollapsed, whPanelOpen: initWhPanel, dlPanelOpen: initDlPanel }: NotiPageProps) {
  const [tab, setTab] = useState(initialTab)
  const [whPanelOpen, setWhPanelOpen] = useState(initWhPanel)
  const [dlPanelOpen, setDlPanelOpen] = useState(initDlPanel)

  const content: Record<string, React.JSX.Element> = {
    webhooks: <WebhooksTab panelOpen={whPanelOpen} setPanelOpen={setWhPanelOpen} />,
    delivery: <DeliveryLogTab panelOpen={dlPanelOpen} setPanelOpen={setDlPanelOpen} />,
    routing: <RoutingTab />,
    templates: <TemplatesTab />,
  }

  return (
    <PageShell defaultSidebarCollapsed={sidebarCollapsed}>
      <PageShell.Sidebar>
        <AdminSidebar activePath="/notifications" brand={brands[0]!} brands={brands} onBrandChange={() => {}} onNavigate={() => {}} agentName="Sarah Klein" agentRole="Platform Admin" badgeCounts={{ kyc: 6, aml: 2 }} />
      </PageShell.Sidebar>
      <PageShell.Body>
        <PageShell.Header>
          <AdminTopNav pageTitle="Notifications" breadcrumbs={[{ label: 'Notifications' }]} primaryAction={{ label: 'Add webhook', onClick: () => {} }} notificationCount={1} />
        </PageShell.Header>
        <PageShell.Main>
          <Stack gap="lg">
            <KpiRow>
              <KpiCard label="Active webhooks" value="4" change="2 endpoints" changeVariant="positive" status="ok" />
              <KpiCard label="Delivered today" value="8,442" change="99.8% success rate" changeVariant="positive" status="ok" />
              <KpiCard label="Failed (24h)" value="18" change="3 endpoints affected" changeVariant="warning" status="warning" />
              <KpiCard label="Templates" value="6" change="4 locales configured" changeVariant="positive" status="ok" />
            </KpiRow>
            <TabBar tabs={notiTabs} activeTab={tab} onTabChange={setTab} bordered />
            <div>{content[tab]}</div>
          </Stack>
        </PageShell.Main>
      </PageShell.Body>
    </PageShell>
  )
}

/* ── Storybook ── */

const meta = {
  title: 'Pages/Notifications',
  component: NotiPage,
  argTypes: {
    initialTab: { control: 'select', options: notiTabs.map((t) => t.value) },
    sidebarCollapsed: { control: 'boolean' }, whPanelOpen: { control: 'boolean' }, dlPanelOpen: { control: 'boolean' },
  },
  args: { initialTab: 'webhooks', sidebarCollapsed: false, whPanelOpen: true, dlPanelOpen: false },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NotiPage>

export default meta
type Story = StoryObj<typeof meta>

export const Webhooks: Story = {}
export const DeliveryLogFailed: Story = { args: { initialTab: 'delivery', whPanelOpen: false, dlPanelOpen: true } }
export const AlertRouting: Story = { args: { initialTab: 'routing', whPanelOpen: false } }
export const TemplateEditorTab: Story = { args: { initialTab: 'templates', whPanelOpen: false } }
export const TemplatePreview: Story = {
  args: { initialTab: 'templates', whPanelOpen: false },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500))
    const btn = Array.from(canvasElement.querySelectorAll('button')).find((b) => b.textContent?.includes('Preview'))
    btn?.click()
  },
}
export const CollapsedSidebar: Story = { args: { sidebarCollapsed: true } }
