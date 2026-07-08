# Asking why something was implemented a certain way

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Recover the lost reasoning behind odd code without digging through git blame, old PRs, and issues yourself.

## What to look for

- It cites the introducing PR / issue, not just the current code.
- It separates "what it does" from "why it exists".
- For workarounds, it names the original constraint and checks if it still applies.

## Prompts

See [`prompt.md`](./prompt.md).

## Result

- _Pending:_ Reasoning reconstructed from history (capture with `browser.mjs screenshot`), save as `media/why.png`
