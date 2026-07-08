# Walkthrough - Bender (local pipeline / workflow)

This demo is a live tour of the pipeline, not a single paste-in prompt.

## The five beats

```
1. Motivation
   Solve issues end to end, and harvest reusable prompts/skills for the team as a
   side effect of every run.

2. Iterate on fresh context
   When a prompt goes sideways, retry it on a clean context instead of trying to
   argue the agent out of a poisoned one. Fresh beats salvage.

3. Interrogation tools (pre-existing run)
   Open a completed run and inspect it stage by stage: the inputs, the outputs, and
   the state each stage produced.

4. Live tools (new run)
   Start a run and open one of the live views: the browser sidecar or the streaming
   logs, while the run is still in flight.

5. Restart a stage
   Re-run a single stage without redoing the whole pipeline, so a late failure does
   not cost you the earlier work.
```

## Notes

- The reusable-prompts/skills output is the compounding payoff: every issue Bender works leaves behind a prompt or skill the team can run by hand next time.
- Fresh-context retries are the core habit this pipeline is built around; the interrogation and restart tools exist to make that cheap.
- See [`files/bender-notes.md`](./files/bender-notes.md) for the stage list and the interrogation/live tools to point at during the demo.
