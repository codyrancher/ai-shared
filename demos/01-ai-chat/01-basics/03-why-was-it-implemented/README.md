# Asking why something was implemented a certain way

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Recover the lost reasoning behind odd code without digging through git blame, old PRs, and issues yourself.

## Recover the reasoning

**Why:** Saves the archaeology across history and threads, and tells you whether a workaround is now obsolete.

```
Why is <this function / component / workaround> written the way it is? Check git blame, the PR that introduced it, any linked issue, and nearby comments, then explain the reasoning in a few sentences. If it looks like a workaround, tell me exactly what it works around and whether that constraint still holds today.

(Swap the target for a real one, e.g. "why does the Steve proxy rewrite the Host header before forwarding".)
```

## What to look for

- It cites the introducing PR / issue, not just the current code.
- It separates "what it does" from "why it exists".
- For workarounds, it names the original constraint and checks if it still applies.

## Result

- `media/why.png` - Reasoning reconstructed from history (pending: browser.mjs screenshot)

## Notes

- Give it a concrete target (a function name, a file:line, a component). The more specific, the better the history trace.
- The "does this constraint still hold" clause is where it earns its keep: workarounds often outlive the bug they were dodging.
- Pairs well with the linked-report prompt (demo 2): first locate the code, then ask why it is that way.
