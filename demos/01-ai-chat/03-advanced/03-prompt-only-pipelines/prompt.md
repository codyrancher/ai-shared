# Prompt - Pipelines and workflows from prompts alone (zero code)

Paste into Claude Code in the harness project.

```
Build me a review pipeline with no code, just orchestration. Stage 1: three agents
each read the current diff for a different concern (correctness, accessibility,
performance) and return findings as JSON. Stage 2: for each finding, spawn a skeptic
agent that tries to refute it, and drop anything a majority refutes. Stage 3:
synthesize the survivors into a single ranked review. Run it on the current branch
and show me the survivors.
```

## Notes

- The three moves that make this a real pipeline: fan-out (parallel reviewers), adversarial verify (a skeptic per finding), and synthesis (one ranked output). Name them explicitly and the agent wires them up.
- "Return findings as JSON" gives each stage a clean contract to hand to the next, without you writing any glue.
- Swap the concerns and stages for any task: research (search / dedup / verify / write), migration (find sites / transform / verify), triage (fetch / cluster / rank).
- See [`files/pipeline-prompt.md`](./files/pipeline-prompt.md) for a stage-by-stage annotated breakdown.
