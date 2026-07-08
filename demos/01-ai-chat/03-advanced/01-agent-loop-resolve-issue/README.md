# 1. An agent that loops on itself to resolve an issue

> **AI Chat › Advanced** in the [AI Presentation](../../../../README.md)

**Goal:** Prompt the agent so it keeps going, reproduce to fix to verify, until the issue is actually resolved.

## The idea

With the right prompt the agent runs the whole fix loop unattended: reproduce, fix, verify the repro is gone, run lint and tests, and go back if anything fails. The key is giving it a clear done condition and the means to check itself (record a before and after, re-read its own diff). This is the same loop `my-code-autofix` fires automatically on a fresh project.

## Prompt

```
Work issue #<N> end to end and do not stop until it is green. Loop: reproduce it
against the live Rancher and record a before video, find and apply the fix, verify
the repro no longer happens and record an after video, run yarn lint and the
relevant tests, and if anything fails go back and fix it. When it is all passing,
commit on a branch named issue-<N> using the my-commit-create skill. Re-read your
own diff and the issue before you call it done.
```

Full prompt text: [`prompt.md`](./prompt.md)

## What to look for

- A real done condition ("do not stop until it is green") keeps it iterating.
- It verifies itself: before/after video, lint, tests, re-reading the diff.
- Same shape as `my-code-autofix`, just fired by hand.

## Result

_Media pending. Record the agent iterating to green with `my-browser-record-video`; save at [`media/self-loop.webm`](./media/)._

## Skills & files

- `my-code-autofix` (fires this loop automatically), `my-commit-create`
- Capture: `my-browser-record-video`
