# Daily Test Improver

> **Agentic > Scheduled repo bots** demo in [AI Shared](../../../../README.md).

**Why:** Grow test coverage on autopilot. A daily agent hunts for under-tested code, writes real tests for it, and opens a PR — so coverage climbs continuously without anyone ever scheduling "write tests" work that always loses to feature work.

## The scheduled test-improver workflow

**Why:** Coverage improvements are the classic never-urgent task that never gets done. Handing it to a daily agent turns it into steady background progress instead of a someday-project.

```
# Daily Test Improver — scheduled agentic workflow
# .github/workflows/daily-test-improver.md

Runs daily. Each run:
  1. Find under-tested code (low/no coverage, recently changed, risky paths).
  2. Pick a focused target for this run.
  3. Write real tests for it that follow existing patterns and actually assert
     behavior (no trivial/placeholder tests).
  4. Run the suite; keep only tests that pass and genuinely add coverage.
  5. Open a PR with the new tests for human review.
```

## What to look for

- Coverage as a background process. No one allocates the time; the agent chips away daily and each contribution arrives as a reviewable PR.
- Real tests, not filler. The bar is tests that assert behavior and add coverage — measured against the suite — not green checkmarks.
- Human-gated. Every batch lands as a PR, so quality control stays with reviewers while the grind is automated.
- Track record: 58 tests created so far. The coverage-delta metrics are worth measuring — see Notes; this page will get real numbers once captured.

## Skills & files

- [`impact.md`](files/impact.md)

## Notes

- Real workflow: [`daily-test-improver.md`](https://github.com/rancher/dashboard/blob/master/.github/workflows/daily-test-improver.md) in rancher/dashboard.
- **Metrics pending (do this next):** quantify how much coverage actually moved. Suggested: coverage % before vs after the 58 merged tests, lines/branches newly covered, and which areas. That number is the real pitch for this bot — placeholder in [`impact.md`](files/impact.md) until captured.
- Pairs with the E2E and compatibility test work: this raises unit/coverage breadth continuously; those handle the heavier end-to-end and cross-version cases.
