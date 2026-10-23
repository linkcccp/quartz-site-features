export const themeStyles = `
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
`
