# Daily Test Improver — impact

*Rough estimates to frame the value — and a placeholder for the real coverage numbers.*

## The problem we're solving

Improving test coverage is the textbook important-but-never-urgent task. It loses to
feature work every sprint, so under-tested code stays under-tested and regressions
slip through. Nobody is going to sit down and backfill tests for a large codebase.

## The approach

A **daily scheduled agent** finds under-tested (and risky/recently-changed) code,
writes real behavior-asserting tests that follow existing patterns, verifies they
pass and add coverage, and opens a PR for review. Steady background progress instead
of a someday-project.

## Track record

- **58 tests created** to date via [`daily-test-improver.md`](https://github.com/rancher/dashboard/blob/master/.github/workflows/daily-test-improver.md).

## Metrics to capture (TODO)

The headline number for this bot is the **coverage it actually added** — capture it
and drop it in here:

| Metric | Before | After | Delta |
| --- | --- | --- | --- |
| Line coverage % | _todo_ | _todo_ | _todo_ |
| Branch coverage % | _todo_ | _todo_ | _todo_ |
| Newly covered lines/branches | — | — | _todo_ |
| Areas improved | — | — | _todo_ |

Method: compare the coverage report at the commit before the first test-improver PR
against current, and attribute the delta to the merged test-improver PRs.

## Estimated time saved (until real numbers land)

Writing 58 solid tests by hand is on the order of several engineer-days that would
otherwise never be prioritized. The value isn't just the hours — it's that the work
**happens at all**, continuously, as reviewable PRs.
