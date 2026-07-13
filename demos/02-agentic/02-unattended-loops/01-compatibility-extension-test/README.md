# Compatibility Extension Tests

> **Agentic > Unattended & looping agents** demo in [AI Shared](../../../../README.md).

**Why:** Keep an extension's E2E suite green against every supported Rancher version — a single agent runs the matrix, reads the failures, fixes them, and re-triggers on its own until everything passes.

## The problem, and the shape of the fix

**Why:** The hard, one-time work (a full test spec and a reproducible env) is done up front, so the agent only ever faces small, checkable failures — exactly what a loop is good at.

```
/loop Goal: make the compatibility E2E workflow pass on every supported Rancher
version.

Each iteration:
1. Trigger the compatibility E2E workflow (all versions in the matrix).
2. Wait for it, then download the artifacts and parse the results per version.
3. If everything is green, stop and summarize.
4. Otherwise take the FIRST failing version, read the Cypress output + video,
   find the root cause in the extension code or the test, apply the smallest
   fix, commit, and trigger again.

Rules: never skip, quarantine, or loosen a test to make it pass. Every fix must
address the real cause. Keep going on fresh context each pass until the whole
matrix is green.
```

## What to look for

- One goal, run to completion. The agent isn't told how to fix anything — only to get the matrix green. It decides trigger → inspect → fix → re-trigger on its own, indefinitely.
- Preparation is the multiplier. A complete test spec (handed in as a PDF) plus a pre-built env harness meant the agent started from a good state and only had to solve the small, self-checkable deltas. Solve the complex setup once; let AI grind the simple cases forever.
- Reusable for flakiness. The same loop re-runs later to hunt intermittent failures — no new prompt needed.
- Estimated time saved: the enabling PR is ~107 changed files of scaffolding; after that, keeping the matrix green across a release used to be ~1–2 engineer-days of trigger-and-babysit per version bump, now an unattended overnight loop plus a short review. Full breakdown and the example run in the impact.md file above.

## Skills & files

- [`impact.md`](files/impact.md)

## Notes

- The "never skip / quarantine / loosen" rule is the whole game. A goal-seeking loop will happily make tests pass by weakening them if you let it — the guardrail forces real fixes.
- Good inputs are what make the loop cheap: the more the up-front spec and env nail the complex parts, the simpler (and more reliably checkable) the cases the agent sees each pass.
- Run it in a container/VM so the unattended trigger-and-fix cycle can't touch anything it shouldn't.
