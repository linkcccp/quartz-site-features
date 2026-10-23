import assert from "node:assert/strict"
import test from "node:test"
import { generateServiceWorker } from "./pwa.js"
import { themeStyles } from "./themeStyles.js"

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
})

test("service worker excludes XML feeds and sitemap files from precache", () => {
  const worker = generateServiceWorker(
    ["/index.html", "/index.xml", "/sitemap.xml", "/robots.txt"],
    new Map(),
  )

  assert.match(worker, /"url":"\/index\.html"/)
  assert.doesNotMatch(worker, /"url":"\/(?:index\.xml|sitemap\.xml|robots\.txt)"/)
})

test("theme CSS includes site tokens and RecentNotes collapse styles", () => {
  assert.match(themeStyles, /--radius-medium:\s*4px/)
  assert.match(themeStyles, /\.recent-notes\.collapsed/)
})
