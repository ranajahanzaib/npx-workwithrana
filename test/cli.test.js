import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

function run(args = [], columns = 82) {
  return spawnSync(process.execPath, ["index.js", ...args], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: { ...process.env, COLUMNS: String(columns), NO_COLOR: "1" },
  });
}

test("prints current profile, projects, and contact links", () => {
  const result = run();
  assert.equal(result.status, 0);
  for (const value of [
    "RANA JAHANZAIB",
    "D1 Preflight",
    "Ledger-to-Chain Reconciler",
    "Workers Aide",
    "work@withrana.com",
    "www.upwork.com/freelancers/~01bbcf6edb91a8df5f",
    "contra.com/ranajahanzaib",
    "workwithrana.com/work",
  ]) assert.ok(result.stdout.includes(value), `Missing ${value}`);
  assert.doesNotMatch(result.stdout, /ewithrana|npx rana|8 years|20\+ Certifications/);
});

test("keeps borders aligned at terminal widths", () => {
  for (const columns of [32, 48, 62, 82, 100]) {
    const lines = run([], columns).stdout.trim().split("\n");
    const frame = lines.filter((line) => /^[╭╮├┤│╰╯]/u.test(line));
    const widths = new Set(frame.map((line) => [...line].length));
    assert.equal(widths.size, 1, `Misaligned frame at ${columns} columns`);
    assert.ok([...widths][0] < columns);
  }
});

test("supports help and version", () => {
  assert.match(run(["--help"]).stdout, /npx workwithrana/);
  assert.equal(run(["--version"]).stdout.trim(), "0.0.4");
  assert.equal(run(["--unknown"]).status, 1);
});
