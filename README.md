# @linkcccp/quartz-site-features

Site-specific plugins for Quartz v5. The package is designed to be installed
independently of Quartz's core source, so upstream updates do not overwrite the
plugin implementation.

## Install from GitHub Packages

This project publishes to GitHub Packages rather than npmjs.org. Configure the
GitHub npm registry for the `@linkcccp` scope in your Quartz project's `.npmrc`:

```ini
@linkcccp:registry=https://npm.pkg.github.com
```

Install it from the Quartz project root:

```sh
pnpm add @linkcccp/quartz-site-features
```

GitHub Packages may require a GitHub classic personal access token with
`read:packages` permission to install packages, depending on package visibility
and the client environment. Do not commit the token; use an environment
variable or user-level npm configuration.

Add the plugin to the `plugins` list in your Quartz `quartz.config.yaml`:

```yaml
plugins:
  - source: "@linkcccp/quartz-site-features"
    enabled: true
    options:
      enabled: true
      name: "My Digital Garden"
      shortName: Garden
      description: A personal digital garden
      themeColor: "#284b63"
      backgroundColor: "#faf8f8"
      threshold: 180
    layout:
      position: beforeBody
      priority: 25
```

From the root of your Quartz site, register the configured package with Quartz:

```sh
npx quartz plugin install --from-config
```

To update to the latest published package version, run:

```sh
pnpm update @linkcccp/quartz-site-features
```

The GitHub repository remains the source of truth. This package is a versioned
distribution and does not automatically follow the repository's `main` branch.

## Features

- **StaleNotice**: `stale: false` suppresses the notice; `stale: true` always
  shows it. When unset or `default`, the notice is shown after the configured
  threshold (180 days by default) since the last modified date.
- **PWA emitter**: emits a web app manifest, resized icons, and a revisioned
  Workbox service worker. It also registers the worker and enhances the
  official RecentNotes component with a collapsible, accessible heading.
- **Theme CSS**: injects the site's Fluent 2 tokens and typography, spacing,
  callout, code, media, and RecentNotes styles without patching Quartz core.

The package consumes Quartz's provided `preact` and `sharp` dependencies as
peer dependencies. Keep the Quartz theme and site configuration in your own
site repository; the package intentionally does not patch Quartz core files.

## Local development

Install dependencies, build the plugin, and run its checks:

```sh
pnpm install
pnpm run build
pnpm run test
pnpm run typecheck
```

The GitHub Actions workflow publishes the built package to GitHub Packages.
Before publishing a new release, update the version in `package.json`.
