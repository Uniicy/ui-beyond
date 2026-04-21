# Changelog

All notable changes to `@uniicy/ui-beyond` are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added

- Storybook autodocs for all 94+ components (auto-generated from TypeScript types).
- JSDoc descriptions for flagship primitives (Button, Badge, Avatar, Checkbox, IconButton, KpiCard, Stack, Split, Surface, EmptyState, ProgressBar, StatusDot, TabBar, Pagination, SectionTitle, FilterChip, SlideInPanel).
- `Introduction` and `Getting Started` MDX pages in Storybook.
- `@storybook/addon-docs` configured with `react-docgen-typescript`.
- Standalone Storybook Docker image (nginx-based).
- Kubernetes manifests for `storybook.staging.uniicy.com` staging deployment.
- GitHub Actions workflow `publish.yml` for GitHub Packages releases on tag.
- GitHub Actions workflow `deploy-staging.yaml` for Storybook staging deploys.

### Changed

- Package flipped from `private: true` to publishable via GitHub Packages (`@uniicy` scope).

## [0.1.0] - 2026-04-13

### Added

- Initial component library scaffold (94 components).
- Compliance-as-Code design tokens and theming.
- Storybook 10 with Vite.
- `tsup` library build with ESM + CJS dual output and `.d.ts` declarations.
