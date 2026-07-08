# 3. Pipelines and workflows from prompts alone (zero code)

> **AI Chat › Advanced** in the [AI Presentation](../../../../README.md)

**Goal:** Describe a multi-stage, multi-agent pipeline in plain language and have it run, no code written.

## The idea

You can specify fan-out, verification, and synthesis as prose and the agent orchestrates it. Here: three reviewers each take one concern, a skeptic tries to refute every finding, and the survivors get synthesized into one ranked review. No script, just the shape of the pipeline described well.

## Prompt

```
Build me a review pipeline with no code, just orchestration. Stage 1: three agents
each read the current diff for a different concern (correctness, accessibility,
performance) and return findings as JSON. Stage 2: for each finding, spawn a skeptic
agent that tries to refute it, and drop anything a majority refutes. Stage 3:
synthesize the survivors into a single ranked review. Run it on the current branch
and show me the survivors.
```

Full prompt text: [`prompt.md`](./prompt.md) · Annotated version: [`files/pipeline-prompt.md`](./files/pipeline-prompt.md)

## What to look for

- Fan-out, adversarial verify, and synthesis all come from the prompt.
- Refuted findings get dropped before they reach you.
- No pipeline code exists, yet it runs like one.

## Result

_Media pending. Screenshot the pipeline running with `browser.mjs screenshot`; save at [`media/pipeline.png`](./media/)._

## Skills & files

- Annotated version: [`files/pipeline-prompt.md`](./files/pipeline-prompt.md)
- Capture: `browser.mjs screenshot`
