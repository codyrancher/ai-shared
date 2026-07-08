# 6. Reduce active domains, hand the agent a toolbelt

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Share a general approach: shrink how many domains must be juggled at once, and give the agent many tools.

## The idea

Two habits that make a big difference. First, reduce the number of domains that have to be live in your head (and the context) at one time: one issue, one cluster, one narrow slice. Second, hand the agent a rich toolbelt (browser.mjs, wait-for-sidecars, the insights report, the my-* skills) and tell it to reach for those instead of asking you to do things by hand. Fewer things to hold, more the agent can do unattended.

## Prompt

```
Here is the toolbelt for this project: browser.mjs for screenshots and video,
wait-for-sidecars before any browser or Rancher work, the insights curl for
reporting missing tools, and the my-* skills for commits, PRs, and recordings.
Whenever a task needs the browser, Rancher, or GitHub, reach for these instead of
asking me to do it by hand. If a tool you need is missing, tell me and I will add it.
```

Full prompt text: [`prompt.md`](./prompt.md) · Example toolbelt block: [`files/toolbelt-CLAUDE.md`](./files/toolbelt-CLAUDE.md)

## What to look for

- The agent picks the right tool on its own instead of narrating manual steps.
- Narrow scope keeps the context focused and the runs unattended.
- Missing-tool feedback becomes a loop: it asks, you add, it uses.

## Result

_Media pending. Screenshot the CLAUDE.md toolbelt section with `browser.mjs screenshot`; save at [`media/toolbelt.png`](./media/)._

## Skills & files

- Example toolbelt block: [`files/toolbelt-CLAUDE.md`](./files/toolbelt-CLAUDE.md)
- Capture: `browser.mjs screenshot`
