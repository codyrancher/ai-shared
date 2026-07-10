# Authoring Skills

> **AI Chat > Intermediate** demo in [AI Shared](../../../../README.md).

**Why:** Stop re-explaining a repeated task; capture it once so you and the team trigger it with one word.

## Codify a repeated task

**Why:** Turns a paragraph you keep retyping into a one-word command the whole team shares.

```
I keep repeating this task: turn a GitHub issue thread into a tight reproduction plus a proposed fix. Turn it into a reusable skill. Create .claude/skills/summarize-issue/SKILL.md with YAML frontmatter (name, and a description that says when to use it) and a concise step-by-step playbook. Match the voice and structure of my existing my-* skills.
```

**Result:** [example result](files/result.md)

## Skills & files

- `my-commit-create`
- `my-pr-create`
- [`example-skill/SKILL.md`](files/example-skill/SKILL.md)

## Notes

- The frontmatter `description` is what the agent matches on to auto-invoke the skill. Write it as a trigger: "Use when...". A vague description means the skill never fires.
- Point the agent at an existing `my-*` skill as a style reference so the new one fits the house style.
- Skills can ship helper scripts alongside `SKILL.md` (see `my-browser-record-video`'s `.mjs` files). Ask for those too when the task has a scripted step.
- See [`files/example-skill/SKILL.md`](./files/example-skill/SKILL.md) for a representative result.
