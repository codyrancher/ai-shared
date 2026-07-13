# ESLint v7 → v10 Migration

> **Agentic > Unattended & looping agents** demo in [AI Shared](../../../../README.md).

**Why:** Drag a large codebase across two major ESLint versions without changing a line of app behavior — the agent iterates lint → fix → re-lint on its own until the config is clean and nothing was silently disabled.

## The migration loop

**Why:** A major-version lint migration is thousands of tiny, mechanical failures. That is precisely the kind of long, tedious, achievable-many-ways task where an unattended loop beats a human — as long as it can't cheat.

```
/loop Goal: migrate this repo's ESLint setup from v7 to v9 (flat config), keeping
every v7 rule's behavior intact, then from v9 to v10.

Each iteration:
1. Run the full lint over the whole repo.
2. If there are zero errors AND no rule was disabled/downgraded to reach that,
   stop and produce a diff summary.
3. Otherwise fix the next batch of failures at the source. Prefer fixing code or
   correctly porting the rule over relaxing it.

Hard rules:
- Do NOT disable rules, add blanket eslint-disable comments, or drop a rule to
  "warn" just to pass. Behavior must match v7.
- App/runtime code behavior must not change — only lint config and lint-driven
  fixes.
Keep looping on fresh context until it's genuinely clean.
```

## What to look for

- Looping on an achievable-but-tedious goal. Zero lint errors is reachable; the work is just long. The agent runs the full lint, fixes, and re-runs — as many passes as it takes — without a human in the seat.
- The failure mode is "cheating," so guard it. The easy way to make lint pass is to disable rules. The prompt forbids that explicitly; the goal is equivalent behavior, not a green checkmark.
- Staged: v7 → v9 → v10. The big lift is v7 → v9 (flat config, deprecated-rule ports). v9 → v10 is smaller but the same iterate-to-clean process.
- Estimated time saved: a manual two-major migration on a large repo is commonly ~1–2 weeks of stop-start engineer effort; here it's mostly unattended loop time plus focused review of the config diff. Full breakdown in the impact.md file above.

## Skills & files

- [`impact.md`](files/impact.md)

## Notes

- The single most important instruction is the anti-cheat clause. Goal-seeking agents optimize for "the check passes," and disabling rules passes the check while destroying the point of the migration.
- Keeping v7 rule *behavior* (not just names) through the flat-config port is what makes the diff reviewable: reviewers confirm behavior held, they don't re-derive the config.
- Same pattern fits other "clean it until it's actually clean" migrations (type-checker strictness bumps, dependency majors).
