# Behavior & Environment

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Stop re-explaining the same preferences every session; write the rule once and it sticks.

## Shape behavior

**Why:** Have the agent respect a style you prefer, or provide instructions to avoid repeating yourself.

**Files:** [CLAUDE.md](files/CLAUDE.md)

```
Create a commit message for the staged changes
```

**Result:** [example result](files/commit-message.md)

## Environmental Awareness

**Why:** Inform your agent about all the cli tools, containers, browsers etc. available for its use. The more tools it has the more it can do for you, you can even make it aware of custom tools you create. This is highly personal to the workspace you design for the agent. You may also realize that you can have multiple claude.md files depending on where the agent runs.


**Files:** [CLAUDE.md](files/environment-CLAUDE.md)

## Notes

- CLAUDE.md is loaded at the start of every session, so rules stick without re-prompting.
- Keep rules imperative and testable ("always run X", "never do Y"), so you can see them take effect immediately.
- See [`files/CLAUDE.md`](./files/CLAUDE.md) for a ready-to-adapt block.
