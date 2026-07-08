# Bender (local pipeline / workflow)

> **Agentic** demo in [AI Shared](../../../README.md).

**Why:** Retry on fresh context instead of babysitting one long run, and reuse what each run produces.

## What to look for

- Fresh-context retries beat trying to salvage a bad run.
- You can interrogate any prior run stage by stage.
- Live browser and log views while a run is in flight.
- Restarting one stage does not cost you the whole pipeline.

## Prompts

See [`prompt.md`](./prompt.md).

## Skills & files

- [`bender-notes.md`](files/bender-notes.md)

## Result

- _Pending:_ A live run with the browser / logs tools open (capture with `my-browser-record-video`), save as `media/bender-run.webm`
- _Pending:_ Interrogating a past run (capture with `browser.mjs screenshot`), save as `media/bender-interrogate.png`
