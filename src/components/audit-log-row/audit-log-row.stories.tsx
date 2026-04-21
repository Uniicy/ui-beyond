import type { Meta, StoryObj } from '@storybook/react'
import { AuditLogRow } from './audit-log-row'

const meta = {
  title: 'Components/AuditLogRow',
  component: AuditLogRow,
} satisfies Meta<typeof AuditLogRow>

export default meta
type Story = StoryObj<typeof meta>

const kycEvent = {
  id: 'evt_01JAQ7R2X8',
  occurredAt: '2026-04-11T14:32:08.441Z',
  eventType: 'kyc.verification.completed',
  source: 'kyc' as const,
  tenantId: 'tenant_pfw',
  brandId: 'brand_pferdewetten',
  playerId: 'usr_01J3X',
  playerName: 'Max Mustermann',
  agentId: 'agent_007',
  agentName: 'Anna Schmidt',
  payloadPreview: '{"verificationId":"ver_9a2f","status":"approved","provider":"onfido","confidence":0.97}',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
}

const amlEvent = {
  id: 'evt_01JAQ8K4M2',
  occurredAt: '2026-04-11T15:01:44.102Z',
  eventType: 'aml.alert.created',
  source: 'aml' as const,
  tenantId: 'tenant_pfw',
  brandId: 'brand_pferdewetten',
  playerId: 'usr_02K9Y',
  playerName: 'Erika Bauer',
  agentId: undefined,
  agentName: undefined,
  payloadPreview: '{"alertId":"alt_7b3c","ruleName":"rapid-deposit-pattern","severity":"high","amount":15000}',
  sha256: 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
}

const systemEvent = {
  id: 'evt_01JAQ9ZZ01',
  occurredAt: '2026-04-11T16:00:00.000Z',
  eventType: 'system.config.updated',
  source: 'system' as const,
  tenantId: 'tenant_pfw',
  brandId: 'brand_pferdewetten',
  playerId: undefined,
  playerName: undefined,
  agentId: undefined,
  agentName: undefined,
  payloadPreview: '{"key":"deposit_limit.default_eur","previous":1000,"current":500,"reason":"regulatory"}',
  sha256: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
}

export const KycVerification: Story = {
  args: { event: kycEvent, onClick: () => {} },
}

export const AmlAlert: Story = {
  args: { event: amlEvent, onClick: () => {} },
}

export const SystemEvent: Story = {
  args: { event: systemEvent, onClick: () => {} },
}

export const AllRows: Story = {
  args: { event: kycEvent, onClick: () => {} },
  render: () => (
    <div>
      <AuditLogRow event={kycEvent} onClick={() => {}} />
      <AuditLogRow event={amlEvent} onClick={() => {}} />
      <AuditLogRow event={systemEvent} onClick={() => {}} />
    </div>
  ),
}
