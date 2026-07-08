# /loop over the whole issue backlog

Paste into Claude Code in the harness project.

## The /loop prompt

**Why:** Turns hours of manual reading into a ranked report of duplicates and hotspots.

```
/loop Fetch every open issue in rancher/dashboard via gh. Each iteration, take the next batch on a fresh context and build up two things: clusters of duplicate or near-duplicate issues, and a heatmap of which files or areas the issues point at. Append results to issues-report.md as you go, never overwrite. Stop when all issues are processed, then print the top 10 hotspots and the largest duplicate clusters.
```

## Notes

- `/loop` re-runs the prompt on a fresh context each pass. That is the point: a 400-issue backlog would blow one context and the analysis would degrade near the end. Batches keep every pass sharp.
- "Append, never overwrite" makes the report the durable state between passes, so no single context has to hold everything.
- This is a read-only analysis prompt. It pairs with the self-loop fix prompt (advanced 1): use this to triage, that to fix.
- See [`files/issues-report.sample.md`](./files/issues-report.sample.md) for the shape of the output (illustrative, not live data).
