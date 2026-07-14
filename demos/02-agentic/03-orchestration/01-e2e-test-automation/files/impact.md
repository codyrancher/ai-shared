# E2E Test Automation (multi-agent) — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Writing E2E coverage for a feature is slow and skilled work: understand the feature,
plan what to cover, write a Cypress spec plus page objects, stand up an environment,
run it, and debug the failures — often flaky ones. It's exactly the work teams skip
when they're busy, which is how coverage rots.

## The approach

A **pipeline of specialized agents** over a shared-memory branch, each doer paired
with a verifier that grades and gates:

- **Phase 1 (plan):** planner → plan-verifier → plan-fixer. Validate the plan
  (selectors exist, coverage real) *before* writing code.
- **Phase 2 (spec):** writer → runner → spec-verifier → spec-fixer, with the runner
  actually executing Cypress and the verifier parsing the log to grade pass/fail.
- Bounded loops (≈5 attempts) escalate to a human instead of spinning; learnings
  persist across runs.

## Estimated time saved

| | Manual | Orchestration |
| --- | --- | --- |
| One feature's E2E (plan + spec + page objects + debug) | ~0.5–1.5 engineer-days | unattended run + review |
| Cost per full test run | engineer salary time | pennies-scale compute (the headline finding) |
| Failure-loop risk | human notices and stops | verifier gates; capped attempts escalate |
| Throughput | serial, as time allows | many features in parallel |

**Headline:** feature E2E coverage drops from ~a day of skilled work each to an
unattended orchestration that costs a rounding error in compute — and the
verify-and-grade design is what makes the output trustworthy enough to merge.

Example run: [rancher-ai-ui#228](https://github.com/rancher/rancher-ai-ui/pull/228).

## Why multi-agent (not one big agent)

- **Specialization** keeps each agent's context small and its job checkable.
- **Verifier gates** define "done" objectively and stop failure loops.
- **Plan-then-execute** front-loads the cheap checks before expensive runs.
