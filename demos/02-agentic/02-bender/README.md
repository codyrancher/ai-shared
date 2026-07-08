# Bender (local pipeline / workflow)

> **Agentic** demo in [AI Shared](../../../README.md).

**Why:** Retry on fresh context instead of babysitting one long run, and reuse what each run produces.

## What to show (walkthrough, not a single prompt)

**Why:** Fresh-context retries and single-stage restarts save you from nursing a poisoned run all the way to the end.

```
1. The motivation: solve issues e2e, and harvest reusable prompts/skills for the team.
2. Iterate and retry prompts on fresh context instead of fighting a poisoned one.
3. The interrogation tools on a pre-existing run (inspect inputs, outputs, and state per stage).
4. Start a run and open a live tool: the browser view or the streaming logs.
5. Restart a single stage without rerunning the whole pipeline.
```

## What to look for

- Fresh-context retries beat trying to salvage a bad run.
- You can interrogate any prior run stage by stage.
- Live browser and log views while a run is in flight.
- Restarting one stage does not cost you the whole pipeline.

## Skills & files

- [`bender-notes.md`](files/bender-notes.md)

## Result

- `media/bender-run.webm` - A live run with the browser / logs tools open (pending: my-browser-record-video)
- `media/bender-interrogate.png` - Interrogating a past run (pending: browser.mjs screenshot)

## Notes

- The reusable-prompts/skills output is the compounding payoff: every issue Bender works leaves behind a prompt or skill the team can run by hand next time.
- Fresh-context retries are the core habit this pipeline is built around; the interrogation and restart tools exist to make that cheap.
- See [`files/bender-notes.md`](./files/bender-notes.md) for the stage list and the interrogation/live tools to point at during the demo.
