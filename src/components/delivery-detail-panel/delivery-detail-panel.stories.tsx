import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DeliveryDetailPanel } from './delivery-detail-panel'

const meta = {
  title: 'Components/DeliveryDetailPanel',
  component: DeliveryDetailPanel,
} satisfies Meta<typeof DeliveryDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

const failedDelivery = {
  id: 'del_002',
  occurredAt: '2026-04-11T15:01:44.102Z',
  eventType: 'aml.alert.created',
  endpointUrl: 'https://compliance.internal/api/v2/ingest/alerts',
  httpStatus: 500,
  responseTimeMs: 3200,
  attemptNumber: 1,
  requestBody: {
    alertId: 'alt_7b3c',
    ruleName: 'rapid-deposit-pattern',
    severity: 'high',
    amount: 15000,
    currency: 'EUR',
    player: {
      id: 'usr_02K9Y',
      name: 'Erika Bauer',
      market: 'DE',
    },
    metadata: {
      correlationId: 'corr_z2m8',
      source: 'transaction-monitor',
      version: 2,
    },
  },
  responseBody: {
    error: 'Internal server error',
    code: 'UPSTREAM_TIMEOUT',
    retryable: true,
    timestamp: '2026-04-11T15:01:47.302Z',
  },
  status: 'failed' as const,
  requestHeaders: {
    'Content-Type': 'application/json',
    'X-Webhook-Id': 'del_002',
    'X-Webhook-Signature': 'sha256=a7ffc6f8bf1ed7…',
    'User-Agent': 'UIBeyond-Webhooks/1.0',
    Accept: 'application/json',
  },
  responseHeaders: {
    'Content-Type': 'application/json',
    'X-Request-Id': 'req_9f2a4b',
    'Retry-After': '30',
  },
}

function FailedDetailStory() {
  const [open, setOpen] = useState(true)

  const handleReplay = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return { status: 500, durationMs: 3100 }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'var(--ub-font-body)',
          fontSize: 13,
          padding: '8px 16px',
          border: '1px solid var(--ub-color-outline-variant)',
          borderRadius: 'var(--ub-radius-md)',
          background: 'var(--ub-color-surface-container-low)',
          color: 'var(--ub-color-on-surface)',
          cursor: 'pointer',
        }}
      >
        Open panel
      </button>
      <DeliveryDetailPanel
        delivery={failedDelivery}
        onReplay={handleReplay}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

const successDelivery = {
  id: 'del_001',
  occurredAt: '2026-04-11T14:32:08.441Z',
  eventType: 'kyc.verification.completed',
  endpointUrl: 'https://hooks.example.com/v1/webhooks/kyc-events',
  httpStatus: 200,
  responseTimeMs: 180,
  attemptNumber: 1,
  requestBody: {
    verificationId: 'ver_9a2f',
    playerId: 'usr_01J3X',
    status: 'approved',
    provider: 'onfido',
  },
  responseBody: { received: true, processedAt: '2026-04-11T14:32:08.622Z' },
  status: 'success' as const,
  requestHeaders: {
    'Content-Type': 'application/json',
    'X-Webhook-Id': 'del_001',
    'X-Webhook-Signature': 'sha256=e3b0c44298fc1c…',
    'User-Agent': 'UIBeyond-Webhooks/1.0',
    Accept: 'application/json',
  },
  responseHeaders: {
    'Content-Type': 'application/json',
    'X-Request-Id': 'req_2b8f1a',
  },
}

function SuccessDetailStory() {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'var(--ub-font-body)',
          fontSize: 13,
          padding: '8px 16px',
          border: '1px solid var(--ub-color-outline-variant)',
          borderRadius: 'var(--ub-radius-md)',
          background: 'var(--ub-color-surface-container-low)',
          color: 'var(--ub-color-on-surface)',
          cursor: 'pointer',
        }}
      >
        Open panel
      </button>
      <DeliveryDetailPanel
        delivery={successDelivery}
        onReplay={async () => ({ status: 200, durationMs: 95 })}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export const SuccessDelivery: Story = {
  args: {
    delivery: successDelivery,
    onReplay: async () => ({ status: 200, durationMs: 95 }),
    open: true,
    onClose: () => {},
  },
  render: () => <SuccessDetailStory />,
}

export const FailedDelivery: Story = {
  args: {
    delivery: failedDelivery,
    onReplay: async () => ({ status: 500, durationMs: 3100 }),
    open: true,
    onClose: () => {},
  },
  render: () => <FailedDetailStory />,
}
