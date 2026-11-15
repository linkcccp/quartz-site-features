// src/pwa.ts
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { h } from "preact";

// src/themeStyles.ts
var themeStyles = `
:root {
  --radius-none: 0;
  --radius-small: 2px;
  --radius-medium: 4px;
  --radius-large: 8px;
  --radius-xlarge: 12px;
  --elevation-2: 0 0 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14);
  --elevation-4: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14);
  --elevation-8: 0 0 2px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.14);
  --elevation-16: 0 0 2px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.14);
  --fluent-brand: #0f6cbd;
  --fluent-brand-hover: #115ea3;
  --fluent-brand-pressed: #0c3b5e;
  --fluent-duration-short: 120ms;
  --fluent-duration-normal: 180ms;
  --fluent-easing: cubic-bezier(0.33, 0, 0.67, 1);
}

html:root:not([saved-theme="dark"]) {
  color-scheme: light;
  --light: #f5f5f5;
  --lightgray: #d1d1d1;
  --gray: #616161;
  --darkgray: #242424;
  --dark: #1a1a1a;
  --secondary: #0f6cbd;
  --tertiary: #115ea3;
  --highlight: rgba(15, 108, 189, 0.1);
  --textHighlight: rgba(255, 241, 0, 0.45);
  --titleFont: "Segoe UI Variable Display", "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI",
    sans-serif;
  --headerFont: "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", sans-serif;
  --bodyFont: "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif;
  --codeFont: "Cascadia Code", "Cascadia Mono", Consolas, monospace;
  --fluent-surface-1: #ffffff;
  --fluent-surface-2: #faf9f8;
  --fluent-surface-3: #f0f0f0;
  --fluent-stroke-1: #d1d1d1;
  --fluent-stroke-2: #e0e0e0;
  --fluent-shadow-2: 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 2px rgba(0, 0, 0, 0.06);
  --fluent-shadow-8: 0 4px 8px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.08);
}

html:root[saved-theme="dark"] {
  color-scheme: dark;
  --light: #1b1a19;
  --lightgray: #424242;
  --gray: #adadad;
  --darkgray: #f5f5f5;
  --dark: #ffffff;
  --secondary: #479ef5;
  --tertiary: #62abf5;
  --highlight: rgba(71, 158, 245, 0.16);
  --textHighlight: rgba(255, 235, 59, 0.32);
  --titleFont: "Segoe UI Variable Display", "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI",
    sans-serif;
  --headerFont: "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", sans-serif;
  --bodyFont: "Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif;
  --codeFont: "Cascadia Code", "Cascadia Mono", Consolas, monospace;
  --fluent-brand: #479ef5;
  --fluent-brand-hover: #62abf5;
  --fluent-brand-pressed: #2886de;
  --fluent-surface-1: #242424;
  --fluent-surface-2: #292929;
  --fluent-surface-3: #333333;
  --fluent-stroke-1: #424242;
  --fluent-stroke-2: #383838;
  --fluent-shadow-2: 0 1px 2px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.18);
  --fluent-shadow-8: 0 4px 8px rgba(0, 0, 0, 0.36), 0 0 2px rgba(0, 0, 0, 0.2);
}

html {
  accent-color: var(--fluent-brand);
}

::selection {
  background: color-mix(in srgb, var(--fluent-brand) 24%, transparent);
  color: var(--darkgray);
}

.page > #quartz-body {
  gap: 8px;
}

.page > #quartz-body .sidebar {
  padding-top: 5rem;
}

.page > #quartz-body .page-header {
  margin-top: 5rem;
}

@media all and (max-width: 800px) {
  .page > #quartz-body .sidebar {
    padding-top: 2rem;
  }

  .page > #quartz-body .page-header {
    margin-top: 0;
  }
}

.page > #quartz-body > .center {
  min-width: 0;
}

.page > #quartz-body > .center > .page-header,
.page > #quartz-body > .center > article.popover-hint {
  box-sizing: border-box;
  border: 1px solid var(--fluent-stroke-2);
  border-radius: var(--radius-large);
  background: var(--fluent-surface-1);
  box-shadow: var(--fluent-shadow-2);
}

.page > #quartz-body > .center > .page-header {
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.page > #quartz-body > .center > article.popover-hint {
  padding: 1.5rem 2rem;
}

.page > #quartz-body .sidebar .explorer,
.page > #quartz-body .sidebar .recent-notes,
.page > #quartz-body .sidebar .toc,
.page > #quartz-body .sidebar .graph,
.page > #quartz-body .sidebar .backlinks {
  box-sizing: border-box;
  padding: 0.875rem;
  border: 1px solid var(--fluent-stroke-2);
  border-radius: var(--radius-large);
  background: var(--fluent-surface-1);
  box-shadow: var(--fluent-shadow-2);
}

.page > #quartz-body .sidebar button:not(.recent-notes-toggle),
.page > #quartz-body .center button,
.page > #quartz-body .graph button {
  min-height: 2.25rem;
  border: 1px solid var(--fluent-stroke-1);
  border-radius: var(--radius-medium);
  background: var(--fluent-surface-2);
  color: var(--darkgray);
  font: inherit;
  transition:
    background-color var(--fluent-duration-short) var(--fluent-easing),
    border-color var(--fluent-duration-short) var(--fluent-easing),
    color var(--fluent-duration-short) var(--fluent-easing);
}

.page > #quartz-body .sidebar button:not(.recent-notes-toggle):hover,
.page > #quartz-body .center button:hover,
.page > #quartz-body .graph button:hover {
  border-color: var(--fluent-stroke-1);
  background: var(--fluent-surface-3);
}

.page > #quartz-body .sidebar button:not(.recent-notes-toggle):active,
.page > #quartz-body .center button:active,
.page > #quartz-body .graph button:active {
  background: var(--highlight);
}

.page > #quartz-body .sidebar .explorer-toggle,
.page > #quartz-body .sidebar .toc-header {
  width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.page > #quartz-body .sidebar .search-button {
  padding: 0.4rem 0.75rem;
  text-align: left;
}

.page > #quartz-body .sidebar input.search-bar {
  box-sizing: border-box;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--fluent-stroke-1);
  border-radius: var(--radius-medium);
  background: var(--fluent-surface-1);
  color: var(--darkgray);
  font: inherit;
}

.page > #quartz-body .sidebar input.search-bar:hover {
  border-color: var(--gray);
}

.page > #quartz-body .sidebar input.search-bar:focus {
  border-color: var(--fluent-brand);
  outline: 2px solid color-mix(in srgb, var(--fluent-brand) 25%, transparent);
  outline-offset: 0;
}

.page > #quartz-body .sidebar .recent-notes-toggle {
  min-height: 2.25rem;
  border-radius: var(--radius-medium);
  font-weight: 600;
}

.page > #quartz-body .sidebar .recent-notes-toggle:hover {
  background: var(--fluent-surface-2);
}

.page > #quartz-body .sidebar .recent-ul a:hover,
.page > #quartz-body .sidebar .explorer a:hover,
.page > #quartz-body .sidebar .toc a:hover {
  border-radius: var(--radius-small);
  background: var(--fluent-surface-2);
  text-decoration: none;
}

.page > #quartz-body .center h1,
.page > #quartz-body .center h2,
.page > #quartz-body .center h3,
.page > #quartz-body .center h4,
.page > #quartz-body .center h5,
.page > #quartz-body .center h6 {
  font-weight: 600;
  letter-spacing: -0.015em;
}

.page > #quartz-body .center a {
  transition:
    color var(--fluent-duration-normal) var(--fluent-easing),
    background-color var(--fluent-duration-normal) var(--fluent-easing);
}

.page > #quartz-body .center a:hover {
  color: var(--fluent-brand-hover);
}

.page > #quartz-body .center a.internal {
  padding: 0;
  background: transparent;
}

.page > #quartz-body .center blockquote:not(.callout) {
  padding: 0.75rem 1rem;
  border: 1px solid var(--fluent-stroke-2);
  border-left: 3px solid var(--fluent-brand);
  border-radius: var(--radius-medium);
  background: var(--fluent-surface-2);
}

.page > #quartz-body .center .callout {
  border-radius: var(--radius-large);
  box-shadow: var(--fluent-shadow-2);
}

.page > #quartz-body .center .callout-title {
  padding: 0.875rem 0;
  font-weight: 600;
}

.page > #quartz-body .center table {
  border: 1px solid var(--fluent-stroke-2);
  border-collapse: separate;
  border-spacing: 0;
  border-radius: var(--radius-medium);
  background: var(--fluent-surface-1);
}

.page > #quartz-body .center th,
.page > #quartz-body .center td {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--fluent-stroke-2);
}

.page > #quartz-body .center th {
  background: var(--fluent-surface-2);
  font-weight: 600;
}

.page > #quartz-body .center tbody tr:hover {
  background: var(--fluent-surface-2);
}

.page > #quartz-body .center pre {
  border: 1px solid var(--fluent-stroke-2);
  border-radius: var(--radius-large);
  box-shadow: var(--fluent-shadow-2);
}

.page > #quartz-body .center code {
  border-radius: var(--radius-small);
}

.page > #quartz-body .center hr {
  border: 0;
  border-top: 1px solid var(--fluent-stroke-2);
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--fluent-brand);
  outline-offset: 2px;
}

strong,
.callout-title-inner {
  font-weight: 500;
}

a {
  font-weight: 500;
  transition: color 200ms ease-in-out;
}

a:hover {
  text-decoration: underline;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
.recent-notes-toggle:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
  border-radius: var(--radius-small);
}

a.internal {
  background-color: transparent;
  border-radius: var(--radius-medium);
}

a.internal:hover {
  text-decoration: underline;
}

a.internal.broken {
  transition: opacity 200ms ease-in-out;
}

a.external .external-icon > path {
  fill: var(--secondary);
}

.text-highlight {
  border-radius: var(--radius-medium);
}

input[type="checkbox"] {
  border-radius: var(--radius-small);
}

blockquote {
  border-left-width: 4px;
  transition: border-color 200ms ease-in-out;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  transition: opacity 200ms ease-in-out;
}

.center h1 {
  margin-top: 2.5rem;
}

.center h2 {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.center h3 {
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}

.center h4,
.center h5,
.center h6 {
  margin-bottom: 0.75rem;
}

figure[data-rehype-pretty-code-figure] figcaption {
  border-radius: var(--radius-medium);
}

pre {
  border: none;
  box-shadow: var(--elevation-2);
  border-radius: var(--radius-medium);
}

pre code [data-highlighted-chars] {
  border-radius: var(--radius-medium);
}

code {
  border-radius: var(--radius-small);
}

th {
  padding: 6px 8px;
}

td {
  padding: 6px 8px;
}

img,
audio,
video,
iframe.pdf {
  border-radius: var(--radius-large);
}

.navigation-progress {
  transition: width 300ms ease-in-out;
}

.callout {
  border-radius: var(--radius-medium);
}

.callout > .callout-content {
  transition: grid-template-rows 200ms cubic-bezier(0.02, 0.01, 0.47, 1);
}

.recent-notes > h3 {
  margin: 0.5rem 0 0;
}

.recent-notes .recent-notes-toggle {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: var(--dark);
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
}

.recent-notes .recent-notes-toggle > svg {
  flex: 0 0 auto;
  margin-left: 0.5rem;
  opacity: 0.8;
  transition: transform 300ms ease-in-out;
}

.recent-notes.collapsed > h3 .recent-notes-toggle > svg {
  transform: rotateZ(-90deg);
}

.recent-notes.collapsed > .recent-ul {
  display: none;
}

.recent-notes > .recent-ul {
  max-height: 24rem;
  margin-top: 1rem;
  padding-right: 0.25rem;
  overflow-y: auto;
  list-style: none;
  scrollbar-color: var(--gray) transparent;
  scrollbar-width: thin;
}

.recent-notes > .recent-ul::-webkit-scrollbar {
  width: 6px;
}

.recent-notes > .recent-ul::-webkit-scrollbar-thumb {
  border-radius: var(--radius-small);
  background: var(--gray);
}

.recent-notes > .recent-ul > li {
  margin: 1rem 0;
}

.recent-notes > .recent-ul > li .section > .desc > h3 > a,
.recent-notes > .recent-ul > li .section > .desc > h3 > a:hover {
  background: transparent;
}

.recent-notes > .recent-ul > li .section > .meta {
  margin: 0 0 0.5rem;
  opacity: 0.6;
}

@media (hover: none) {
  .recent-notes-toggle:active {
    opacity: 0.7;
  }
}

@media all and (max-width: 800px) {
  .page > #quartz-body > .center > .page-header {
    padding: 1rem;
  }

  .page > #quartz-body > .center > article.popover-hint {
    padding: 1rem;
  }

  .recent-notes > .recent-ul {
    max-height: none;
    overflow-y: visible;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`;
function getThemeStyles(recentNotesDesktopOnly = false) {
  if (!recentNotesDesktopOnly) return themeStyles;
  return `${themeStyles}
@media all and (max-width: 800px) {
  .recent-notes {
    display: none;
  }
}
`;
}

// src/pwa.ts
import sharp from "sharp";
var defaultOptions = {
  enabled: true,
  name: "Link's Digital Garden",
  shortName: "Garden",
  description: "A personal digital garden built with Quartz",
  themeColor: "#284b63",
  backgroundColor: "#faf8f8",
  recentNotesDesktopOnly: false
};
var serviceWorkerRegistrationScript = `
if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { updateViaCache: "none" })
      .then((registration) => {
        const checkForUpdates = () => {
          if (document.visibilityState !== "visible") return;
          registration
            .update()
            .catch((error) => console.error("Service worker update check failed:", error));
        };
        checkForUpdates();
        window.setInterval(checkForUpdates, 30_000);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") checkForUpdates();
        });
      })
      .catch((error) => console.error("Service worker registration failed:", error));
  });
}
`;
async function writeOutput(ctx, relativePath, content) {
  const outputPath = path.join(ctx.argv.output, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content);
  return outputPath;
}
function escapeHtmlAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function setHtmlAttribute(tag, name, value) {
  const escapedValue = escapeHtmlAttribute(value);
  const attribute = new RegExp(`\\b${name}=(["'])[^"']*\\1`, "i");
  if (attribute.test(tag)) {
    return tag.replace(attribute, `${name}="${escapedValue}"`);
  }
  return tag.replace(/\/?>$/, (close) => ` ${name}="${escapedValue}"${close}`);
}
function insertIntoHead(html, tag) {
  const closingHead = /<\/head>/i;
  if (!closingHead.test(html)) {
    throw new Error("Cannot add homepage SEO metadata: generated HTML has no </head> element");
  }
  return html.replace(closingHead, `${tag}
</head>`);
}
function normalizeHomepageSeo(html, canonicalUrl) {
  const escapedUrl = escapeHtmlAttribute(canonicalUrl);
  let result = html;
  for (const property of ["og:url", "twitter:url"]) {
    const metaTag = new RegExp(
      `<meta\\b(?=[^>]*\\bproperty=["']${property}["'])[^>]*>`,
      "i"
    );
    let found = false;
    result = result.replace(metaTag, (tag) => {
      found = true;
      return setHtmlAttribute(tag, "content", canonicalUrl);
    });
    if (!found) {
      result = insertIntoHead(
        result,
        `<meta property="${property}" content="${escapedUrl}"/>`
      );
    }
  }
  const canonicalTag = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi;
  let canonicalFound = false;
  result = result.replace(canonicalTag, (tag) => {
    if (canonicalFound) return "";
    canonicalFound = true;
    return setHtmlAttribute(tag, "href", canonicalUrl);
  });
  if (!canonicalFound) {
    result = insertIntoHead(result, `<link rel="canonical" href="${escapedUrl}"/>`);
  }
  return result;
}
function getHomepageCanonicalUrl(baseUrl) {
  const url = new URL(`https://${baseUrl}`);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  url.search = "";
  url.hash = "";
  return url.toString();
}
async function collectFiles(root, dir = root) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (dir !== root && error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(root, fullPath);
      if (entry.isFile()) {
        return ["/" + path.relative(root, fullPath).split(path.sep).join("/")];
      }
      return [];
    })
  );
  return nested.flat();
}
function generateServiceWorker(staticFiles, revisions) {
  const buildTimestamp = (/* @__PURE__ */ new Date()).toISOString();
  const precacheFiles = staticFiles.filter(
    (file) => file !== "/_headers" && !/sitemap|robots|service-worker\.js|\.xml$/i.test(file)
  ).map((url) => ({ url, revision: revisions.get(url) ?? buildTimestamp }));
  return `importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');
// Build: ${buildTimestamp}

workbox.routing.registerRoute(
  ({ request, url }) =>
    request.destination === 'document' ||
    url.pathname.endsWith('/static/contentIndex.json'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'quartz-dynamic-${buildTimestamp}',
    plugins: [{
      async handlerDidError({ request }) {
        return workbox.precaching.matchPrecache(request);
      }
    }]
  })
);

workbox.precaching.precacheAndRoute([
  { url: '/', revision: ${JSON.stringify(buildTimestamp)} },
  ...${JSON.stringify(precacheFiles)}
]);

workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'quartz-static-${buildTimestamp}',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((name) =>
          name === 'pages' ||
          name === 'static' ||
          (name.startsWith('quartz-pages-') && name !== 'quartz-pages-${buildTimestamp}') ||
          (name.startsWith('quartz-dynamic-') && name !== 'quartz-dynamic-${buildTimestamp}') ||
          (name.startsWith('quartz-static-') && name !== 'quartz-static-${buildTimestamp}')
        )
        .map((name) => caches.delete(name))
    ))
  ]));
});
`;
}
async function generateRevisions(outputDir, files) {
  const revisions = /* @__PURE__ */ new Map();
  await Promise.all(
    files.map(async (file) => {
      const contents = await fs.readFile(path.join(outputDir, file.slice(1)));
      revisions.set(file, crypto.createHash("sha256").update(contents).digest("hex").slice(0, 8));
    })
  );
  return revisions;
}
var LinkcccpPWA = (userOptions) => {
  const options = { ...defaultOptions, ...userOptions };
  return {
    name: "LinkcccpPWA",
    async emit(ctx) {
      if (!options.enabled) return [];
      const iconPath = path.resolve(
        "quartz",
        options.icon?.replace(/^static\//, "") ?? path.join("static", "icon.png")
      );
      const icon = await fs.readFile(iconPath);
      const icon192 = await sharp(icon).resize(192, 192).png().toBuffer();
      const icon512 = await sharp(icon).resize(512, 512).png().toBuffer();
      const emitted = await Promise.all([
        writeOutput(ctx, "static/icon-192.png", icon192),
        writeOutput(ctx, "static/icon-512.png", icon512),
        writeOutput(
          ctx,
          "manifest.json",
          JSON.stringify(
            {
              name: options.name,
              short_name: options.shortName,
              description: options.description,
              start_url: "/",
              display: "standalone",
              background_color: options.backgroundColor,
              theme_color: options.themeColor,
              icons: [
                { src: "/static/icon-192.png", sizes: "192x192", type: "image/png" },
                { src: "/static/icon-512.png", sizes: "512x512", type: "image/png" },
                {
                  src: "/static/icon-512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable"
                }
              ]
            },
            null,
            2
          )
        ),
        writeOutput(
          ctx,
          "_headers",
          [
            "/service-worker.js",
            "  Cache-Control: no-cache, no-store, must-revalidate",
            "",
            "/static/contentIndex.json",
            "  Cache-Control: no-cache, no-store, must-revalidate",
            ""
          ].join("\n")
        )
      ]);
      const baseUrl = ctx.cfg.configuration.baseUrl;
      if (baseUrl) {
        const homepagePath = path.join(ctx.argv.output, "index.html");
        const html = await fs.readFile(homepagePath, "utf8");
        const normalizedHtml = normalizeHomepageSeo(
          html,
          getHomepageCanonicalUrl(baseUrl)
        );
        if (normalizedHtml !== html) {
          emitted.push(await writeOutput(ctx, "index.html", normalizedHtml));
        }
      }
      const files = await collectFiles(ctx.argv.output);
      const revisions = await generateRevisions(ctx.argv.output, files);
      const worker = await writeOutput(
        ctx,
        "service-worker.js",
        generateServiceWorker(files, revisions)
      );
      return [...emitted, worker];
    },
    externalResources() {
      const resources = {
        css: [
          {
            content: getThemeStyles(options.recentNotesDesktopOnly),
            inline: true
          }
        ]
      };
      if (!options.enabled) return resources;
      return {
        ...resources,
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `
              document.addEventListener("nav", () => {
                document.querySelectorAll(".recent-notes").forEach((section) => {
                  const heading = section.querySelector(":scope > h3");
                  const list = section.querySelector(":scope > ul.recent-ul");
                  if (!heading || !list || heading.querySelector(".recent-notes-toggle")) return;

                  let listId = list.id || "recent-notes-list";
                  let suffix = 1;
                  while (!list.id && document.getElementById(listId)) {
                    listId = "recent-notes-list-" + suffix++;
                  }
                  list.id = listId;

                  const button = document.createElement("button");
                  button.className = "recent-notes-toggle";
                  button.type = "button";
                  button.setAttribute("aria-controls", listId);
                  button.setAttribute("aria-expanded", "true");

                  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                  icon.setAttribute("viewBox", "5 8 14 8");
                  icon.setAttribute("width", "14");
                  icon.setAttribute("height", "14");
                  icon.setAttribute("aria-hidden", "true");
                  icon.setAttribute("fill", "none");
                  icon.setAttribute("stroke", "currentColor");
                  icon.setAttribute("stroke-width", "2");
                  icon.setAttribute("stroke-linecap", "round");
                  icon.setAttribute("stroke-linejoin", "round");
                  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                  polyline.setAttribute("points", "6 9 12 15 18 9");
                  icon.append(polyline);
                  button.append(document.createTextNode(heading.textContent.trim()), icon);
                  heading.replaceChildren(button);

                  const toggle = () => {
                    const collapsed = section.classList.toggle("collapsed");
                    button.setAttribute("aria-expanded", String(!collapsed));
                  };
                  button.addEventListener("click", toggle);
                  window.addCleanup(() => button.removeEventListener("click", toggle));
                });
              });
            `
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: serviceWorkerRegistrationScript
          }
        ],
        additionalHead: [
          h("link", { rel: "manifest", href: "/manifest.json" }),
          h("meta", { name: "theme-color", content: options.themeColor })
        ]
      };
    }
  };
};
var pwa_default = LinkcccpPWA;
export {
  pwa_default as default,
  generateServiceWorker
};
