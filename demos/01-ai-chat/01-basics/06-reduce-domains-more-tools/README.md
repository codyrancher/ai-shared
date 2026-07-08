# Reduce active domains, hand the agent a toolbelt

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Set things up so the agent runs unattended, freeing you to work on something else in parallel.

## Point at the toolbelt

**Why:** The agent does the browser, Rancher, and GitHub steps itself instead of handing each one back to you.

```
Here is the toolbelt for this project: browser.mjs for screenshots and video, wait-for-sidecars before any browser or Rancher work, the insights curl for reporting missing tools, and the my-* skills for commits, PRs, and recordings. Whenever a task needs the browser, Rancher, or GitHub, reach for these instead of asking me to do it by hand. If a tool you need is missing, tell me and I will add it.
```

## What to look for

- The agent picks the right tool on its own instead of narrating manual steps.
- Narrow scope keeps the context focused and the runs unattended.
- Missing-tool feedback becomes a loop: it asks, you add, it uses.

## Skills & files

- [`toolbelt-CLAUDE.md`](files/toolbelt-CLAUDE.md)

## Result

- `media/toolbelt.png` - A CLAUDE.md toolbelt section (pending: browser.mjs screenshot)

## Notes

- This is an approach, not a one-off prompt. The durable version lives in CLAUDE.md; see [`files/toolbelt-CLAUDE.md`](./files/toolbelt-CLAUDE.md).
- "Reduce active domains" in practice: one issue per project/container, one cluster, one narrow task. The less that has to be true at once, the more reliably the agent runs unattended.
- "Plethora of tools" in practice: every manual step you would otherwise do becomes a script the agent can call (browser.mjs, wait-for-sidecars, the insights curl, the my-* skills).
- The missing-tool feedback loop compounds: each gap the agent reports becomes a new tool that makes the next run more autonomous.
