# Agentic Issue Triage — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Before anyone can fix a bug, someone has to open the codebase, trace how the reported
behavior happens, and figure out where the fix goes. That investigation pass is the
slow, skilled part of triage — and it's repeated cold for every issue, often by the
most expensive people.

## The approach

A **scheduled agent with repo access** does the investigation automatically: it
root-causes the bug in the code (file + line + mechanism), reasons by analogy against
working parts of the codebase, proposes a concrete fix with a preferred option, and
attaches repro steps — posted as a triage comment.

## Estimated time saved

| | Manual triage | Agentic triage |
| --- | --- | --- |
| Locating the root cause | engineer reads code cold, per issue | done up front, with file/line |
| Deciding the fix approach | from scratch | a ranked proposal to accept/adjust |
| Who does it | often senior time | the agent; humans verify |
| When it happens | when someone gets to it | automatically, on new issues |

**Headline:** the code-reading pass that normally *precedes* every fix is delivered
with the issue, so engineers start from a root-caused analysis and a candidate patch
instead of a blank report.

## Caveat that matters

The analysis is a **hypothesis**, not a verified fix. Some triages will be wrong —
but even a wrong, *specific* analysis (this file, this line, this mechanism) points
the investigation somewhere concrete, which is still faster than starting cold.

## Metrics to capture later

- Share of triages whose root-cause file was correct.
- Time-to-first-diff on triaged vs untriaged issues.
