# Dependabot Auto-Fixer — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Dependabot opens PRs for the alerts it can resolve mechanically — but a meaningful
share it **can't**: transitive dependencies, breaking major bumps, or fixes that
require touching our code. Those sit open, and clearing each one means a human
reading the advisory, tracing usage, and judging risk.

## The approach

An agent takes the alerts with **no Dependabot PR**, reads how the dependency is
actually used, decides the real fix (bump / replace / patch call sites / document as
not-exploitable), runs build + tests, and opens a PR with an explicit risk
write-up — or files an issue with analysis if it can't be fixed safely.

## Estimated time saved

| | Manual | Agent |
| --- | --- | --- |
| Per un-auto-fixable alert | ~1–3 hrs (read advisory, trace usage, judge risk, fix) | review the PR + risk note |
| A backlog of N such alerts | N × hours, usually deferred | one batched run, review-only time |
| Quality of decision | varies with who's on duty | consistent, always with written rationale |

**Headline:** the *expensive* half of dependency security — the alerts Dependabot
gives up on — moves from per-alert investigation to review-only, with a written risk
assessment attached to every change.

## Why AI fits here

The blocker is context, and context is what an agent can gather: it reads the code,
not just the manifest, so it can tell "reachable and dangerous" from "present but
not exploitable" and act accordingly.
