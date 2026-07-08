---
name: summarize-issue
description: Turn a GitHub issue thread into a tight reproduction plus a proposed fix. Use when handed an issue number or URL and asked to triage it, scope it, or prepare it for someone to pick up. Produces a repro, root-cause hypothesis, and fix sketch, not a code change.
---

Condense a noisy issue thread into something someone can act on in two minutes: what
breaks, how to see it break, why it likely breaks, and where a fix would go.

## Inputs

- An issue number or URL in `rancher/dashboard` (or the repo in context).

## Procedure

1. **Fetch the thread.** Use `gh issue view <N> --comments` to pull the body and all
   comments. Note the reporter's version, browser, and cluster type if given.
2. **Extract the report.** In one or two sentences: what the user did, what happened,
   what they expected. Strip the back-and-forth down to the actual defect.
3. **Write a reproduction.** Numbered steps from a known start state (a fresh login),
   each step a single action. If the thread lacks enough detail to reproduce, say so
   and list exactly what is missing.
4. **Form a root-cause hypothesis.** Point at the component or area you believe is
   responsible, with a `file:line` reference where you can. Mark it as a hypothesis,
   not a conclusion, unless you verified it.
5. **Sketch the fix.** One paragraph: the approach, the files likely touched, and any
   risk or side effect. Do not implement it.
6. **Flag duplicates.** If the thread references or resembles other issues, list them.

## Output

A short markdown block with these headings: **Report**, **Reproduction**,
**Root-cause hypothesis**, **Fix sketch**, **Related**. Keep the whole thing under a
screen; link rather than quote long comments.

## Notes

- This skill triages and scopes. It does not commit code. When the summary is
  approved, the fix flow (reproduce, fix, verify, commit) takes over.
- Prefer `file:line` links over prose locations so the reader can jump straight in.
