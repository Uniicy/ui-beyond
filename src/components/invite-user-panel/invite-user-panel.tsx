import { useState, useEffect } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { SlideInPanel } from '../slide-in-panel'
import styles from './invite-user-panel.module.css'

interface BrandOption { readonly id: string; readonly name: string }

export interface UserInvite { readonly email: string; readonly roles: string[]; readonly brandScope: 'all' | string[] }

export interface InviteUserPanelProps {
  readonly open: boolean; readonly onClose: () => void
  readonly onInvite: (invite: UserInvite) => Promise<void>
  readonly brands: ReadonlyArray<BrandOption>; readonly existingEmails: ReadonlyArray<string>
}

const ROLE_GROUPS = [
  { group: 'Administration', roles: [{ key: 'org-admin', label: 'Organisation admin', desc: 'Full access to all settings, users, and billing' }, { key: 'brand-admin', label: 'Brand admin', desc: 'Manage a specific brand and its configuration' }] },
  { group: 'Compliance', roles: [{ key: 'compliance-manager', label: 'Compliance manager', desc: 'Manage KYC, AML, RG workflows and approve SARs' }, { key: 'kyc-agent', label: 'KYC agent', desc: 'Process identity verifications' }, { key: 'aml-analyst', label: 'AML analyst', desc: 'Investigate AML alerts and file SARs' }] },
  { group: 'Operations', roles: [{ key: 'finance', label: 'Finance', desc: 'View transactions, reconciliation, and chargebacks' }, { key: 'read-only', label: 'Read-only', desc: 'View-only access to all modules' }] },
]

export function InviteUserPanel({ open, onClose, onInvite, brands, existingEmails }: InviteUserPanelProps) {
  const [email, setEmail] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [scopeMode, setScopeMode] = useState<'all' | 'specific'>('all')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [emailWarning, setEmailWarning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { if (open) { setEmail(''); setRoles([]); setScopeMode('all'); setSelectedBrands([]); setEmailWarning(false); setSubmitting(false); setSuccess(false) } }, [open])

  const toggleRole = (r: string) => setRoles((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r])
  const toggleBrand = (id: string) => setSelectedBrands((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const handleEmailBlur = () => setEmailWarning(existingEmails.some((e) => e.toLowerCase() === email.toLowerCase()))

  const canSubmit = email.includes('@') && roles.length > 0 && (scopeMode === 'all' || selectedBrands.length > 0) && !submitting
  const brandScope: 'all' | string[] = scopeMode === 'all' ? 'all' : selectedBrands
  const showPreview = email.includes('@') && roles.length > 0

  const handleSubmit = async () => { setSubmitting(true); await onInvite({ email, roles, brandScope }); setSubmitting(false); setSuccess(true) }

  const footer = success ? (
    <div className={styles['footer']}><span /><Button variant="primary" size="sm" onClick={onClose}>Done</Button></div>
  ) : (
    <div className={styles['footer']}>
      <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="sm" disabled={!canSubmit} onClick={handleSubmit}>{submitting ? 'Sending\u2026' : 'Send invitation \u2192'}</Button>
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={onClose} title="Invite agent" footer={footer}>
      {success ? (
        <div className={styles['success']}>
          <div className={styles['successIcon']}>{'\u2713'}</div>
          <span className={styles['successTitle']}>Invitation sent</span>
          <span className={styles['successEmail']}>{email}</span>
        </div>
      ) : (
        <>
          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Email</div>
            <div className={styles['field']}>
              <input className={styles['fieldInput']} type="email" placeholder="agent@company.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
              {emailWarning && <span className={styles['warning']}>{'\u26A0\uFE0F'} This user already has an account. They will be added to this organisation.</span>}
            </div>
          </div>

          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Roles</div>
            {ROLE_GROUPS.map((g) => (
              <div key={g.group}>
                <div className={styles['groupLabel']}>{g.group}</div>
                {g.roles.map((r) => (
                  <div key={r.key} className={styles['roleItem']}>
                    <Checkbox checked={roles.includes(r.key)} onChange={() => toggleRole(r.key)} size="sm" />
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--ub-color-on-surface)', fontWeight: 500 }}>{r.label}</span>
                      <div className={styles['roleDesc']}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Brand access</div>
            <div className={styles['radioGroup']}>
              <label className={styles['radioOption']}>
                <input type="radio" className={styles['radioInput']} checked={scopeMode === 'all'} onChange={() => setScopeMode('all')} /> All brands
              </label>
              <label className={styles['radioOption']}>
                <input type="radio" className={styles['radioInput']} checked={scopeMode === 'specific'} onChange={() => setScopeMode('specific')} /> Specific brands
              </label>
              {scopeMode === 'specific' && (
                <div className={styles['brandList']}>
                  {brands.map((b) => <Checkbox key={b.id} checked={selectedBrands.includes(b.id)} onChange={() => toggleBrand(b.id)} label={b.name} size="sm" />)}
                </div>
              )}
            </div>
          </div>

          {showPreview && (
            <div className={styles['section']}>
              <div className={styles['sectionTitle']}>Preview</div>
              <div className={styles['previewCard']}>
                <div className={styles['previewTop']}>
                  <Avatar name={email.split('@')[0] ?? email} size="sm" />
                  <span className={styles['previewEmail']}>{email}</span>
                </div>
                <div className={styles['previewRoles']}>{roles.map((r) => <Badge key={r} variant="standard" size="sm" label={r} />)}</div>
                <span className={styles['previewScope']}>{scopeMode === 'all' ? 'Access: All brands' : `Access: ${selectedBrands.length} brand(s)`}</span>
                <span className={styles['previewCaption']}>This agent will receive an email invitation. The link expires in 7 days.</span>
              </div>
            </div>
          )}
        </>
      )}
    </SlideInPanel>
  )
}
