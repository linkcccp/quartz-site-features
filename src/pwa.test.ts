import assert from "node:assert/strict"
import test from "node:test"
import {
  generateServiceWorker,
  normalizeHomepageSeo,
  serviceWorkerRegistrationScript,
} from "./pwa.js"
import { getThemeStyles, themeStyles } from "./themeStyles.js"

test("homepage SEO URLs use the canonical site root", () => {
  const html = normalizeHomepageSeo(
    '<html><head><meta property="og:url" content="https://example.com/index"/><meta property="twitter:url" content="https://example.com/index"/></head><body></body></html>',
    "https://example.com/",
  )

  assert.match(html, /property="og:url" content="https:\/\/example\.com\/"/)
  assert.match(html, /property="twitter:url" content="https:\/\/example\.com\/"/)
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.com\/"\/>/)
  assert.doesNotMatch(html, /https:\/\/example\.com\/index/)
})

test("homepage SEO normalization updates an existing canonical without duplicating it", () => {
  const html = normalizeHomepageSeo(
    '<html><head><link rel="canonical" href="https://example.com/index"/><link rel="canonical" href="https://old.example.com/"/></head></html>',
    "https://example.com/",
  )

  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1)
  assert.match(html, /rel="canonical" href="https:\/\/example\.com\/"/)
})

test("PWA checks for service worker updates while the page is visible", () => {
  assert.match(serviceWorkerRegistrationScript, /setInterval\(checkForUpdates,\s*30_000\)/)
  assert.match(serviceWorkerRegistrationScript, /document\.visibilityState !== "visible"/)
})

test("service worker precaches generated files with their content revisions", () => {
  const worker = generateServiceWorker(
    ["/index.html", "/about/index.html"],
    new Map([
      ["/index.html", "abcd1234"],
      ["/about/index.html", "efgh5678"],
    ]),
  )

  assert.match(worker, /"url":"\/index\.html","revision":"abcd1234"/)
  assert.match(worker, /"url":"\/about\/index\.html","revision":"efgh5678"/)
  assert.match(worker, /precacheAndRoute/)
  assert.ok(
    worker.indexOf("workbox.routing.registerRoute(") <
      worker.indexOf("workbox.precaching.precacheAndRoute("),
    "dynamic routes should be checked before the precache route",
  )
  assert.match(worker, /url\.pathname\.endsWith\('\/static\/contentIndex\.json'\)/)
  assert.match(worker, /matchPrecache\(request\)/)
  assert.match(worker, /StaleWhileRevalidate/)
  assert.match(worker, /quartz-static-/)
  assert.match(worker, /caches\.delete\(name\)/)
})

test("service worker excludes XML feeds and sitemap files from precache", () => {
  const worker = generateServiceWorker(
    ["/index.html", "/index.xml", "/sitemap.xml", "/robots.txt", "/_headers"],
    new Map(),
  )

  assert.match(worker, /"url":"\/index\.html"/)
  assert.doesNotMatch(worker, /"url":"\/(?:index\.xml|sitemap\.xml|robots\.txt)"/)
  assert.doesNotMatch(worker, /"url":"\/_headers"/)
})

test("theme CSS includes site tokens and RecentNotes collapse styles", () => {
  assert.match(themeStyles, /--radius-medium:\s*4px/)
  assert.match(themeStyles, /--secondary:\s*#0f6cbd/)
  assert.match(themeStyles, /--secondary:\s*#479ef5/)
  assert.match(themeStyles, /Segoe UI Variable/)
  assert.match(themeStyles, /prefers-reduced-motion:\s*reduce/)
  assert.match(themeStyles, /\.recent-notes\.collapsed/)
  assert.match(themeStyles, /\.center h2\s*\{/)
  assert.doesNotMatch(themeStyles, /^h2\s*\{/m)
  assert.match(themeStyles, /\.recent-notes-toggle > svg\s*\{[^}]*margin-left:\s*0\.5rem/s)
  assert.match(themeStyles, /transform:\s*rotateZ\(-90deg\)/)
})

test("RecentNotes can be hidden on mobile without affecting desktop", () => {
  const desktopOnlyStyles = getThemeStyles(true)
  assert.match(desktopOnlyStyles, /@media all and \(max-width: 800px\)/)
  assert.match(desktopOnlyStyles, /\.recent-notes\s*\{\s*display:\s*none;/)
  assert.doesNotMatch(getThemeStyles(), /\.recent-notes\s*\{\s*display:\s*none;/)
})
