import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { IconButton } from '../icon-button'
import { MarketTag } from '../market-tag'
import styles from './brand-onboarding-wizard.module.css'

export interface NewBrandConfig { readonly orgId: string; readonly brandName: string; readonly domain: string; readonly locale: string; readonly currency: string; readonly markets: string[]; readonly licenseNumbers: Record<string, string>; readonly packages: string[] }

interface OrgOption { readonly id: string; readonly name: string }

export interface BrandOnboardingWizardProps {
  readonly open: boolean; readonly onClose: () => void
  readonly onComplete: (brand: NewBrandConfig) => Promise<{ brandId: string; apiKey: string }>
  readonly organisations: ReadonlyArray<OrgOption>
}

const STEPS = ['Organisation', 'Locale & currency', 'Markets & licenses', 'Packages', 'Review & confirm']
const MARKETS = ['de', 'mu', 'nl', 'gb'] as const
const LOCALES = ['de-DE', 'en-GB', 'en-MU', 'fr-FR', 'nl-NL']
const CURRENCIES = ['EUR', 'GBP', 'MUR', 'USD']
const PACKAGES = [{ key: 'kyc', label: 'KYC', required: true }, { key: 'aml', label: 'AML' }, { key: 'rg', label: 'Responsible Gaming' }, { key: 'psp', label: 'PSP Gateway' }, { key: 'audit', label: 'Audit & Reporting' }, { key: 'notify', label: 'Notifications' }]
const CloseIcon = (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>)

export function BrandOnboardingWizard({ open, onClose, onComplete, organisations }: BrandOnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [orgId, setOrgId] = useState('')
  const [brandName, setBrandName] = useState('')
  const [domain, setDomain] = useState('')
  const [locale, setLocale] = useState('de-DE')
  const [currency, setCurrency] = useState('EUR')
  const [markets, setMarkets] = useState<string[]>([])
  const [licenses, setLicenses] = useState<Record<string, string>>({})
  const [pkgs, setPkgs] = useState<string[]>(['kyc'])
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<{ brandId: string; apiKey: string } | null>(null)
  const [keyCopied, setKeyCopied] = useState(false)

  useEffect(() => { if (open) { setStep(0); setOrgId(''); setBrandName(''); setDomain(''); setLocale('de-DE'); setCurrency('EUR'); setMarkets([]); setLicenses({}); setPkgs(['kyc']); setCreating(false); setResult(null); setKeyCopied(false) } }, [open])

  const toggleMarket = (m: string) => setMarkets((p) => p.includes(m) ? p.filter((x) => x !== m) : [...p, m])
  const togglePkg = (k: string) => { if (k === 'kyc') return; setPkgs((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]) }
  const orgName = organisations.find((o) => o.id === orgId)?.name ?? ''

  const canNext = [
    () => orgId !== '' && brandName.trim() !== '' && domain.trim() !== '',
    () => true,
    () => markets.length > 0 && markets.every((m) => (licenses[m] ?? '').trim() !== ''),
    () => pkgs.length > 0,
    () => true,
  ]

  const handleSubmit = async () => { setCreating(true); const r = await onComplete({ orgId, brandName: brandName.trim(), domain: domain.trim(), locale, currency, markets, licenseNumbers: licenses, packages: pkgs }); setResult(r); setCreating(false) }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className={`${styles['backdrop']} ${styles['backdropOpen']}`} onClick={onClose}>
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['header']}>
          <div className={styles['headerTop']}>
            <span className={styles['headerTitle']}>Onboard new brand</span>
            <IconButton icon={CloseIcon} label="Close" size="sm" variant="ghost" onClick={onClose} />
          </div>
          {result === null && (
            <div className={styles['steps']}>
              {STEPS.map((label, i) => (
                <div key={label} className={`${styles['step']} ${i < step ? styles['stepComplete'] : i === step ? styles['stepActive'] : styles['stepFuture']}`}>
                  <span className={styles['stepCircle']}>{i < step ? '\u2713' : i + 1}</span>
                  <span className={styles['stepLabel']}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles['body']}>
          {result !== null ? (
            <div className={styles['successArea']}>
              <div className={styles['successIcon']}>{'\u2713'}</div>
              <span className={styles['successTitle']}>Brand created successfully</span>
              <span className={styles['successSub']}>Brand ID: {result.brandId}</span>
              <div className={styles['warningBanner']}>{'\u26A0\uFE0F'} Copy this API key now. It will not be shown again.</div>
              <input className={styles['keyInput']} readOnly value={result.apiKey} />
              <Button variant="primary" size="sm" onClick={() => { navigator.clipboard.writeText(result.apiKey).catch(() => {}); setKeyCopied(true) }}>{keyCopied ? '\u2713 Copied!' : 'Copy key'}</Button>
            </div>
          ) : step === 0 ? (
            <>
              <div className={styles['field']}><span className={styles['fieldLabel']}>Organisation</span>
                <select className={styles['fieldSelect']} value={orgId} onChange={(e) => setOrgId(e.target.value)}><option value="">Select\u2026</option>{organisations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
              <div className={styles['field']}><span className={styles['fieldLabel']}>Brand name</span><input className={styles['fieldInput']} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Tipico DE" /></div>
              <div className={styles['field']}><span className={styles['fieldLabel']}>Domain</span><input className={styles['fieldInput']} value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="https://tipico.de" /></div>
              {orgId && brandName && domain && <div className={styles['preview']}>This brand will appear as <span className={styles['previewStrong']}>{brandName}</span> ({domain}) under <span className={styles['previewStrong']}>{orgName}</span>.</div>}
            </>
          ) : step === 1 ? (
            <>
              <div className={styles['field']}><span className={styles['fieldLabel']}>Locale</span><select className={styles['fieldSelect']} value={locale} onChange={(e) => setLocale(e.target.value)}>{LOCALES.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
              <div className={styles['field']}><span className={styles['fieldLabel']}>Currency</span><select className={styles['fieldSelect']} value={currency} onChange={(e) => setCurrency(e.target.value)}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className={styles['preview']}>Monetary values display as: <span className={styles['previewStrong']}>{currency === 'EUR' ? '\u20ac1,234.56' : currency === 'GBP' ? '\u00a31,234.56' : `${currency} 1,234.56`}</span></div>
            </>
          ) : step === 2 ? (
            <div className={styles['marketRow']}>
              {MARKETS.map((m) => (
                <div key={m}>
                  <Checkbox checked={markets.includes(m)} onChange={() => toggleMarket(m)} label="" size="sm" />
                  <MarketTag market={m} size="sm" />
                  {markets.includes(m) && (
                    <div className={styles['licenseInput']}>
                      <input className={styles['fieldInput']} style={{ width: 240 }} placeholder={`License number for ${m.toUpperCase()}`} value={licenses[m] ?? ''} onChange={(e) => setLicenses((p) => ({ ...p, [m]: e.target.value }))} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : step === 3 ? (
            <>
              {PACKAGES.map((p) => (
                <div key={p.key} style={{ padding: '4px 0' }}>
                  <Checkbox checked={pkgs.includes(p.key)} onChange={() => togglePkg(p.key)} label={p.label + (p.required ? ' (required)' : '')} size="sm" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className={styles['summaryRow']}><span className={styles['summaryLabel']}>Organisation</span><span className={styles['summaryValue']}>{orgName}</span></div>
              <div className={styles['summaryRow']}><span className={styles['summaryLabel']}>Brand</span><span className={styles['summaryValue']}>{brandName} ({domain})</span></div>
              <div className={styles['summaryRow']}><span className={styles['summaryLabel']}>Locale / Currency</span><span className={styles['summaryValue']}>{locale} / {currency}</span></div>
              <div className={styles['summaryRow']}><span className={styles['summaryLabel']}>Markets</span><span className={styles['summaryValue']}>{markets.join(', ').toUpperCase()}</span></div>
              <div className={styles['summaryRow']}><span className={styles['summaryLabel']}>Packages</span><span className={styles['summaryValue']}>{pkgs.join(', ')}</span></div>
              <div className={styles['preview']} style={{ marginTop: 16 }}>
                Will provision: database namespace, API key, webhook endpoints, market-specific compliance hooks ({markets.includes('de') ? 'OASIS, LUGAS, ' : ''}{markets.includes('mu') ? 'CEMS, ' : ''}KYC provider integration).
              </div>
            </>
          )}
        </div>

        <div className={styles['footer']}>
          {result !== null ? (
            <><span /><Button variant="primary" size="sm" onClick={onClose}>Done</Button></>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={step > 0 ? () => setStep(step - 1) : onClose}>{step > 0 ? 'Back' : 'Cancel'}</Button>
              <span className={styles['footerCenter']}>Step {step + 1} of 5</span>
              {step < 4 ? (
                <Button variant="primary" size="sm" disabled={!canNext[step]?.()} onClick={() => setStep(step + 1)}>Next {'\u2192'}</Button>
              ) : (
                <Button variant="primary" size="sm" disabled={creating} onClick={handleSubmit}>{creating ? 'Creating\u2026' : 'Confirm and create brand'}</Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
