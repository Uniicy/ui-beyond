import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AuditDetailPanel } from './audit-detail-panel'

const meta = {
  title: 'Components/AuditDetailPanel',
  component: AuditDetailPanel,
} satisfies Meta<typeof AuditDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

const kycPayload = {
  verificationId: 'ver_9a2f',
  playerId: 'usr_01J3X',
  status: 'approved',
  provider: 'onfido',
  confidence: 0.97,
  checks: {
    document: {
      type: 'passport',
      country: 'DE',
      expiry: '2029-08-15',
      valid: true,
    },
    liveness: {
      passed: true,
      score: 0.99,
    },
    pep: false,
    sanctions: false,
  },
  metadata: {
    requestedAt: '2026-04-11T14:30:00.000Z',
    completedAt: '2026-04-11T14:32:08.441Z',
    durationMs: 128441,
    version: 3,
    correlationId: 'corr_x7f3',
    tags: ['auto_approved', 'fast_track'],
    notes: null,
  },
}

const canonicalJson = JSON.stringify(kycPayload)

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

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
  sha256: '',
  payload: kycPayload,
}

function KycDetailStory() {
  const [event, setEvent] = useState(kycEvent)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (event.sha256 === '') {
      sha256(canonicalJson).then((hash) => {
        setEvent((prev) => ({ ...prev, sha256: hash }))
      })
    }
  }, [event.sha256])

  if (event.sha256 === '') return null

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
      <AuditDetailPanel
        event={event}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export const KycVerificationCompleted: Story = {
  args: {
    event: kycEvent as typeof kycEvent & { readonly payload: unknown },
    open: true,
    onClose: () => {},
  },
  render: () => <KycDetailStory />,
}
