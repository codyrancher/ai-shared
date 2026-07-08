# Pipelines and workflows from prompts alone (zero code)

> **AI Chat > Advanced** demo in [AI Shared](../../../../README.md).

**Why:** Get a multi-agent workflow without writing or maintaining any pipeline code.

## Describe the pipeline

**Why:** Fan-out, verification, and synthesis from a paragraph, so you skip building and maintaining the harness.

```
Build me a review pipeline with no code, just orchestration. Stage 1: three agents each read the current diff for a different concern (correctness, accessibility, performance) and return findings as JSON. Stage 2: for each finding, spawn a skeptic agent that tries to refute it, and drop anything a majority refutes. Stage 3: synthesize the survivors into a single ranked review. Run it on the current branch and show me the survivors.
```

## What to look for

- Fan-out, adversarial verify, and synthesis all come from the prompt.
- Refuted findings get dropped before they reach you.
- No pipeline code exists, yet it runs like one.

## Skills & files

- [`pipeline-prompt.md`](files/pipeline-prompt.md)

## Result

- `media/pipeline.png` - A prompt-defined review pipeline running (pending: browser.mjs screenshot)

## Notes

- The three moves that make this a real pipeline: fan-out (parallel reviewers), adversarial verify (a skeptic per finding), and synthesis (one ranked output). Name them explicitly and the agent wires them up.
- "Return findings as JSON" gives each stage a clean contract to hand to the next, without you writing any glue.
- Swap the concerns and stages for any task: research (search / dedup / verify / write), migration (find sites / transform / verify), triage (fetch / cluster / rank).
- See [`files/pipeline-prompt.md`](./files/pipeline-prompt.md) for a stage-by-stage annotated breakdown.
