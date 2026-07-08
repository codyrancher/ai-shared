# 2. Bender (local pipeline / workflow)

> **Agentic** in the [AI Presentation](../../../README.md)

**Goal:** A local pipeline for solving issues end to end, built to iterate and to hand the team reusable prompts and skills.

## The idea

Bender came out of wanting to solve issues end to end and, along the way, produce prompts and skills the rest of the team can reuse. The point of the pipeline is to iterate: retry a prompt on a fresh context instead of digging out of a bad one. Show the interrogation tools on a past run, start a live run and open one of the live tools (browser or logs), and restart a stage without redoing the whole thing.

## What to show (walkthrough, not a single prompt)

```
1. The motivation: solve issues e2e, and harvest reusable prompts/skills for the team.
2. Iterate and retry prompts on fresh context instead of fighting a poisoned one.
3. The interrogation tools on a pre-existing run (inspect inputs, outputs, state per stage).
4. Start a run and open a live tool: the browser view or the streaming logs.
5. Restart a single stage without rerunning the whole pipeline.
```

Full walkthrough + notes: [`prompt.md`](./prompt.md) · [`files/bender-notes.md`](./files/bender-notes.md)

## What to look for

- Fresh-context retries beat trying to salvage a bad run.
- You can interrogate any prior run stage by stage.
- Live browser and log views while a run is in flight.
- Restarting one stage does not cost you the whole pipeline.

## Result

_Media pending._
- Record a live run with the browser / logs tools open → [`media/bender-run.webm`](./media/)
- Screenshot interrogating a past run → [`media/bender-interrogate.png`](./media/)

## Skills & files

- Notes: [`files/bender-notes.md`](./files/bender-notes.md)
- Capture: `my-browser-record-video`, `browser.mjs screenshot`
