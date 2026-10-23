import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import { getStaleState } from "./staleNoticeLogic.js"

interface StaleNoticeOptions {
  threshold: number
}

const staleNoticeCss = `
.stale-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0 1rem;
  border-radius: var(--radius-medium);
  font-size: 0.9rem;
  line-height: 1.5;
  background-color: color-mix(in srgb, #d13438 10%, transparent);
  border: 1px solid color-mix(in srgb, #d13438 25%, transparent);
  color: var(--darkgray);
}
.stale-notice svg {
  flex: 0 0 auto;
  margin-top: 1px;
  color: #d13438;
}
`

export const StaleNotice: QuartzComponentConstructor<StaleNoticeOptions> = (options) => {
  const threshold = options?.threshold ?? 180

  const Component: QuartzComponent = ({ cfg, fileData }) => {
    const frontmatter =
      typeof fileData.frontmatter === "object" && fileData.frontmatter !== null
        ? (fileData.frontmatter as Record<string, unknown>)
        : undefined
    const dates =
      typeof fileData.dates === "object" && fileData.dates !== null
        ? (fileData.dates as Record<string, unknown>)
        : undefined
    const modified = dates?.modified instanceof Date ? dates.modified : undefined
    const state = getStaleState(frontmatter?.stale, modified, threshold)

    if (state === "hidden") return null

    const date = modified ? new Intl.DateTimeFormat(cfg.locale ?? "zh-CN").format(modified) : ""
    const days = modified
      ? Math.floor((Date.now() - modified.getTime()) / (1000 * 60 * 60 * 24))
      : 0
    const message =
      state === "explicit"
        ? `本文最后更新于 ${date}，作者标记内容可能已过时。`
        : `本文最后更新于 ${date}，已超过 ${days} 天，内容可能已过时。`

    return (
      <aside class="stale-notice" role="status">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            fill="currentColor"
          />
        </svg>
        <span>{message}</span>
      </aside>
    )
  }

  Component.css = staleNoticeCss
  return Component
}
