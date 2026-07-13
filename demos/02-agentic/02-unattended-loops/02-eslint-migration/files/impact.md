# ESLint v7 → v10 migration — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

The repo is stuck on ESLint v7. Two majors of drift (v9's flat config, then v10)
means: deprecated rules to port, config format changes, and thousands of resulting
lint errors to resolve — all without changing application behavior or quietly
turning rules off to "make it pass."

## The approach

An agent in a **lint → fix → re-lint loop** with two non-negotiable rules: don't
disable/relax rules to pass, and don't change runtime behavior. It carries the v7
rule *behavior* through the v9 flat-config port, drives errors to zero, then repeats
the (smaller) v9 → v10 step.

## Estimated time saved

| Phase | Manual | Agent loop |
| --- | --- | --- |
| v7 → v9 (flat config + deprecated-rule ports + fix fallout) | ~1–2 weeks, stop-start | mostly unattended; review the config diff |
| v9 → v10 | ~2–4 days | short loop + review |
| Risk of silently weakening rules | high (tempting shortcut) | blocked by the anti-cheat clause |

**Headline:** a multi-week, morale-draining migration becomes largely unattended
loop time, with human attention spent on reviewing a behavior-preserving diff
instead of grinding lint errors.

## Why it works

The goal is objectively checkable (lint exits clean) but reachable many ways —
including bad ones. Pinning the definition of "done" to *behavior-equivalent, no
rules disabled* is what turns a cheap-to-fake check into a real result.
