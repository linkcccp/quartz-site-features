export type StaleState = "hidden" | "explicit" | "auto"

export function getStaleState(
  staleFlag: unknown,
  modified: Date | undefined,
  threshold: number,
  now = Date.now(),
): StaleState {
  if (staleFlag === false) return "hidden"
  if (staleFlag === true) return "explicit"
  if (!modified) return "hidden"

  const daysSince = Math.floor((now - modified.getTime()) / (1000 * 60 * 60 * 24))
  return daysSince > threshold ? "auto" : "hidden"
}
