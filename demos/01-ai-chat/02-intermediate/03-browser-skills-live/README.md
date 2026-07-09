# Screenshots, videos, and browser control from the CLI

> **AI Chat > Intermediate** demo in [AI Shared](../../../../README.md).

**Why:** Turn "reproduce this and film it" into one instruction, and batch it across the backlog while you work on something else.

## Record a before video

**Why:** Saves the manual click-and-screen-record loop, and hands the next person a ready-made repro instead of a vague description.

```
Reproduce issue #<N> against the live Rancher and record a before video. Use the my-browser-record-video skill: iterate to find the exact click sequence, save it as a Playwright script, then play it back with browser.mjs record-script so the recording is one clean take.
```

## Labeled before/after comparison

**Why:** No manual before/after cropping or arrow-drawing; the changed element is boxed for you.

```
Take a labeled before/after comparison screenshot of the affected page with my-browser-screenshot-comparison, master versus this branch, and draw a red box around the element that changed.
```

## What to look for

- One clean recording, no agent-thinking dead air (it scripts first, records second).
- The comparison screenshot highlights exactly what changed.
- Screenshots keep enough surrounding context to be reproducible.

## Skills & files

- `my-browser-record-video`
- `my-browser-screenshot-comparison`
- `my-video-censor-ip`

## Result

- `media/repro.webm` - A live-recorded reproduction (pending: my-browser-record-video)
- `media/comparison.png` - Master vs branch, changed element boxed (pending: my-browser-screenshot-comparison)

## Notes

- The record skill iterates first, records second, so the final video has no "what do I click next" pauses. That is the whole trick to a clean take.
- Always `wait-for-sidecars browser` before recording; the browser sidecar takes several seconds to boot and CDP refuses connections until it is up.
- Batch the record prompt across a list of stale issues to find ones already fixed, or to attach a ready-made repro that lowers the bar for whoever picks the issue up.
- If the recording shows a dev IP in the URL bar or a form, scrub it with `my-video-censor-ip` before posting.
