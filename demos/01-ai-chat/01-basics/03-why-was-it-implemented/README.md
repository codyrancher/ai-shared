# 3. Asking why something was implemented a certain way

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Recover the reasoning behind a piece of code from history, not just what it does.

## The idea

The "what" is in the code; the "why" is usually in git history, the PR that introduced it, a linked issue, or a terse comment. Ask the agent to reconstruct the reasoning. Especially useful for code that looks odd, where the answer is often "it works around X".

## Prompt

```
Why is <this function / component / workaround> written the way it is? Check git
blame, the PR that introduced it, any linked issue, and nearby comments, then
explain the reasoning in a few sentences. If it looks like a workaround, tell me
exactly what it works around and whether that constraint still holds today.
```

Swap the target for a real one, e.g. "why does the Steve proxy rewrite the Host header before forwarding".

Full prompt text: [`prompt.md`](./prompt.md)

## What to look for

- It cites the introducing PR / issue, not just the current code.
- It separates "what it does" from "why it exists".
- For workarounds, it names the original constraint and checks if it still applies.

## Result

_Media pending. Screenshot the answer with `browser.mjs screenshot` and save it at [`media/why.png`](./media/)._

## Skills & files

- Capture: `browser.mjs screenshot`
