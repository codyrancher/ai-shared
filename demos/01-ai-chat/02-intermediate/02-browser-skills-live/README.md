# 2. Screenshots, videos, and browser control from the CLI

> **AI Chat › Intermediate** in the [AI Presentation](../../../../README.md)

**Goal:** Drive the browser from the CLI to capture repros and fix demos, live.

## The idea

The browser skills turn "please reproduce this and film it" into one instruction. The agent iterates against the live UI, saves the click sequence as a Playwright script, and plays it back for one clean recording. Screenshots are useful precisely because they carry context: a pet peeve is issue screenshots cropped so tight you cannot tell where you are. Batch this across the backlog to find already-fixed issues or to hand someone a ready-made repro.

## Prompt

**Record a before video**

```
Reproduce issue #<N> against the live Rancher and record a before video. Use the
my-browser-record-video skill: iterate to find the exact click sequence, save it as
a Playwright script, then play it back with browser.mjs record-script so the
recording is one clean take.
```

**Labeled before/after comparison**

```
Take a labeled before/after comparison screenshot of the affected page with
my-browser-screenshot-comparison, master versus this branch, and draw a red box
around the element that changed.
```

Full prompt text: [`prompt.md`](./prompt.md)

## What to look for

- One clean recording, no agent-thinking dead air (it scripts first, records second).
- The comparison screenshot highlights exactly what changed.
- Screenshots keep enough surrounding context to be reproducible.

## Result

_Media pending. This demo IS the capture flow: record with `my-browser-record-video` ([`media/repro.webm`](./media/)) and compare with `my-browser-screenshot-comparison` ([`media/comparison.png`](./media/))._

## Skills & files

- `my-browser-record-video`, `my-browser-screenshot-comparison`, `my-video-censor-ip`
