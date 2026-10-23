import assert from "node:assert/strict"
import test from "node:test"
import { getStaleState } from "./staleNoticeLogic.js"

const day = 24 * 60 * 60 * 1000
const now = Date.UTC(2026, 0, 1)

test("explicitly stale notes remain marked stale", () => {
  assert.equal(getStaleState(true, undefined, 180, now), "explicit")
})

test("explicitly fresh notes stay hidden", () => {
  assert.equal(getStaleState(false, new Date(now - 400 * day), 180, now), "hidden")
})

test("notes become stale only after the threshold", () => {
  assert.equal(getStaleState(undefined, new Date(now - 180 * day), 180, now), "hidden")
  assert.equal(getStaleState(undefined, new Date(now - 181 * day), 180, now), "auto")
})

test("notes without a modification date stay hidden", () => {
  assert.equal(getStaleState(undefined, undefined, 180, now), "hidden")
})
