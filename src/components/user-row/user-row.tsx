import { useState } from 'react'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { IconButton } from '../icon-button'
import { StatusDot } from '../status-dot'
import styles from './user-row.module.css'

type UserStatus = 'active' | 'invited' | 'suspended'

export interface TenantUser {
  readonly id: string; readonly name: string; readonly email: string; readonly roles: ReadonlyArray<string>
  readonly brandScope: 'all' | ReadonlyArray<string>; readonly brandNames?: ReadonlyArray<string>
  readonly lastActiveAt?: string; readonly status: UserStatus; readonly invitedAt?: string
}

export interface UserRowProps {
  readonly user: TenantUser
  readonly onEdit: (id: string) => void
  readonly onSuspend: (id: string) => void
  readonly onRemove: (id: string) => void
  readonly className?: string
}

const EditIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 2.5l2.5 2.5M4 13l-1.5.5.5-1.5L10.5 4.5l2.5 2.5L5.5 14.5" /></svg>)
const PauseIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="3" width="3" height="10" rx="1" /><rect x="9" y="3" width="3" height="10" rx="1" /></svg>)
const RemoveIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M6 4V3h4v1M5 4v8.5h6V4" /></svg>)

const ROLE_LABELS: Record<string, string> = { 'kyc-agent': 'KYC agent', 'compliance-manager': 'Compliance mgr', 'org-admin': 'Org admin', 'brand-admin': 'Brand admin', 'aml-analyst': 'AML analyst', 'finance': 'Finance', 'read-only': 'Read-only' }

function roleLabel(r: string): string { return ROLE_LABELS[r] ?? r.replace(/-/g, ' ') }
function formatRelative(iso: string): string { const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago` }

export function UserRow({ user: u, onEdit, onSuspend, onRemove, className }: UserRowProps) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const rowCls = [styles['row'], u.status === 'invited' ? styles['borderInvited'] : undefined, u.status === 'suspended' ? styles['borderSuspended'] : undefined, className].filter(Boolean).join(' ')
  const visibleRoles = u.roles.slice(0, 2)
  const extraRoles = u.roles.length > 2 ? u.roles.length - 2 : 0
  const scopeText = u.brandScope === 'all' ? 'All brands' : (u.brandNames?.join(', ') ?? (u.brandScope as string[]).join(', '))

  return (
    <div className={rowCls}>
      <div className={styles['agentCell']}>
        <Avatar name={u.name} size="md" />
        <div className={styles['agentInfo']}>
          <span className={styles['agentName']}>{u.name}</span>
          <span className={styles['agentEmail']}>{u.email}</span>
        </div>
      </div>
      <div className={styles['rolesCell']}>
        {visibleRoles.map((r) => <Badge key={r} variant="standard" size="sm" label={roleLabel(r)} />)}
        {extraRoles > 0 && <span className={styles['moreRoles']}>+{extraRoles} more</span>}
      </div>
      <span className={styles['scopeCell']} title={scopeText}>{scopeText}</span>
      <span className={`${styles['lastActive']} ${u.status === 'invited' ? styles['invitedTime'] : ''}`}>
        {u.status === 'invited' && u.invitedAt ? `Invited ${formatRelative(u.invitedAt)}` : u.lastActiveAt ? formatRelative(u.lastActiveAt) : '\u2014'}
      </span>
      <div className={styles['statusCell']}>
        <StatusDot status={u.status === 'active' ? 'ok' : u.status === 'invited' ? 'pending' : 'error'} size="sm" pulse={u.status === 'invited'} />
        {u.status}
      </div>
      <div className={styles['actions']}>
        {!confirmRemove ? (
          <>
            <IconButton icon={EditIcon} label="Edit" size="sm" variant="ghost" onClick={() => onEdit(u.id)} />
            <IconButton icon={PauseIcon} label={u.status === 'suspended' ? 'Unsuspend' : 'Suspend'} size="sm" variant="ghost" intent="neutral" onClick={() => onSuspend(u.id)} />
            <IconButton icon={RemoveIcon} label="Remove" size="sm" variant="ghost" intent="danger" onClick={() => setConfirmRemove(true)} />
          </>
        ) : (
          <div className={styles['confirmRow']}>
            Remove?
            <button type="button" className={`${styles['confirmBtn']} ${styles['confirmDanger']}`} onClick={() => { onRemove(u.id); setConfirmRemove(false) }}>Yes</button>
            <button type="button" className={`${styles['confirmBtn']} ${styles['confirmCancel']}`} onClick={() => setConfirmRemove(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  )
}
