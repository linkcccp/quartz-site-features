# @linkcccp/quartz-site-features

Site-specific plugins for Quartz v5. The package is designed to be installed
independently of Quartz's core source, so upstream updates do not overwrite the
plugin implementation.

## Install

```sh
pnpm add @linkcccp/quartz-site-features
```

Add the package to `quartz.config.yaml`:

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

Then register the installed npm plugin with Quartz:

```sh
npx quartz plugin install --from-config
```

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

## Local development and publishing

Build the distributable bundle with:

```sh
pnpm run build
```

The npm tarball contains the prebuilt `dist/` bundle, package metadata, README,
and license.
Before publishing, ensure the `@linkcccp` npm scope is controlled by the
publisher and run `npm pack --dry-run` to review the package contents.
