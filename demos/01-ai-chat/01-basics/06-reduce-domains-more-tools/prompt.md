# Prompt - Reduce active domains, hand the agent a toolbelt

Paste into Claude Code in the harness project.

```
Here is the toolbelt for this project: browser.mjs for screenshots and video,
wait-for-sidecars before any browser or Rancher work, the insights curl for
reporting missing tools, and the my-* skills for commits, PRs, and recordings.
Whenever a task needs the browser, Rancher, or GitHub, reach for these instead of
asking me to do it by hand. If a tool you need is missing, tell me and I will add it.
```

## Notes

- This is an approach, not a one-off prompt. The durable version lives in CLAUDE.md; see [`files/toolbelt-CLAUDE.md`](./files/toolbelt-CLAUDE.md).
- "Reduce active domains" in practice: one issue per project/container, one cluster, one narrow task. The less that has to be true at once, the more reliably the agent runs unattended.
- "Plethora of tools" in practice: every manual step you would otherwise do becomes a script the agent can call (browser.mjs, wait-for-sidecars, the insights curl, the my-* skills).
- The missing-tool feedback loop compounds: each gap the agent reports becomes a new tool that makes the next run more autonomous.
