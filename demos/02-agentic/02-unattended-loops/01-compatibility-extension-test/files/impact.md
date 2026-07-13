# Compatibility Extension Tests — impact

*Rough estimates to frame the value, not audited metrics. Tweak with real numbers.*

## The problem we're solving

An extension has to keep working across **every supported Rancher version**. Each
version can break selectors, APIs, or timing in the E2E suite. Diagnosing a
failure, fixing it, re-running the whole matrix, and repeating — per version, per
release — is slow, repetitive, and easy to defer until it rots.

## The approach

A **single long-running agent** with one goal: *make the matrix pass*. It triggers
the workflow, reads per-version results, roots-causes the first failure, applies
the smallest real fix, and re-triggers — looping on fresh context until green. The
same loop is later pointed at flakiness detection.

The reason it works: the **complex, one-time work was done first** — a full test
spec (delivered as a PDF) and a reproducible environment harness. That leaves the
agent facing only small, self-checkable deltas each pass.

Example run: [compatibility E2E across versions](https://github.com/marcelofukumoto/dashboard/actions/runs/29103760172) (the enabling PR is ~107 changed files of scaffolding).

## Estimated time saved

| | Manual | Agent loop |
| --- | --- | --- |
| Per version bump (diagnose + fix + rerun) | ~1–2 engineer-days | overnight unattended + ~30 min review |
| Full supported matrix each release | multi-day, often deferred | one loop, review the summary |
| Flakiness sweep | ad-hoc, rarely done | re-run the same loop, no new work |

**Headline:** turns a recurring, deferred multi-day chore into an unattended
overnight loop with a short human review at the end.

## Why it generalizes

Any goal that is (a) expensive to set up but (b) cheap to *check* automatically is a
fit: do the hard setup once, then let a guarded loop grind the simple cases as long
as it takes.
