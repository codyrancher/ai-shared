# Release Captaincy Console — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Release captaincy is a rotating role built on a long, careful checklist: freeze
branches, cut release branches, bump versions in several places, update indexes,
manage milestones, chase post-release tags. It's manual, error-prone, and every new
captain has to re-learn it. Fully scripting it would mean coding every branch and
edge case up front.

## The approach

A **dashboard where each release step is a button that dispatches an agent**, with
live status and free-form asks against the same data. The process lives in prompts,
so it's executable, inspectable, self-improving, and recoverable rather than a
runbook a human hand-executes.

## Estimated time saved

| | Manual | Console |
| --- | --- | --- |
| Running a release's step list | ~a day of careful git/PR/version work | click the steps, review the PRs |
| Onboarding a rotating captain | read + shadow the runbook | the buttons + prompts are the runbook |
| Ad-hoc "what's blocking / what's the tag status" | manual digging | ask the board, answered on live data |
| Recovering a botched step | reverse-engineer what happened | hand the step's prompt + context to the AI |

**Headline:** the release lifecycle goes from a day of manual, error-prone work per
release (plus per-captain onboarding) to trigger-and-review, with on-demand analysis
and recovery because the whole process is expressed in prompts.

## Why AI (not a deterministic pipeline)

A rigid pipeline handles only what you coded. An agent-backed process handles high
volume and variety, feeds results back to improve itself, records more data on
request, and stays recoverable — you're maintaining English, not a codebase.
