# Behavior & Environment

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Stop re-explaining the same preferences every session; write the rule once and it sticks.

## Shape behavior

**Why:** Never type "run lint first" or "no em dashes" again. Set it once and every reply obeys.

```
Add two rules to CLAUDE.md: never use em dashes in any output, and always run yarn lint before you tell me a change is done. Then show me the diff.
```

## Notes

- CLAUDE.md is loaded at the start of every session, so rules stick without re-prompting.
- Keep rules imperative and testable ("always run X", "never do Y"), so you can see them take effect immediately.
- See [`files/CLAUDE.md`](./files/CLAUDE.md) for a ready-to-adapt block.
