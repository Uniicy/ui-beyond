import type { BadgeProps } from '../badge'

export type AuditSource = 'kyc' | 'aml' | 'rg' | 'psp' | 'player-graph' | 'audit' | 'tenant' | 'system'

export const SOURCE_BADGE_VARIANT: Record<AuditSource, BadgeProps['variant']> = {
  kyc: 'manual_review',
  aml: 'critical',
  rg: 'pending',
  psp: 'approved',
  'player-graph': 'inactive',
  audit: 'inactive',
  tenant: 'inactive',
  system: 'inactive',
}

export const SOURCE_LABEL: Record<AuditSource, string> = {
  kyc: 'KYC',
  aml: 'AML',
  rg: 'RG',
  psp: 'PSP',
  'player-graph': 'Graph',
  audit: 'Audit',
  tenant: 'Tenant',
  system: 'System',
}

export const CopyIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <rect x="5" y="5" width="9" height="9" rx="1.5" />
    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
  </svg>
)
