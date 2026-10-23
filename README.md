# @linkcccp/quartz-site-features

Site-specific plugins for Quartz v5. The package is designed to be installed
independently of Quartz's core source, so upstream updates do not overwrite the
plugin implementation.

## Install from GitHub

These instructions install the plugin directly from its public GitHub
repository, not from a package registry, so no registry login is needed.

Add the plugin to the `plugins` list in your Quartz `quartz.config.yaml`:

```yaml
plugins:
  - source: "github:linkcccp/quartz-site-features#main"
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

From the root of your Quartz site, install the configured GitHub plugin:

```sh
npx quartz plugin install --from-config
```

The `main` ref follows the latest commit on the plugin repository. To update an
already installed copy, run:

```sh
npx quartz plugin install --latest
```

Quartz clones the public repository, including its prebuilt `dist/` bundle.
GitHub authentication is not required for this public repository, and the
plugin installation does not need to build the plugin locally.

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

After changing plugin source, rebuild `dist/` and commit the generated bundle
with the source changes so Quartz installations use the matching version.
