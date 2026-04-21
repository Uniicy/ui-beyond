import type { Meta, StoryObj } from '@storybook/react'
import { AlertRoutingRow, type AlertRoutingRule } from './alert-routing-row'

const noop = () => {}

const slackWildcard: AlertRoutingRule = {
  id: 'rt-1',
  eventPattern: 'aml.*',
  channel: 'slack',
  channelTarget: '#compliance-alerts',
  throttle: 'Max 1 per hour',
  active: true,
}

const emailExact: AlertRoutingRule = {
  id: 'rt-2',
  eventPattern: 'kyc.verification.completed',
  channel: 'email',
  channelTarget: 'ops@company.com',
  throttle: null,
  active: true,
}

const webhookInactive: AlertRoutingRule = {
  id: 'rt-3',
  eventPattern: 'rg.*',
  channel: 'webhook',
  channelTarget: 'https://hooks.internal/rg-events',
  throttle: 'Max 5 per minute',
  active: false,
}

const emailThrottled: AlertRoutingRule = {
  id: 'rt-4',
  eventPattern: 'psp.chargeback.*',
  channel: 'email',
  channelTarget: 'finance@company.com',
  throttle: 'Max 1 per day',
  active: true,
}

const meta = {
  title: 'Components/AlertRoutingRow',
  component: AlertRoutingRow,
  args: {
    rule: slackWildcard,
    onToggleActive: noop,
    onEdit: noop,
    onDelete: noop,
  },
} satisfies Meta<typeof AlertRoutingRow>

export default meta
type Story = StoryObj<typeof meta>

export const SlackWildcard: Story = {}

export const EmailExactEvent: Story = {
  args: { rule: emailExact },
}

export const WebhookInactive: Story = {
  args: { rule: webhookInactive },
}

export const RoutingList: Story = {
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 200px 160px 60px 70px', height: 32, alignItems: 'center', padding: '0 8px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ub-color-on-surface-variant)', background: 'var(--ub-color-surface-container-low)', borderRadius: 'var(--ub-radius-md) var(--ub-radius-md) 0 0' }}>
        <span>Pattern</span><span>Channel</span><span>Throttle</span><span style={{ textAlign: 'center' }}>Active</span><span />
      </div>
      <AlertRoutingRow rule={slackWildcard} onToggleActive={noop} onEdit={noop} onDelete={noop} />
      <AlertRoutingRow rule={emailExact} onToggleActive={noop} onEdit={noop} onDelete={noop} />
      <AlertRoutingRow rule={webhookInactive} onToggleActive={noop} onEdit={noop} onDelete={noop} />
      <AlertRoutingRow rule={emailThrottled} onToggleActive={noop} onEdit={noop} onDelete={noop} />
    </div>
  ),
}

export const PatternHighlighting: Story = {
  name: 'Pattern highlighting (wildcard accent)',
  args: { rule: slackWildcard },
}
