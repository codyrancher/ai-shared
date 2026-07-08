# Prompt - Asking why something was implemented a certain way

Paste into Claude Code in the harness project.

```
Why is <this function / component / workaround> written the way it is? Check git
blame, the PR that introduced it, any linked issue, and nearby comments, then
explain the reasoning in a few sentences. If it looks like a workaround, tell me
exactly what it works around and whether that constraint still holds today.
```

## Notes

- Give it a concrete target (a function name, a file:line, a component). The more specific, the better the history trace.
- The "does this constraint still hold" clause is where it earns its keep: workarounds often outlive the bug they were dodging.
- Pairs well with the linked-report prompt (demo 2): first locate the code, then ask why it is that way.
