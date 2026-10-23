// src/staleNoticeLogic.ts
function getStaleState(staleFlag, modified, threshold, now = Date.now()) {
  if (staleFlag === false) return "hidden";
  if (staleFlag === true) return "explicit";
  if (!modified) return "hidden";
  const daysSince = Math.floor((now - modified.getTime()) / (1e3 * 60 * 60 * 24));
  return daysSince > threshold ? "auto" : "hidden";
}

// src/components.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var staleNoticeCss = `
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
`;
var StaleNotice = (options) => {
  const threshold = options?.threshold ?? 180;
  const Component = ({ cfg, fileData }) => {
    const frontmatter = typeof fileData.frontmatter === "object" && fileData.frontmatter !== null ? fileData.frontmatter : void 0;
    const dates = typeof fileData.dates === "object" && fileData.dates !== null ? fileData.dates : void 0;
    const modified = dates?.modified instanceof Date ? dates.modified : void 0;
    const state = getStaleState(frontmatter?.stale, modified, threshold);
    if (state === "hidden") return null;
    const date = modified ? new Intl.DateTimeFormat(cfg.locale ?? "zh-CN").format(modified) : "";
    const days = modified ? Math.floor((Date.now() - modified.getTime()) / (1e3 * 60 * 60 * 24)) : 0;
    const message = state === "explicit" ? `\u672C\u6587\u6700\u540E\u66F4\u65B0\u4E8E ${date}\uFF0C\u4F5C\u8005\u6807\u8BB0\u5185\u5BB9\u53EF\u80FD\u5DF2\u8FC7\u65F6\u3002` : `\u672C\u6587\u6700\u540E\u66F4\u65B0\u4E8E ${date}\uFF0C\u5DF2\u8D85\u8FC7 ${days} \u5929\uFF0C\u5185\u5BB9\u53EF\u80FD\u5DF2\u8FC7\u65F6\u3002`;
    return /* @__PURE__ */ jsxs("aside", { class: "stale-notice", role: "status", children: [
      /* @__PURE__ */ jsx("svg", { "aria-hidden": "true", focusable: "false", viewBox: "0 0 24 24", width: "18", height: "18", children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
          fill: "currentColor"
        }
      ) }),
      /* @__PURE__ */ jsx("span", { children: message })
    ] });
  };
  Component.css = staleNoticeCss;
  return Component;
};
export {
  StaleNotice
};
