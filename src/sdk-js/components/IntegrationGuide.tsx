import { useState, type ReactNode } from 'react'
import styles from './IntegrationGuide.module.css'

export interface IntegrationGuideProps {
  readonly packageName?: string
  readonly version?: string
}

type Language = 'bash' | 'ts' | 'tsx' | 'css' | 'html'

interface Snippet {
  readonly language: Language
  readonly code: string
}

interface Section {
  readonly id: string
  readonly title: string
  readonly body: ReactNode
  readonly snippets?: readonly Snippet[]
}

/* ── Code samples ─────────────────────────────────── */

const installSnippet = (pkg: string): Snippet => ({
  language: 'bash',
  code: `bun add ${pkg}
# or: pnpm add ${pkg}
# or: npm install ${pkg}`,
})

const importTokensSnippet = (pkg: string): Snippet => ({
  language: 'ts',
  code: `// Import ONCE, at your app entry point.
// Tokens define every colour, spacing and radius used by the widgets.
import '${pkg}/sdk-js/tokens.css'`,
})

const mountSnippet = (pkg: string): Snippet => ({
  language: 'tsx',
  code: `import { useState } from 'react'
import { KycUploadWidget, type KycUploadState } from '${pkg}/sdk-js'

export function PlayerKyc({ playerEmail }: { playerEmail: string }) {
  const [state, setState] = useState<KycUploadState>('prompt')

  return (
    <KycUploadWidget
      state={state}
      playerEmail={playerEmail}
      onStart={() => setState('upload')}
      onFileUpload={async (file) => {
        setState('processing')
        const res = await uploadToKycProvider(file)
        setState(res.outcome) // 'approved' | 'rejected' | 'manual_review'
      }}
      onRetry={() => setState('upload')}
      onContactSupport={() => window.open('mailto:support@your-brand.com')}
    />
  )
}`,
})

const tokenOverrideSnippet: Snippet = {
  language: 'css',
  code: `/* brand-overrides.css — imported AFTER the SDK tokens */

:root {
  /* Accent & CTAs */
  --sdk-primary: #6d28d9;
  --sdk-primary-text: #6d28d9;
  --sdk-primary-dim: rgba(109, 40, 217, 0.08);

  /* Surfaces */
  --sdk-bg: #fafafa;
  --sdk-bg-secondary: #f3f3f5;
  --sdk-border: #e4e4e7;
  --sdk-border-strong: #d4d4d8;

  /* Typography */
  --sdk-font: 'Satoshi', system-ui, sans-serif;
  --sdk-text-base: 14px;

  /* Shape */
  --sdk-radius-md: 10px;
  --sdk-radius-lg: 20px;
  --sdk-widget-width: 440px;

  /* Semantic colours */
  --sdk-success: #10b981;
  --sdk-danger:  #ef4444;
  --sdk-warning: #f59e0b;
}`,
}

const darkModeSnippet: Snippet = {
  language: 'tsx',
  code: `<div data-theme="dark">
  <KycUploadWidget state="prompt" />
</div>`,
}

const perWidgetSnippet: Snippet = {
  language: 'tsx',
  code: `// Every widget accepts content props to override defaults.

<KycUploadWidget
  state="rejected"
  rejectionReason="The document expires within 3 months. Please upload a newer one."
  playerEmail="player@example.com"
  providerName="Acme Sportsbook"
/>

<WidgetLimitBar
  label="Monthly deposit"
  used={420}
  limit={1000}
  currency="EUR"
  source="self"
  periodResetLabel="Resets 1 May"
  canChange
  onChangeClick={openLimitEditor}
/>`,
}

const cdnSnippet: Snippet = {
  language: 'html',
  code: `<!-- Non-React host (CMS, PHP page, legacy stack) -->
<link rel="stylesheet" href="https://cdn.uniicy.com/sdk-js/latest/tokens.css" />
<div id="kyc-widget" data-theme="light"></div>
<script type="module">
  import { mountKycUploadWidget } from 'https://cdn.uniicy.com/sdk-js/latest/sdk.mjs'

  mountKycUploadWidget('#kyc-widget', {
    state: 'prompt',
    playerEmail: 'player@example.com',
    onStart: () => console.log('verification started'),
  })
</script>`,
}

/* ── Callback table ────────────────────────────────── */

const CALLBACKS: readonly { prop: string; fires: string }[] = [
  { prop: 'onStart', fires: '"Start verification" clicked in the prompt state.' },
  { prop: 'onFileUpload(file)', fires: 'User confirmed a document file in the upload state.' },
  { prop: 'onDocumentTypeChange(type)', fires: 'User picks passport / id_card / driving_licence.' },
  { prop: 'onRetry', fires: '"Try again" clicked in the rejected state.' },
  { prop: 'onContactSupport', fires: '"Contact support" clicked in the rejected state.' },
]

/* ── CodeBlock helper ─────────────────────────────── */

function CodeBlock({ snippet }: { snippet: Snippet }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (typeof navigator === 'undefined' || navigator.clipboard === undefined) return
    navigator.clipboard.writeText(snippet.code).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      },
      () => {
        /* silently ignore clipboard rejection */
      },
    )
  }

  return (
    <div className={styles['codeBlock']}>
      <div className={styles['codeHeader']}>
        <span className={styles['codeLang']}>{snippet.language}</span>
        <button type="button" className={styles['codeCopy']} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles['codePre']}>
        <code>{snippet.code}</code>
      </pre>
    </div>
  )
}

/* ── Component ────────────────────────────────────── */

export function IntegrationGuide({
  packageName = '@uniicy/ui-beyond',
  version = '0.1.0',
}: IntegrationGuideProps) {
  const sections: readonly Section[] = [
    {
      id: 'overview',
      title: '1. Overview',
      body: (
        <>
          <p className={styles['copy']}>
            <code className={styles['inline']}>{packageName}/sdk-js</code> is an
            embeddable React widget library for identity verification, limits and
            responsible-gaming flows. Every widget is token-themeable, works in
            light &amp; dark mode, and renders a mandatory "Powered by Identity
            Beyond" attribution that cannot be removed.
          </p>
          <p className={styles['copy']}>
            Current version: <code className={styles['inline']}>{version}</code>.
          </p>
        </>
      ),
    },
    {
      id: 'install',
      title: '2. Install',
      body: (
        <p className={styles['copy']}>
          Install from your package manager of choice. Peer dependencies:{' '}
          <code className={styles['inline']}>react &gt;= 18</code>,{' '}
          <code className={styles['inline']}>react-dom &gt;= 18</code>.
        </p>
      ),
      snippets: [installSnippet(packageName)],
    },
    {
      id: 'tokens',
      title: '3. Load the design tokens',
      body: (
        <p className={styles['copy']}>
          The widgets render transparently — all visual properties come from CSS
          custom properties (<code className={styles['inline']}>--sdk-*</code>).
          Load the token stylesheet once at the top of your app. Without it the
          widgets render unstyled.
        </p>
      ),
      snippets: [importTokensSnippet(packageName)],
    },
    {
      id: 'mount',
      title: '4. Mount a widget',
      body: (
        <p className={styles['copy']}>
          Drive the widget state from your app. The KYC widget transitions through
          six states; typically you control them in response to backend responses.
        </p>
      ),
      snippets: [mountSnippet(packageName)],
    },
    {
      id: 'callbacks',
      title: '5. Callbacks',
      body: (
        <>
          <p className={styles['copy']}>
            Widgets are headless with respect to business logic — you decide what
            happens on every user action.
          </p>
          <table className={styles['callbackTable']}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Fires when</th>
              </tr>
            </thead>
            <tbody>
              {CALLBACKS.map((row) => (
                <tr key={row.prop}>
                  <td>
                    <code className={styles['inline']}>{row.prop}</code>
                  </td>
                  <td>{row.fires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ),
    },
    {
      id: 'per-widget',
      title: '6. Per-widget customization',
      body: (
        <p className={styles['copy']}>
          Override copy, behaviour and content via props. See the stories under{' '}
          <code className={styles['inline']}>SDK/</code> in this Storybook for the
          full surface of each widget.
        </p>
      ),
      snippets: [perWidgetSnippet],
    },
    {
      id: 'tokens-override',
      title: '7. Customize tokens (recommended)',
      body: (
        <>
          <p className={styles['copy']}>
            Any <code className={styles['inline']}>--sdk-*</code> variable can be
            re-declared after the SDK tokens are imported. This is the cleanest way
            to brand the widgets — no CSS specificity wars, no component re-styling,
            no JavaScript changes.
          </p>
          <p className={styles['copyMuted']}>
            Full token reference:{' '}
            <code className={styles['inline']}>sdk-js/tokens.css</code>.
          </p>
        </>
      ),
      snippets: [tokenOverrideSnippet],
    },
    {
      id: 'dark-mode',
      title: '8. Light & dark mode',
      body: (
        <p className={styles['copy']}>
          All tokens have a dark-theme variant. Wrap the widget (or an ancestor) in
          an element with <code className={styles['inline']}>data-theme="dark"</code>
          . Tokens switch automatically.
        </p>
      ),
      snippets: [darkModeSnippet],
    },
    {
      id: 'non-react',
      title: '9. Non-React hosts (preview)',
      body: (
        <p className={styles['copy']}>
          A thin vanilla JS loader is planned to allow mounting widgets from any
          page. The call signature will match the React prop surface 1-to-1.
        </p>
      ),
      snippets: [cdnSnippet],
    },
    {
      id: 'branding',
      title: '10. Branding attribution (non-removable)',
      body: (
        <div className={styles['warnBox']}>
          <div className={styles['warnTitle']}>Compliance requirement</div>
          <p className={styles['copy']}>
            Every widget renders a 9px "Powered by Identity Beyond" row at the
            bottom of the card. This is part of the vendor attribution contract and
            cannot be hidden via props, className, or CSS override. Any override
            attempt will be reverted in a future release.
          </p>
        </div>
      ),
    },
  ]

  return (
    <article className={styles['guide']} aria-label="SDK integration guide">
      <header className={styles['header']}>
        <div className={styles['eyebrow']}>Identity Beyond · SDK-JS</div>
        <h1 className={styles['heading']}>Integration guide</h1>
        <p className={styles['lede']}>
          Install, mount, and style the embeddable widgets in under ten minutes.
        </p>
      </header>

      <nav className={styles['toc']} aria-label="Table of contents">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={styles['tocLink']}>
            {s.title}
          </a>
        ))}
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className={styles['section']}>
          <h2 className={styles['sectionTitle']}>{s.title}</h2>
          {s.body}
          {s.snippets?.map((snippet, i) => (
            <CodeBlock key={`${s.id}-${i}`} snippet={snippet} />
          ))}
        </section>
      ))}
    </article>
  )
}
