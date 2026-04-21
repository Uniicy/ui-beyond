import type { Meta, StoryObj } from '@storybook/react'

/* Dummy component for Storybook meta */
function ThemeShowcase() { return null }

const meta = {
  title: 'Foundation/Theme',
  component: ThemeShowcase,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ThemeShowcase>

export default meta
type Story = StoryObj<typeof meta>

const swatch = (token: string, label?: string): React.JSX.Element => (
  <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 40, height: 40, borderRadius: 6, background: `var(${token})`, border: '0.5px solid var(--ub-ghost-border)', flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11, color: 'var(--ub-color-on-surface)' }}>{token}</span>
      {label && <span style={{ fontSize: 10, color: 'var(--ub-color-on-surface-variant)' }}>{label}</span>}
    </div>
  </div>
)

const section = (title: string, children: React.ReactNode): React.JSX.Element => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ fontFamily: 'var(--ub-font-display)', fontSize: 18, fontWeight: 600, color: 'var(--ub-color-on-surface)', marginBottom: 12, letterSpacing: 'var(--ub-tracking-headline)' }}>{title}</div>
    {children}
  </div>
)

const grid = (children: React.ReactNode): React.JSX.Element => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px 24px' }}>{children}</div>
)

const typeRow = (label: string, font: string, size: string, weight: number, tracking?: string): React.JSX.Element => (
  <div key={label} style={{ marginBottom: 12 }}>
    <span style={{ fontFamily: `var(${font})`, fontSize: `var(${size})`, fontWeight: weight, letterSpacing: tracking ? `var(${tracking})` : undefined, color: 'var(--ub-color-on-surface)' }}>
      The quick brown fox jumps over the lazy dog
    </span>
    <div style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 10, color: 'var(--ub-color-on-surface-variant)', marginTop: 2 }}>
      {label} · {font} · {size} · {weight}
    </div>
  </div>
)

const spacingBar = (token: string, label: string): React.JSX.Element => (
  <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
    <div style={{ width: `var(${token})`, height: 12, background: 'var(--ub-color-primary)', borderRadius: 2, flexShrink: 0 }} />
    <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 10, color: 'var(--ub-color-on-surface-variant)', whiteSpace: 'nowrap' }}>{token} — {label}</span>
  </div>
)

const radiusSample = (token: string, label: string): React.JSX.Element => (
  <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 40, height: 40, borderRadius: `var(${token})`, background: 'var(--ub-color-surface-container-highest)', border: '1px solid var(--ub-color-primary)', flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11, color: 'var(--ub-color-on-surface)' }}>{token}</span>
      <span style={{ fontSize: 10, color: 'var(--ub-color-on-surface-variant)' }}>{label}</span>
    </div>
  </div>
)

/* ── Colours story ── */

export const Colours: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--ub-font-body)', maxWidth: 900 }}>
      {section('Primary', grid([
        swatch('--ub-color-primary', 'Primary accent'),
        swatch('--ub-color-primary-container', 'Primary container'),
        swatch('--ub-color-on-primary', 'Text on primary'),
        swatch('--ub-color-on-primary-container', 'Text on container'),
      ]))}
      {section('Secondary', grid([
        swatch('--ub-color-secondary', 'Secondary'),
        swatch('--ub-color-secondary-container', 'Secondary container'),
        swatch('--ub-color-on-secondary', 'Text on secondary'),
      ]))}
      {section('Tertiary (Emerald)', grid([
        swatch('--ub-color-tertiary', 'Tertiary'),
        swatch('--ub-color-tertiary-container', 'Tertiary container'),
        swatch('--ub-color-tertiary-fixed', 'Success / compliance green'),
        swatch('--ub-color-on-tertiary-container', 'Text on container'),
      ]))}
      {section('Semantic', grid([
        swatch('--ub-color-error', 'Error / danger'),
        swatch('--ub-color-error-container', 'Error container'),
        swatch('--ub-color-warning', 'Warning / amber'),
        swatch('--ub-color-warning-container', 'Warning container'),
      ]))}
      {section('Surfaces (Tonal Architecture)', grid([
        swatch('--ub-color-surface', 'Base surface'),
        swatch('--ub-color-surface-dim', 'Dim'),
        swatch('--ub-color-surface-container-lowest', 'Container lowest'),
        swatch('--ub-color-surface-container-low', 'Container low'),
        swatch('--ub-color-surface-container', 'Container'),
        swatch('--ub-color-surface-container-high', 'Container high'),
        swatch('--ub-color-surface-container-highest', 'Container highest'),
      ]))}
      {section('On-Surface & Outline', grid([
        swatch('--ub-color-on-surface', 'Primary text (#131b2e)'),
        swatch('--ub-color-on-surface-variant', 'Muted text'),
        swatch('--ub-color-outline', 'Outline'),
        swatch('--ub-color-outline-variant', 'Outline variant'),
        swatch('--ub-ghost-border', 'Ghost border (15% opacity)'),
      ]))}
      {section('Glass & Gradients', (
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 200, height: 80, borderRadius: 12, background: 'var(--ub-glass-bg)', backdropFilter: 'blur(var(--ub-glass-blur))', border: '0.5px solid var(--ub-ghost-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-surface-variant)' }}>Glass surface</div>
          <div style={{ width: 200, height: 80, borderRadius: 12, background: 'var(--ub-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-primary)' }}>Primary gradient</div>
        </div>
      ))}
      {section('Shadows', (
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 140, height: 80, borderRadius: 12, background: 'var(--ub-color-surface)', boxShadow: 'var(--ub-shadow-ambient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-surface-variant)' }}>Ambient</div>
          <div style={{ width: 140, height: 80, borderRadius: 12, background: 'var(--ub-color-surface)', boxShadow: 'var(--ub-shadow-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--ub-font-mono)', color: 'var(--ub-color-on-surface-variant)' }}>Elevated</div>
        </div>
      ))}
    </div>
  ),
}

/* ── Typography story ── */

export const Typography: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--ub-font-body)', maxWidth: 800 }}>
      {section('Display (Manrope)', (
        <>
          {typeRow('Display Large', '--ub-font-display', '--ub-text-display-lg', 700, '--ub-tracking-display')}
          {typeRow('Display Medium', '--ub-font-display', '--ub-text-display-md', 700, '--ub-tracking-display')}
          {typeRow('Display Small', '--ub-font-display', '--ub-text-display-sm', 700, '--ub-tracking-display')}
        </>
      ))}
      {section('Headlines (Manrope)', (
        <>
          {typeRow('Headline Large', '--ub-font-display', '--ub-text-headline-lg', 600, '--ub-tracking-headline')}
          {typeRow('Headline Medium', '--ub-font-display', '--ub-text-headline-md', 600, '--ub-tracking-headline')}
          {typeRow('Headline Small', '--ub-font-display', '--ub-text-headline-sm', 600, '--ub-tracking-headline')}
        </>
      ))}
      {section('Titles (Inter)', (
        <>
          {typeRow('Title Large', '--ub-font-body', '--ub-text-title-lg', 500)}
          {typeRow('Title Medium', '--ub-font-body', '--ub-text-title-md', 500)}
          {typeRow('Title Small', '--ub-font-body', '--ub-text-title-sm', 500)}
        </>
      ))}
      {section('Body (Inter)', (
        <>
          {typeRow('Body Large', '--ub-font-body', '--ub-text-body-lg', 400)}
          {typeRow('Body Medium', '--ub-font-body', '--ub-text-body-md', 400)}
          {typeRow('Body Small', '--ub-font-body', '--ub-text-body-sm', 400)}
        </>
      ))}
      {section('Labels (Inter — regulatory document feel)', (
        <>
          <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 'var(--ub-text-label-lg)', fontWeight: 600, letterSpacing: 'var(--ub-tracking-label)', textTransform: 'uppercase', color: 'var(--ub-color-on-surface)', marginBottom: 4 }}>LABEL LARGE — SECTION HEADERS</div>
          <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 'var(--ub-text-label-md)', fontWeight: 600, letterSpacing: 'var(--ub-tracking-label)', textTransform: 'uppercase', color: 'var(--ub-color-on-surface-variant)', marginBottom: 4 }}>LABEL MEDIUM — METADATA</div>
          <div style={{ fontFamily: 'var(--ub-font-body)', fontSize: 'var(--ub-text-label-sm)', fontWeight: 600, letterSpacing: 'var(--ub-tracking-label)', textTransform: 'uppercase', color: 'var(--ub-color-on-surface-variant)' }}>LABEL SMALL — STATUS TAGS</div>
          <div style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 11, color: 'var(--ub-color-on-surface-variant)', marginTop: 8 }}>--ub-tracking-label: 0.05em · uppercase · font-weight 600</div>
        </>
      ))}
      {section('Monospace', (
        <div style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 13, color: 'var(--ub-color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
          sk_demo_EXAMPLE_0f2a · €12,847.00 · 2026-04-14T14:32:08.441Z
          <div style={{ fontSize: 10, color: 'var(--ub-color-on-surface-variant)', marginTop: 4, fontFamily: 'var(--ub-font-body)' }}>--ub-font-mono · tabular-nums for aligned numbers</div>
        </div>
      ))}
    </div>
  ),
}

/* ── Spacing story ── */

export const Spacing: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--ub-font-body)', maxWidth: 600 }}>
      {section('Spacing Scale', (
        <>
          {spacingBar('--ub-space-1', '0.25rem (4px)')}
          {spacingBar('--ub-space-2', '0.5rem (8px)')}
          {spacingBar('--ub-space-3', '0.75rem (12px)')}
          {spacingBar('--ub-space-4', '1rem (16px)')}
          {spacingBar('--ub-space-5', '1.25rem (20px)')}
          {spacingBar('--ub-space-6', '1.5rem (24px)')}
          {spacingBar('--ub-space-8', '2rem (32px)')}
          {spacingBar('--ub-space-10', '2.5rem (40px)')}
          {spacingBar('--ub-space-12', '3rem (48px)')}
          {spacingBar('--ub-space-16', '4rem (64px)')}
          {spacingBar('--ub-space-20', '5rem (80px)')}
        </>
      ))}
      {section('Border Radius', grid([
        radiusSample('--ub-radius-sm', '0.25rem — inputs'),
        radiusSample('--ub-radius-md', '0.375rem — buttons'),
        radiusSample('--ub-radius-lg', '0.5rem — cards, buttons'),
        radiusSample('--ub-radius-xl', '0.75rem — outer containers'),
        radiusSample('--ub-radius-full', '9999px — pills, avatars'),
      ]))}
      {section('Transitions', (
        <div style={{ display: 'flex', gap: 16 }}>
          {['--ub-transition-fast', '--ub-transition-base', '--ub-transition-slow'].map((t) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, background: 'var(--ub-color-surface-container-high)', transition: `background-color var(${t}), transform var(${t})`, cursor: 'pointer' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--ub-color-primary)'; (e.target as HTMLElement).style.transform = 'scale(1.1)' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'var(--ub-color-surface-container-high)'; (e.target as HTMLElement).style.transform = 'scale(1)' }} />
              <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 10, color: 'var(--ub-color-on-surface-variant)' }}>{t.replace('--ub-transition-', '')}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}

/* ── Design Rules story ── */

export const DesignRules: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--ub-font-body)', maxWidth: 700, fontSize: 13, color: 'var(--ub-color-on-surface)', lineHeight: 1.7 }}>
      {section('The "No-Line" Rule', (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, padding: 16, background: 'var(--ub-color-surface)', borderRadius: 'var(--ub-radius-xl)' }}>
            <div style={{ padding: 12, background: 'var(--ub-color-surface-container-low)', borderRadius: 'var(--ub-radius-lg)', marginBottom: 8, fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Section A — surface-container-low</div>
            <div style={{ padding: 12, background: 'var(--ub-color-surface-container-highest)', borderRadius: 'var(--ub-radius-lg)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Section B — surface-container-highest</div>
            <div style={{ fontSize: 10, color: 'var(--ub-color-tertiary-fixed)', marginTop: 8, fontWeight: 500 }}>{'\u2713'} Boundaries via background shifts</div>
          </div>
          <div style={{ flex: 1, padding: 16, background: 'var(--ub-color-surface)', borderRadius: 'var(--ub-radius-xl)' }}>
            <div style={{ padding: 12, border: '1px solid var(--ub-color-outline)', borderRadius: 'var(--ub-radius-lg)', marginBottom: 8, fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Section A — bordered</div>
            <div style={{ padding: 12, border: '1px solid var(--ub-color-outline)', borderRadius: 'var(--ub-radius-lg)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Section B — bordered</div>
            <div style={{ fontSize: 10, color: 'var(--ub-color-error)', marginTop: 8, fontWeight: 500 }}>{'\u2717'} 1px borders for sectioning</div>
          </div>
        </div>
      ))}
      {section('Concentric Radius Rhythm', (
        <div style={{ padding: 20, background: 'var(--ub-color-surface-container-low)', borderRadius: 'var(--ub-radius-xl)' }}>
          <div style={{ fontSize: 10, color: 'var(--ub-color-on-surface-variant)', marginBottom: 8, fontFamily: 'var(--ub-font-mono)' }}>Outer: --ub-radius-xl (0.75rem)</div>
          <div style={{ padding: 14, background: 'var(--ub-color-surface)', borderRadius: 'var(--ub-radius-lg)' }}>
            <div style={{ fontSize: 10, color: 'var(--ub-color-on-surface-variant)', fontFamily: 'var(--ub-font-mono)' }}>Nested: --ub-radius-lg (0.5rem)</div>
          </div>
        </div>
      ))}
      {section('Press Feedback', (
        <button type="button" style={{ padding: '8px 20px', background: 'var(--ub-gradient-primary)', color: 'var(--ub-color-on-primary)', border: 'none', borderRadius: 'var(--ub-radius-lg)', fontFamily: 'var(--ub-font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'transform 120ms ease' }} onMouseDown={(e) => { (e.target as HTMLElement).style.transform = 'scale(0.98)' }} onMouseUp={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)' }}>
          Click me — scale(0.98) on :active
        </button>
      ))}
      {section('Ghost Border Fallback', (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ padding: 16, borderRadius: 'var(--ub-radius-lg)', outline: '1px solid var(--ub-ghost-border)', fontSize: 12, color: 'var(--ub-color-on-surface-variant)' }}>Ghost border (15% opacity)</div>
          <span style={{ fontFamily: 'var(--ub-font-mono)', fontSize: 10, color: 'var(--ub-color-on-surface-variant)' }}>--ub-ghost-border: rgba(198,198,205,0.15)</span>
        </div>
      ))}
    </div>
  ),
}
