import test from "node:test";
import assert from "node:assert/strict";
import { revisionSummary, localDateKey } from "../src/lib/study-plan.ts";

test("revision counts distinguish started, revised, confident and board-ready", () => {
  const chapters = ["untouched", "started", "revised", "mastered", "ready"].map(
    (id) => ({ id }),
  );
  const progress = chapters.map((chapter, status) => ({
    item_type: "chapter",
    item_id: chapter.id,
    status,
  }));
  progress.push({ item_type: "exercise", item_id: "untouched", status: 4 });
  progress.push({ item_type: "chapter", item_id: "other-language", status: 4 });
  const summary = revisionSummary(chapters, progress);
  assert.equal(summary.studied.length, 4);
  assert.equal(summary.revised.length, 3);
  assert.equal(summary.confident.length, 2);
  assert.deepEqual(
    summary.needsPractice.map((chapter) => chapter.id),
    ["started", "revised"],
  );
});

test("reset and missing progress do not count as studied", () => {
  assert.deepEqual(
    revisionSummary(
      [{ id: "reset" }, { id: "new" }],
      [{ item_type: "chapter", item_id: "reset", status: 0 }],
    ),
    { studied: [], revised: [], confident: [], needsPractice: [] },
  );
  assert.deepEqual(revisionSummary([], []), {
    studied: [],
    revised: [],
    confident: [],
    needsPractice: [],
  });
});

test("planner dates use local calendar days, including midnight and month boundaries", () => {
  assert.equal(localDateKey(new Date(2026, 9, 1, 0, 5)), "2026-10-01");
  assert.equal(localDateKey(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});
