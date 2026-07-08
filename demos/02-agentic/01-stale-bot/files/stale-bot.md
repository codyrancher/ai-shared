# Stale bot - notes and guardrails

A scheduled routine that runs unattended, so the guardrails matter more than the
happy path.

## The definition

```
/schedule daily at 08:00: Find open issues in rancher/dashboard with no activity in
90 days and no milestone or assignee. Post the standard stale warning. If an
already-warned issue has been silent another 14 days, close it as stale with a short
explanation and the stale label. Skip anything labeled keep or security.
```

## Guardrails

- **Two stages, not one.** Warn first; only close after a further 14 days of silence.
  That window is the human's chance to intervene.
- **Skip list.** Never touch anything labeled `keep` or `security`. Add more labels
  as needed (for example `pinned`, `roadmap`).
- **Scope.** Only issues with no milestone and no assignee. Anything someone owns or
  has scheduled is off limits.
- **Voice.** The warning and close comments should be short, kind, and explain how to
  keep the issue open (comment, or add the `keep` label).

## What to show in the demo

1. **The definition** is a handful of lines. That is the point: a useful unattended
   agent does not need a codebase.
2. **The count** of issues it has warned and closed to date. That number is the
   payoff and grows on its own.

## Tracking

Have the routine append a line per action (warned / closed, issue number, date) to a
log so the running totals are easy to screenshot for the demo.
