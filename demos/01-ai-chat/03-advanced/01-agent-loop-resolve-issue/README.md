# An agent that loops on itself to resolve an issue

> **AI Chat > Advanced** demo in [AI Shared](../../../../README.md).

**Why:** Let the agent grind an issue to green on its own while you focus on something else.

## What to look for

- A real done condition ("do not stop until it is green") keeps it iterating.
- It verifies itself: before/after video, lint, tests, re-reading the diff.
- Same shape as my-code-autofix, just fired by hand.

## Prompts

See [`prompt.md`](./prompt.md).

## Skills & files

- `my-code-autofix`
- `my-commit-create`

## Result

- _Pending:_ The agent iterating to green (capture with `my-browser-record-video`), save as `media/self-loop.webm`
