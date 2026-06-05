import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatGreeting,
  getTimeBucket,
  GREETINGS,
  rememberGreeting,
  selectGreeting,
} from "./greetings.ts";

describe("dynamic greetings", () => {
  it("ships the 100 curated greetings from the spec", () => {
    assert.equal(GREETINGS.length, 100);
    assert.equal(new Set(GREETINGS.map((greeting) => greeting.id)).size, 100);
  });

  it("uses local time windows for greeting buckets", () => {
    assert.equal(getTimeBucket(new Date("2026-06-04T05:00:00")), "morning");
    assert.equal(getTimeBucket(new Date("2026-06-04T12:00:00")), "afternoon");
    assert.equal(getTimeBucket(new Date("2026-06-04T17:00:00")), "evening");
    assert.equal(getTimeBucket(new Date("2026-06-04T22:00:00")), "lateNight");
    assert.equal(getTimeBucket(new Date("2026-06-04T04:59:00")), "lateNight");
  });

  it("formats names without exposing full email addresses", () => {
    assert.equal(
      formatGreeting("Hi, {firstName}. What are we making?", "person@example.com"),
      "Hi, person. What are we making?",
    );
    assert.equal(
      formatGreeting("Hi, {firstName}. What are we making?", ""),
      "Hi, there. What are we making?",
    );
  });

  it("selects from anytime plus the current time bucket", () => {
    const selected = selectGreeting({
      date: new Date("2026-06-04T09:00:00"),
      firstName: "Jeremiah",
      random: () => 0.999,
    });

    assert.match(selected.id, /^(anytime|morning)_/);
    assert.match(selected.renderedText, /Jeremiah/);
  });

  it("avoids showing the same greeting twice in a row", () => {
    const date = new Date("2026-06-04T18:00:00");
    const first = selectGreeting({
      date,
      firstName: "Jeremiah",
      random: () => 0,
    });
    const second = selectGreeting({
      date,
      firstName: "Jeremiah",
      random: () => 0,
      recentGreetingIds: [first.id],
    });

    assert.notEqual(second.id, first.id);
  });

  it("can prefer shorter greetings for constrained layouts", () => {
    const selected = selectGreeting({
      date: new Date("2026-06-04T18:00:00"),
      firstName: "Jeremiah",
      maxRenderedLength: 28,
      random: () => 0.999,
    });

    assert.ok(selected.renderedText.length <= 28);
  });

  it("stores recent greeting ids newest-first and capped", () => {
    assert.deepEqual(
      rememberGreeting("evening_03", [
        "anytime_01",
        "morning_02",
        "afternoon_03",
        "evening_04",
        "lateNight_05",
      ]),
      ["evening_03", "anytime_01", "morning_02", "afternoon_03", "evening_04"],
    );
  });
});
