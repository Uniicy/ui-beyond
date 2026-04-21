import { type HTMLAttributes } from 'react'
import styles from './variable-chip.module.css'

type ChipMode = 'palette' | 'inserted'

export interface VariableChipProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variableKey: string
  readonly description?: string
  readonly mode: ChipMode
  readonly onInsert?: () => void
  readonly onRemove?: () => void
}

export interface TemplateVariable {
  readonly key: string
  readonly description: string
}

export interface VariableGroup {
  readonly group: string
  readonly variables: ReadonlyArray<TemplateVariable>
}

export const TEMPLATE_VARIABLES: ReadonlyArray<VariableGroup> = [
  {
    group: 'Player',
    variables: [
      { key: 'player.name', description: "Player's full name" },
      { key: 'player.email', description: "Player's email address" },
      { key: 'player.id', description: 'Trackeo player ID' },
    ],
  },
  {
    group: 'KYC',
    variables: [
      { key: 'kyc.status', description: 'Current KYC status' },
      { key: 'kyc.verified_at', description: 'Verification date' },
      { key: 'kyc.document_type', description: 'Document type used' },
    ],
  },
  {
    group: 'Account',
    variables: [
      { key: 'account.balance', description: 'Current wallet balance' },
      { key: 'account.currency', description: 'Account currency' },
      { key: 'account.created_at', description: 'Registration date' },
    ],
  },
  {
    group: 'Brand',
    variables: [
      { key: 'brand.name', description: 'Brand display name' },
      { key: 'brand.support_email', description: 'Support email address' },
    ],
  },
  {
    group: 'Compliance',
    variables: [
      { key: 'exclusion.reference', description: 'OASIS/CRUKS reference' },
      { key: 'exclusion.expires_at', description: 'Exclusion expiry date' },
      { key: 'limit.amount', description: 'Limit amount' },
      { key: 'limit.period', description: 'Limit period' },
    ],
  },
]

function formatToken(key: string): string {
  return `{{${key}}}`
}

export function VariableChip({
  variableKey,
  description,
  mode,
  onInsert,
  onRemove,
  className,
  ...props
}: VariableChipProps) {
  if (mode === 'palette') {
    const paletteCls = [styles['palette'], className].filter(Boolean).join(' ')

    return (
      <span
        className={paletteCls}
        onClick={onInsert}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onInsert?.() } }}
        {...props}
      >
        <span className={styles['paletteContent']}>
          <span className={styles['paletteKey']}>{formatToken(variableKey)}</span>
          {description !== undefined && (
            <span className={styles['paletteDesc']}>{description}</span>
          )}
        </span>
        <span className={styles['insertHint']}>Insert {'\u2192'}</span>
      </span>
    )
  }

  const insertedCls = [styles['inserted'], className].filter(Boolean).join(' ')

  return (
    <span
      className={insertedCls}
      contentEditable={false}
      {...props}
    >
      <span className={styles['insertedKey']}>{formatToken(variableKey)}</span>
      {onRemove !== undefined && (
        <button
          type="button"
          className={styles['removeBtn']}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label={`Remove ${variableKey}`}
        >
          {'\u00d7'}
        </button>
      )}
    </span>
  )
}
