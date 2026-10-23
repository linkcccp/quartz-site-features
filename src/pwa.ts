import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { h } from "preact"
import { getThemeStyles } from "./themeStyles"
import sharp from "sharp"
import type { BuildCtx, FilePath, QuartzEmitterPlugin } from "@quartz-community/types"

export interface PWAOptions {
  enabled: boolean
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  recentNotesDesktopOnly: boolean
  icon?: string
}

const defaultOptions: PWAOptions = {
  enabled: true,
  name: "Link's Digital Garden",
  shortName: "Garden",
  description: "A personal digital garden built with Quartz",
  themeColor: "#284b63",
  backgroundColor: "#faf8f8",
  recentNotesDesktopOnly: false,
}

async function writeOutput(ctx: BuildCtx, relativePath: string, content: string | Buffer) {
  const outputPath = path.join(ctx.argv.output, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, content)
  return outputPath as FilePath
}

async function collectFiles(root: string, dir = root): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return collectFiles(root, fullPath)
      if (entry.isFile()) {
        return ["/" + path.relative(root, fullPath).split(path.sep).join("/")]
      }
      return []
    }),
  )
  return nested.flat()
}

export function generateServiceWorker(
  staticFiles: string[],
  revisions: Map<string, string>,
): string {
  const buildTimestamp = new Date().toISOString()
  const precacheFiles = staticFiles
    .filter((file) => !/sitemap|robots|service-worker\.js|\.xml$/i.test(file))
    .map((url) => ({ url, revision: revisions.get(url) ?? buildTimestamp }))

  return `importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');
// Build: ${buildTimestamp}

workbox.precaching.precacheAndRoute([
  { url: '/', revision: ${JSON.stringify(buildTimestamp)} },
  ...${JSON.stringify(precacheFiles)}
]);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({ cacheName: 'quartz-pages-${buildTimestamp}' })
);

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
          (name.startsWith('quartz-static-') && name !== 'quartz-static-${buildTimestamp}')
        )
        .map((name) => caches.delete(name))
    ))
  ]));
});
`
}

async function generateRevisions(outputDir: string, files: string[]) {
  const revisions = new Map<string, string>()
  await Promise.all(
    files.map(async (file) => {
      const contents = await fs.readFile(path.join(outputDir, file.slice(1)))
      revisions.set(file, crypto.createHash("sha256").update(contents).digest("hex").slice(0, 8))
    }),
  )
  return revisions
}

const LinkcccpPWA: QuartzEmitterPlugin<Partial<PWAOptions>> = (userOptions) => {
  const options = { ...defaultOptions, ...userOptions }

  return {
    name: "LinkcccpPWA",
    async emit(ctx) {
      if (!options.enabled) return []

      const iconPath = path.resolve(
        "quartz",
        options.icon?.replace(/^static\//, "") ?? path.join("static", "icon.png"),
      )
      const icon = await fs.readFile(iconPath)
      const icon192 = await sharp(icon).resize(192, 192).png().toBuffer()
      const icon512 = await sharp(icon).resize(512, 512).png().toBuffer()

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
                  purpose: "any maskable",
                },
              ],
            },
            null,
            2,
          ),
        ),
      ])

      const files = await collectFiles(ctx.argv.output)
      const revisions = await generateRevisions(ctx.argv.output, files)
      const worker = await writeOutput(
        ctx,
        "service-worker.js",
        generateServiceWorker(files, revisions),
      )

      return [...emitted, worker]
    },
    externalResources() {
      const resources = {
        css: [
          {
            content: getThemeStyles(options.recentNotesDesktopOnly),
            inline: true,
          },
        ],
      }
      if (!options.enabled) return resources

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
            `,
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
                      const checkForUpdates = () => {
                        registration
                          .update()
                          .catch((error) => console.error("Service worker update check failed:", error));
                      };
                      checkForUpdates();
                      document.addEventListener("visibilitychange", () => {
                        if (document.visibilityState === "visible") checkForUpdates();
                      });
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
            `,
          },
        ],
        additionalHead: [
          h("link", { rel: "manifest", href: "/manifest.json" }),
          h("meta", { name: "theme-color", content: options.themeColor }),
        ],
      }
    },
  }
}

export default LinkcccpPWA
