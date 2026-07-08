# Bender - notes for the walkthrough

Bender is a local pipeline for solving issues end to end. The original motivation was
two-fold: actually close issues, and harvest reusable prompts and skills for the rest
of the team while doing it.

## The five beats to demo

1. **Motivation.** Solve issues e2e; every run also leaves behind prompts/skills the
   team can reuse by hand.
2. **Iterate on fresh context.** When a stage goes sideways, retry it on a clean
   context rather than arguing the agent out of a poisoned one. Fresh beats salvage.
3. **Interrogation tools (past run).** Open a completed run and inspect it stage by
   stage: inputs, outputs, and the state each stage produced.
4. **Live tools (new run).** Start a run and open a live view (browser sidecar or
   streaming logs) while it is still in flight.
5. **Restart a stage.** Re-run one stage without redoing the whole pipeline, so a
   late failure does not throw away the earlier work.

## Why it is built this way

- The core habit is fresh-context retries. The interrogation and restart tools exist
  to make that habit cheap: you can see what a stage did, then re-run just that stage.
- Live browser + logs mean you are never guessing what a run is doing right now.

## Demo checklist

- [ ] A pre-existing run to interrogate (pick one with an interesting failure).
- [ ] A fresh run to start live, with the browser or logs view ready to open.
- [ ] A stage worth restarting to show the partial re-run.
- [ ] One reusable prompt or skill that came out of a past run, to make the
      "harvest for the team" point concrete.
