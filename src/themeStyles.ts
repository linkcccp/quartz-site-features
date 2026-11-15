export const themeStyles = `
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
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.page > #quartz-body > .center > .page-header {
  padding: 1.25rem 0;
  margin-bottom: 1.5rem;
}

.page > #quartz-body > .center > article.popover-hint {
  padding: 0;
}

.page > #quartz-body .sidebar .explorer,
.page > #quartz-body .sidebar .recent-notes,
.page > #quartz-body .sidebar .toc,
.page > #quartz-body .sidebar .graph,
.page > #quartz-body .sidebar .backlinks {
  box-sizing: border-box;
  margin-bottom: 1.25rem;
  padding: 0.5rem 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.page > #quartz-body .sidebar button:not(.recent-notes-toggle),
.page > #quartz-body .center button,
.page > #quartz-body .graph button {
  min-height: 2.25rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
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
  border-color: transparent;
  background: var(--fluent-surface-2);
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
  border: 0;
  border-bottom: 1px solid var(--fluent-stroke-1);
  border-radius: 0;
  background: transparent;
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
  background: transparent;
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
  border: 0;
  border-left: 3px solid var(--fluent-brand);
  border-radius: 0;
  background: transparent;
}

.page > #quartz-body .center .callout {
  border: 0;
  border-left: 3px solid var(--fluent-brand);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.page > #quartz-body .center .callout > .callout-title,
.page > #quartz-body .center .callout > .callout-content {
  background: transparent;
}

.page > #quartz-body .center .callout-title {
  padding: 0.875rem 0;
  font-weight: 600;
}

.page > #quartz-body .center table {
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 0;
  background: transparent;
}

.page > #quartz-body .center th,
.page > #quartz-body .center td {
  padding: 0.625rem 0.75rem;
  border: 0;
  border-bottom: 1px solid var(--fluent-stroke-2);
}

.page > #quartz-body .center th {
  background: transparent;
  font-weight: 600;
}

.page > #quartz-body .center tbody tr:hover {
  background: var(--fluent-surface-2);
}

.page > #quartz-body .center pre {
  border: 0;
  border-radius: 0;
  box-shadow: none;
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
  box-shadow: none;
  border-radius: 0;
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
  border-radius: 0;
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
    padding: 1rem 0;
  }

  .page > #quartz-body > .center > article.popover-hint {
    padding: 0;
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
`

export function getThemeStyles(recentNotesDesktopOnly = false): string {
  if (!recentNotesDesktopOnly) return themeStyles

  return `${themeStyles}
@media all and (max-width: 800px) {
  .recent-notes {
    display: none;
  }
}
`
}
