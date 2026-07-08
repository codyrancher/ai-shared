# 1. Making your own skills

> **AI Chat › Intermediate** in the [AI Presentation](../../../../README.md)

**Goal:** Turn a repeated task into a reusable skill the whole team can invoke.

## The idea

A skill is a small markdown playbook with YAML frontmatter (name + a description that says when to use it). Once it lives in `.claude/skills`, the agent discovers it and follows it every time, so a task you keep re-explaining becomes one word. The `my-*` skills in this repo are exactly this pattern.

## Prompt

```
I keep repeating this task: turn a GitHub issue thread into a tight reproduction
plus a proposed fix. Turn it into a reusable skill. Create
.claude/skills/summarize-issue/SKILL.md with YAML frontmatter (name, and a
description that says when to use it) and a concise step-by-step playbook. Match
the voice and structure of my existing my-* skills.
```

Full prompt text: [`prompt.md`](./prompt.md) · Example output: [`files/example-skill/SKILL.md`](./files/example-skill/SKILL.md)

## What to look for

- Frontmatter description is written as a trigger ("use when..."), so discovery works.
- The body is a short playbook, not prose.
- It reads like the existing `my-*` skills, so the team recognizes the shape.

## Result

_Media pending. Screenshot the generated SKILL.md with `browser.mjs screenshot`; save at [`media/skill.png`](./media/)._

## Skills & files

- Example output: [`files/example-skill/SKILL.md`](./files/example-skill/SKILL.md)
- Related: `my-commit-create`, `my-pr-create`
- Capture: `browser.mjs screenshot`
