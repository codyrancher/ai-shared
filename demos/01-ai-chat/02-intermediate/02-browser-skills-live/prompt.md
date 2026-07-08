# Prompt - Screenshots, videos, and browser control from the CLI

Paste into Claude Code in the harness project.

## Record a before video

```
Reproduce issue #<N> against the live Rancher and record a before video. Use the
my-browser-record-video skill: iterate to find the exact click sequence, save it as
a Playwright script, then play it back with browser.mjs record-script so the
recording is one clean take.
```

## Labeled before/after comparison

```
Take a labeled before/after comparison screenshot of the affected page with
my-browser-screenshot-comparison, master versus this branch, and draw a red box
around the element that changed.
```

## Notes

- The record skill iterates first, records second, so the final video has no "what do I click next" pauses. That is the whole trick to a clean take.
- Always `wait-for-sidecars browser` before recording; the browser sidecar takes several seconds to boot and CDP refuses connections until it is up.
- Batch the record prompt across a list of stale issues to find ones already fixed, or to attach a ready-made repro that lowers the bar for whoever picks the issue up.
- If the recording shows a dev IP in the URL bar or a form, scrub it with `my-video-censor-ip` before posting.
