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
  --radius-large: 6px;
  --radius-xlarge: 8px;
  --elevation-2: 0 0 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14);
  --elevation-4: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14);
  --elevation-8: 0 0 2px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.14);
  --elevation-16: 0 0 2px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.14);
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
  margin-right: 0.5rem;
  opacity: 0.8;
  transition: transform 300ms ease-in-out;
}

.recent-notes.collapsed > h3 .recent-notes-toggle > svg {
  transform: rotate(-90deg);
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
  .recent-notes > .recent-ul {
    max-height: none;
    overflow-y: visible;
  }
}
`;

// src/pwa.ts
import sharp from "sharp";
var defaultOptions = {
  enabled: true,
  name: "Link's Digital Garden",
  shortName: "Garden",
  description: "A personal digital garden built with Quartz",
  themeColor: "#284b63",
  backgroundColor: "#faf8f8"
};
async function writeOutput(ctx, relativePath, content) {
  const outputPath = path.join(ctx.argv.output, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content);
  return outputPath;
}
async function collectFiles(root, dir = root) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
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
  const precacheFiles = staticFiles.filter((file) => !/sitemap|robots|service-worker\.js|\.xml$/i.test(file)).map((url) => ({ url, revision: revisions.get(url) ?? buildTimestamp }));
  return `importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');
// Build: ${buildTimestamp}

workbox.precaching.precacheAndRoute([
  { url: '/', revision: ${JSON.stringify(buildTimestamp)} },
  ...${JSON.stringify(precacheFiles)}
]);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({ cacheName: 'pages' })
);

workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'static',
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
  event.waitUntil(self.clients.claim());
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
        )
      ]);
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
        css: [{ content: themeStyles, inline: true }]
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
                  icon.setAttribute("viewBox", "0 0 12 12");
                  icon.setAttribute("width", "12");
                  icon.setAttribute("height", "12");
                  icon.setAttribute("aria-hidden", "true");
                  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                  path.setAttribute("d", "M3 1.5 7.5 6 3 10.5");
                  path.setAttribute("fill", "none");
                  path.setAttribute("stroke", "currentColor");
                  path.setAttribute("stroke-width", "1.5");
                  icon.append(path);
                  button.append(icon, document.createTextNode(heading.textContent.trim()));
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
            script: `
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
                      registration.addEventListener("updatefound", () => {
                        const worker = registration.installing;
                        if (!worker) return;
                        worker.addEventListener("statechange", () => {
                          if (worker.state === "installed" && navigator.serviceWorker.controller) {
                            window.location.reload();
                          }
                        });
                      });
                    })
                    .catch((error) => console.error("Service worker registration failed:", error));
                });
              }
            `
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
