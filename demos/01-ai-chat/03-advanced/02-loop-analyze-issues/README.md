# 2. /loop over the whole issue backlog

> **AI Chat › Advanced** in the [AI Presentation](../../../../README.md)

**Goal:** Use /loop to analyze every open issue for hotspots and duplication / similarity.

## The idea

A real prompt I use: `/loop` runs a task repeatedly, each iteration on a fresh context so quality does not decay across a long backlog. It processes the open issues in batches, accumulates clusters of near-duplicates and a heatmap of which files the issues point at, and appends to a report as it goes.

## Prompt

```
/loop Fetch every open issue in rancher/dashboard via gh. Each iteration, take the
next batch on a fresh context and build up two things: clusters of duplicate or
near-duplicate issues, and a heatmap of which files or areas the issues point at.
Append results to issues-report.md as you go, never overwrite. Stop when all issues
are processed, then print the top 10 hotspots and the largest duplicate clusters.
```

Full prompt text: [`prompt.md`](./prompt.md) · Sample output: [`files/issues-report.sample.md`](./files/issues-report.sample.md)

## What to look for

- Fresh context each iteration keeps late batches as sharp as the first.
- Results accumulate in a file instead of living in one giant context.
- Output is directly useful: dedupe candidates and where to focus.

## Result

_Media pending. Screenshot the accumulated report with `browser.mjs screenshot`; save at [`media/issues-report.png`](./media/)._

## Skills & files

- Sample output: [`files/issues-report.sample.md`](./files/issues-report.sample.md)
- Capture: `browser.mjs screenshot`
