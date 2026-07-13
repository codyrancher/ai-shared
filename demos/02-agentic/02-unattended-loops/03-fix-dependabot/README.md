# Dependabot Auto-Fixer

> **Agentic > Unattended & looping agents** demo in [AI Shared](../../../../README.md).

**Why:** Close the gap Dependabot leaves. It opens PRs for the easy alerts and gives up on the rest — an agent picks up those leftovers, does the real investigation, and lands a reviewed PR with the risks spelled out.

## Working the alerts Dependabot won't

**Why:** The alerts Dependabot can't auto-PR are exactly the ones that need context — transitive deps, breaking majors, code that has to change. That context is what an agent can actually gather.

```
/loop For each open Dependabot alert on rancher/dashboard that has NO Dependabot
PR (the ones it couldn't auto-fix):

1. Read the advisory and find where/how the vulnerable dependency is actually
   used in our code (direct, transitive, dev-only, reachable?).
2. Determine the real fix: bump, replace, patch call sites, or "not exploitable
   here — document why."
3. Make the change on a branch, run the build + tests, and open a PR whose
   description states: the alert, what changed, why, blast radius, and the
   residual risk / what a reviewer should double-check.
4. If it genuinely can't be fixed safely, open an issue with the analysis
   instead of a half-baked PR.
```

## What to look for

- AI has the context Dependabot lacks. Dependabot only knows the manifest. The agent reads the code, decides whether the vuln is even reachable, and fixes call sites when a bump alone won't do.
- Every PR is decision-ready. The output isn't just a version bump — it's the fix plus a written risk assessment, so review is fast and honest.
- No silent failures. If it can't be fixed safely, it says so with analysis rather than shipping a guess.
- Estimated time saved: the un-auto-fixable alerts are the expensive ones — roughly 1–3 hours of investigation each, and they pile up. Batched by an agent, that backlog clears with review-only human time. Full breakdown in the impact.md file above.

## Skills & files

- [`impact.md`](files/impact.md)

## Notes

- The valuable output is the *risk write-up*, not the diff. A security bump you can't reason about is a liability; the analysis is what makes it mergeable.
- Pairs with the Security Alert Dashboards tool (AI-powered tooling group): use the dashboard to see the trend, use this to burn it down.
- Keep it to a branch + PR — never let an unattended security agent push to a protected branch.
