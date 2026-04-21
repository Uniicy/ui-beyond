import { useState, useEffect } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { SlideInPanel } from '../slide-in-panel'
import styles from './create-api-key-panel.module.css'

export interface ApiKeyConfig { readonly name: string; readonly environment: 'production' | 'staging'; readonly scopes: string[]; readonly expiresIn: '90d' | '1y' | 'custom' | 'never'; readonly customExpiryDate?: string }

export interface CreateApiKeyPanelProps {
  readonly open: boolean; readonly onClose: () => void
  readonly onCreate: (config: ApiKeyConfig) => Promise<{ id: string; fullKey: string }>
  readonly mode?: 'create' | 'rotate'; readonly existingKeyName?: string
}

const SCOPE_GROUPS = [
  { group: 'Player', scopes: ['player:read', 'player:write'] },
  { group: 'KYC', scopes: ['kyc:read', 'kyc:write'] },
  { group: 'AML', scopes: ['aml:read', 'aml:write'] },
  { group: 'Responsible Gaming', scopes: ['rg:read', 'rg:write'] },
  { group: 'PSP', scopes: ['psp:read', 'psp:write'] },
  { group: 'Audit', scopes: ['audit:read'] },
  { group: 'Webhooks', scopes: ['webhook:read'] },
]
const ALL_SCOPES = SCOPE_GROUPS.flatMap((g) => g.scopes)

export function CreateApiKeyPanel({ open, onClose, onCreate, mode = 'create', existingKeyName }: CreateApiKeyPanelProps) {
  const [state, setState] = useState<'configure' | 'created'>('configure')
  const [name, setName] = useState('')
  const [env, setEnv] = useState<'production' | 'staging'>('production')
  const [scopes, setScopes] = useState<string[]>([])
  const [expiresIn, setExpiresIn] = useState<'90d' | '1y' | 'custom' | 'never'>('never')
  const [customDate, setCustomDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [fullKey, setFullKey] = useState('')
  const [keyCopied, setKeyCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [closeWarn, setCloseWarn] = useState(false)

  useEffect(() => { if (open) { setState('configure'); setName(mode === 'rotate' && existingKeyName ? existingKeyName : ''); setEnv('production'); setScopes([]); setExpiresIn('never'); setCustomDate(''); setCreating(false); setFullKey(''); setKeyCopied(false); setConfirmed(false); setCloseWarn(false) } }, [open, mode, existingKeyName])

  const toggleScope = (s: string) => setScopes((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])
  const allSelected = scopes.length === ALL_SCOPES.length
  const toggleAll = () => setScopes(allSelected ? [] : [...ALL_SCOPES])
  const canCreate = name.trim() !== '' && scopes.length > 0 && !creating

  const handleCreate = async () => {
    setCreating(true)
    const result = await onCreate({ name: name.trim(), environment: env, scopes, expiresIn, customExpiryDate: expiresIn === 'custom' ? customDate : undefined })
    setFullKey(result.fullKey)
    setCreating(false)
    setState('created')
  }

  const handleCopy = () => { navigator.clipboard.writeText(fullKey).catch(() => {}); setKeyCopied(true) }

  const handleClose = () => {
    if (state === 'created' && !confirmed) { setCloseWarn(true); return }
    onClose()
  }

  const title = mode === 'create' ? 'Generate API key' : 'Rotate API key'

  const footer = state === 'configure' ? (
    <div className={styles['footer']}>
      <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      <Button variant="primary" size="sm" disabled={!canCreate} onClick={handleCreate}>{creating ? 'Generating\u2026' : 'Generate key \u2192'}</Button>
    </div>
  ) : (
    <div className={styles['footer']}>
      {closeWarn ? (
        <div className={styles['closeWarning']}>
          You haven\u2019t confirmed you copied the key.
          <Button variant="danger" size="sm" onClick={onClose}>Close anyway</Button>
          <Button variant="ghost" size="sm" onClick={() => setCloseWarn(false)}>Keep open</Button>
        </div>
      ) : (
        <><span /><Button variant="primary" size="sm" disabled={!confirmed} onClick={onClose}>Done</Button></>
      )}
    </div>
  )

  return (
    <SlideInPanel open={open} onClose={handleClose} title={title} footer={footer}>
      {state === 'configure' ? (
        <>
          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Key details</div>
            <div className={styles['field']}>
              <span className={styles['fieldLabel']}>Name</span>
              <input className={styles['fieldInput']} placeholder="e.g. Production webhook integration" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles['field']}>
              <span className={styles['fieldLabel']}>Environment</span>
              <select className={styles['fieldSelect']} value={env} onChange={(e) => setEnv(e.target.value as 'production' | 'staging')}>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
              </select>
            </div>
          </div>

          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Scopes</div>
            <div className={styles['masterCheck']}>
              <Checkbox checked={allSelected} indeterminate={scopes.length > 0 && !allSelected} onChange={toggleAll} label={`Select all (${ALL_SCOPES.length})`} size="sm" />
            </div>
            {SCOPE_GROUPS.map((g) => (
              <div key={g.group}>
                <div className={styles['groupLabel']}>{g.group}</div>
                {g.scopes.map((s) => (
                  <div key={s} className={styles['scopeItem']}>
                    <Checkbox checked={scopes.includes(s)} onChange={() => toggleScope(s)} size="sm" />
                    <span className={styles['scopeKey']}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles['section']}>
            <div className={styles['sectionTitle']}>Expiry</div>
            <div className={styles['radioGroup']}>
              {[{ v: 'never', l: 'Never' }, { v: '90d', l: '90 days' }, { v: '1y', l: '1 year' }, { v: 'custom', l: 'Custom date' }].map(({ v, l }) => (
                <label key={v} className={styles['radioOption']}>
                  <input type="radio" className={styles['radioInput']} checked={expiresIn === v} onChange={() => setExpiresIn(v as typeof expiresIn)} /> {l}
                </label>
              ))}
              {expiresIn === 'custom' && <input type="date" className={styles['fieldInput']} value={customDate} onChange={(e) => setCustomDate(e.target.value)} style={{ width: 160, marginLeft: 24 }} />}
            </div>
          </div>

          {canCreate && (
            <div className={styles['section']}>
              <div className={styles['sectionTitle']}>Preview</div>
              <div className={styles['preview']}>
                <span className={styles['previewStrong']}>{name}</span> {'\u00b7'} {env} {'\u00b7'} {scopes.length} scopes {'\u00b7'} expires: {expiresIn === 'custom' ? customDate : expiresIn}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles['warningBanner']}>
            <div className={styles['warningTitle']}>{'\u26A0\uFE0F'} Copy this key now. It will not be shown again.</div>
            <div className={styles['warningSub']}>Store it securely. If you lose it, you will need to generate a new key.</div>
          </div>
          <div className={styles['keyDisplay']}>
            <input className={styles['keyInput']} readOnly value={fullKey} />
            <Button variant="primary" size="sm" onClick={handleCopy}>{keyCopied ? '\u2713 Copied!' : 'Copy key'}</Button>
          </div>
          <div className={styles['confirmBox']}>
            <Checkbox checked={confirmed} onChange={setConfirmed} label="I have copied this key and stored it securely." size="sm" />
          </div>
        </>
      )}
    </SlideInPanel>
  )
}
