# @uniicy/ui-beyond

Compliance-as-Code design system and React component library for Uniicy iGaming platforms.

94+ production components spanning KYC, AML, risk, transactions, alerts, admin UIs, and layout primitives.

## Storybook

Live: https://storybook.staging.uniicy.com

Staging is behind basic auth (user `admin`). Password stored in
`k8s/staging/basic-auth-secret.yaml` — rotate via `htpasswd -nbB admin <pw>`.

## Install

This package is published to **GitHub Packages**. Configure auth first.

### 1. Create `.npmrc` in your project root

```ini
@uniicy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
always-auth=true
```

### 2. Export a GitHub token with `read:packages` scope

```sh
export GITHUB_TOKEN=ghp_xxx
```

Create one at https://github.com/settings/tokens (classic) or https://github.com/settings/personal-access-tokens (fine-grained).

### 3. Install

```sh
bun add @uniicy/ui-beyond
# or
pnpm add @uniicy/ui-beyond
# or
npm install @uniicy/ui-beyond
```

## Use

```tsx
import '@uniicy/ui-beyond/styles'
import { Button, Badge, ThemeProvider } from '@uniicy/ui-beyond'

export function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Verify Identity</Button>
      <Badge variant="approved" dot />
    </ThemeProvider>
  )
}
```

### CI (GitHub Actions)

```yaml
- uses: actions/setup-node@v4
  with:
    registry-url: https://npm.pkg.github.com
    scope: '@uniicy'
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Peer dependencies

- `react >= 18`
- `react-dom >= 18`

## Development

```sh
bun install
bun run storybook       # dev server on :6006
bun run build           # build library (dist/)
bun run build-storybook # build static storybook (storybook-static/)
bun run typecheck
```

### Publishing

Publish happens automatically on pushed tag `v*.*.*`:

```sh
# bump version
npm version patch          # or minor / major
git push --follow-tags
```

The `publish.yml` workflow builds and publishes to GitHub Packages.

### Deploying Storybook

Push to `main` — `.github/workflows/deploy-staging.yaml` builds the Docker image, pushes to the Uniicy staging registry, and rolls out to the k3s cluster.

Domain: `storybook.staging.uniicy.com`

## License

UNLICENSED — internal use only.
