# Large Dataset Analysis

> **AI Chat > Advanced** demo in [AI Shared](../../../../README.md).

**Why:** Run an AI analysis across a dataset too large to fit in one context, in scheduled batches, until the whole thing is covered.

## The /loop prompt

**Why:** Turns a 1,000-issue backlog into a ranked report of duplicate clusters and code hot-spots, without reading any of it yourself.

**Files:** [analysis.prompt.md](files/analysis.prompt.md)

```
/loop 1h @analysis.prompt.md
```

**Result:** [example result](files/analysis-final.md)

## Notes

- `/loop 1h` re-runs the prompt on a fresh context on an interval. That is the point: 1,000+ rows would blow one context, so each pass takes the next batch (100 here) and the analysis stays sharp to the end.
- The prompt lives in its own file (`@analysis.prompt.md`), so the loop replays the exact same instruction every pass. Results are written back to the source DB, which makes the run resumable and lets the dashboard visualize them.
- This is a read-only analysis pattern. It pairs with the self-loop fix prompt (advanced 1): use this to triage, that to fix.
