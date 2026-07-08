# Prompt-only review pipeline - annotated

The whole pipeline is one prompt. This file breaks it into stages so you can see how
plain language maps onto fan-out, verify, and synthesis, and adapt it to other tasks.

## The prompt

```
Build me a review pipeline with no code, just orchestration. Stage 1: three agents
each read the current diff for a different concern (correctness, accessibility,
performance) and return findings as JSON. Stage 2: for each finding, spawn a skeptic
agent that tries to refute it, and drop anything a majority refutes. Stage 3:
synthesize the survivors into a single ranked review. Run it on the current branch
and show me the survivors.
```

## Stage by stage

### Stage 1 - fan-out (parallel finders)
Three agents, one concern each, so no single reviewer has to hold everything and the
three run at once. "Return findings as JSON" gives stage 2 a clean contract.

### Stage 2 - adversarial verify (a skeptic per finding)
Each finding gets its own skeptic whose job is to refute it. Majority-refuted
findings are dropped. This is what keeps plausible-but-wrong findings from reaching
you, which is the usual failure mode of a single-pass review.

### Stage 3 - synthesis (one ranked output)
The survivors are merged and ranked into a single review. You read one list, not
three overlapping ones.

## Adapt it

Same three moves work for many tasks. Swap the stages:

- **Research:** search many angles / dedup / verify each claim / write cited report.
- **Migration:** find all call sites / transform each / verify each still compiles.
- **Triage:** fetch issues / cluster / rank by impact.

## Note

No pipeline code is written. The agent orchestrates the fan-out, the per-finding
skeptics, and the merge from the description alone. If you want it deterministic and
repeatable, that same shape is what a Workflow script encodes, but for a one-off the
prompt is enough.
