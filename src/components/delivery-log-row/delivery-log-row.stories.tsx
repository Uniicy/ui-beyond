import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'
import { DeliveryLogRow } from './delivery-log-row'

const meta = {
  title: 'Components/DeliveryLogRow',
  component: DeliveryLogRow,
} satisfies Meta<typeof DeliveryLogRow>

export default meta
type Story = StoryObj<typeof meta>

const noop = async () => ({ status: 200, durationMs: 120 })

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
}

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
  },
  responseBody: { error: 'Internal server error', code: 'UPSTREAM_TIMEOUT', retryable: true },
  status: 'failed' as const,
}

const retryingDelivery = {
  id: 'del_003',
  occurredAt: '2026-04-11T15:01:44.102Z',
  eventType: 'rg.limit.changed',
  endpointUrl: 'https://rg-service.internal/webhooks/limits',
  httpStatus: 502,
  responseTimeMs: 1200,
  attemptNumber: 3,
  requestBody: { playerId: 'usr_02K9Y', limitType: 'deposit', newValue: 500 },
  responseBody: 'Bad Gateway',
  status: 'retrying' as const,
}

export const Success: Story = {
  args: { delivery: successDelivery, onReplay: noop, onClick: () => {} },
}

export const Failed: Story = {
  args: { delivery: failedDelivery, onReplay: noop, onClick: () => {} },
}

export const FailedExpanded: Story = {
  args: { delivery: failedDelivery, onReplay: noop, onClick: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole('button')
    await userEvent.click(row)
  },
}

export const Retrying: Story = {
  args: { delivery: retryingDelivery, onReplay: noop, onClick: () => {} },
}

export const ReplayInProgress: Story = {
  args: {
    delivery: successDelivery,
    onReplay: () => new Promise((resolve) => setTimeout(() => resolve({ status: 200, durationMs: 95 }), 2000)),
    onClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const replayBtn = canvas.getByText('Replay →')
    await userEvent.click(replayBtn)
  },
}

export const AllRows: Story = {
  args: { delivery: successDelivery, onReplay: noop, onClick: () => {} },
  render: () => (
    <div>
      <DeliveryLogRow delivery={successDelivery} onReplay={noop} onClick={() => {}} />
      <DeliveryLogRow delivery={failedDelivery} onReplay={noop} onClick={() => {}} />
      <DeliveryLogRow delivery={retryingDelivery} onReplay={noop} onClick={() => {}} />
    </div>
  ),
}
