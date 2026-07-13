# Daily Issue Grooming — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Issues arrive incomplete: no acceptance criteria, no affected component, no clear
repro. Someone (a lead or PM) has to notice, ask the reporter, wait, and re-check —
per issue — before an engineer can safely start. That grooming is slow, inconsistent,
and often skipped, so engineers inherit vague tickets.

## The approach

A **scheduled agent** scores each open issue against a fixed four-point checklist
(clear problem, acceptance criteria, technical details, reproducibility). It posts
targeted questions for only the missing pieces, and when the reporter responds it
re-evaluates and marks which criteria are now met — advancing the issue when all four
are satisfied.

## Estimated time saved

| | Manual grooming | Scheduled agent |
| --- | --- | --- |
| Reviewing an issue for completeness | lead/PM time, per issue | automatic, daily |
| Reporter round-trip | someone must chase, then re-check | async comment thread, self-re-checked |
| Consistency of standard | varies by who grooms | identical checklist every time |
| Backlog coverage | whatever there's time for | every open issue, every day |

**Headline:** grooming becomes a consistent, asynchronous, always-on process —
engineers inherit scoped, testable issues, and no human spends recurring time
chasing missing fields.

## Why AI fits

Judging "is this issue complete and testable?" is a language task, not a rules
engine — the agent reads the issue like a reviewer would, asks for precisely what's
missing, and recognizes when a follow-up actually resolved the gap.

## Metrics to capture later

- Share of issues that reach "all four criteria met" without human intervention.
- Reduction in time-to-ready (filed → workable).
