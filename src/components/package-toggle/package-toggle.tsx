import { Badge } from '../badge'
import { MarketTag } from '../market-tag'
import { ProgressBar } from '../progress-bar'
import styles from './package-toggle.module.css'

type ModuleKey = 'kyc' | 'aml' | 'rg' | 'psp' | 'audit' | 'notify'
type Tier = 'starter' | 'growth' | 'enterprise'
type Market = 'de' | 'mu' | 'nl' | 'gb'

interface UsageItem { readonly label: string; readonly current: number; readonly included: number | null; readonly unit?: string }

export interface Package {
  readonly id: string; readonly module: ModuleKey; readonly active: boolean; readonly tier: Tier
  readonly usage: ReadonlyArray<UsageItem>; readonly activeMarkets: ReadonlyArray<Market>
}

export interface PackageToggleProps {
  readonly pkg: Package
  readonly onToggle: (moduleId: string, active: boolean) => void
  readonly className?: string
}

const MODULE_CONFIG: Record<ModuleKey, { name: string; icon: string; color: string }> = {
  kyc: { name: 'KYC', icon: '\u{1FA2A}', color: 'var(--ub-color-primary)' },
  aml: { name: 'AML', icon: '\u{1F50E}', color: 'var(--ub-color-warning)' },
  rg: { name: 'Responsible Gambling', icon: '\u{1F6E1}\uFE0F', color: 'var(--ub-color-primary)' },
  psp: { name: 'PSP Gateway', icon: '\u{1F4B3}', color: 'var(--ub-color-tertiary-fixed)' },
  audit: { name: 'Audit & Reporting', icon: '\u{1F4CB}', color: 'var(--ub-color-warning)' },
  notify: { name: 'Notifications', icon: '\u{1F514}', color: 'var(--ub-color-primary)' },
}

const TIER_BADGE: Record<Tier, string> = { starter: 'standard', growth: 'enhanced', enterprise: 'live' }

function usagePct(u: UsageItem): number {
  if (u.included === null) return 0
  return u.included > 0 ? Math.min(120, (u.current / u.included) * 100) : 0
}

function usageIntent(pct: number): 'success' | 'warning' | 'danger' {
  return pct >= 85 ? 'danger' : pct >= 60 ? 'warning' : 'success'
}

export function PackageToggle({ pkg: p, onToggle, className }: PackageToggleProps) {
  const config = MODULE_CONFIG[p.module]
  const hasNearLimit = p.active && p.usage.some((u) => u.included !== null && usagePct(u) > 85)

  const cardCls = [
    styles['card'],
    !p.active ? styles['inactive'] : undefined,
    hasNearLimit ? styles['nearLimit'] : undefined,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cardCls}>
      {/* Header */}
      <div className={styles['header']}>
        <div className={styles['headerLeft']}>
          <div className={styles['iconBox']} style={{ backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)` }}>{config.icon}</div>
          <span className={styles['moduleName']}>{config.name}</span>
        </div>
        <div className={styles['headerRight']}>
          <Badge variant={TIER_BADGE[p.tier] as 'standard'} size="sm" label={p.tier} />
          <button type="button" className={`${styles['toggle']} ${p.active ? styles['toggleOn'] : styles['toggleOff']}`} onClick={() => onToggle(p.id, !p.active)}>
            <span className={styles['toggleKnob']} />
          </button>
        </div>
      </div>

      {p.active ? (
        <>
          {/* Usage */}
          <div className={styles['usageList']}>
            {p.usage.map((u) => {
              const pct = usagePct(u)
              const isDanger = u.included !== null && pct > 85
              return (
                <div key={u.label} className={styles['usageItem']}>
                  <div className={styles['usageHeader']}>
                    <span className={styles['usageLabel']}>{u.label}</span>
                    {u.included !== null ? (
                      <span className={`${styles['usageValue']} ${isDanger ? styles['usageDanger'] : styles['usageNormal']}`}>
                        {u.current.toLocaleString('en')} / {u.included.toLocaleString('en')} {u.unit ?? ''}
                      </span>
                    ) : (
                      <Badge variant="standard" size="sm" label="Unlimited" />
                    )}
                  </div>
                  {u.included !== null ? (
                    <ProgressBar value={pct} height="sm" intent={usageIntent(pct)} rounded />
                  ) : (
                    <ProgressBar value={100} height="sm" intent="neutral" rounded />
                  )}
                </div>
              )
            })}
          </div>

          {/* Markets */}
          <div>
            <div className={styles['marketsLabel']}>Active markets</div>
            {p.activeMarkets.length > 0 ? (
              <div className={styles['marketsRow']}>
                {p.activeMarkets.map((m) => <MarketTag key={m} market={m} size="sm" showLicense={false} />)}
              </div>
            ) : (
              <span className={styles['noMarkets']}>No market packages active</span>
            )}
          </div>
        </>
      ) : (
        <span className={styles['inactiveMsg']}>Activate to configure market packages and usage</span>
      )}
    </div>
  )
}
