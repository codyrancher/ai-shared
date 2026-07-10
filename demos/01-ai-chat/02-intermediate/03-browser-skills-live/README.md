# Browser Control

> **AI Chat > Intermediate** demo in [AI Shared](../../../../README.md).

**Why:** Turn "reproduce this and film it" into one instruction, and batch it across the backlog while you work on something else.

## Take a screenshot

**Why:** Grab the current state of a page without leaving the terminal or wiring up any tooling.

```
Take a screenshot of [the cluster management page] on the live Rancher and save it to disk.
```

## Verify your change visually

**Why:** Confirm a fix actually works in the real UI instead of trusting that the diff and the tests look right.

```
Verify [my change] by driving the affected page on the live Rancher and taking a screenshot. Confirm the new behavior shows up, not just that the tests pass.
```

## Record a video

**Why:** Capture a short screen recording of a flow, hands-free and in one clean take.

```
Record a short video of [the flow I describe] on the live Rancher using the my-browser-record-video skill. Iterate to find the exact click sequence first, then play it back so the recording is one clean take.
```

## Reproduce an issue

**Why:** Turn a vague bug report into a verified, filmed repro the next person can just watch.

```
Reproduce issue #[N] against the live Rancher, then record the repro as one clean video.
```

## Skills & files

- `my-browser-record-video`
- `my-video-censor-ip`

## Notes

- The record skill iterates first, records second, so the final video has no "what do I click next" pauses. That is the whole trick to a clean take.
- Always `wait-for-sidecars browser` before recording; the browser sidecar takes several seconds to boot and CDP refuses connections until it is up.
- Batch the record prompt across a list of stale issues to find ones already fixed, or to attach a ready-made repro that lowers the bar for whoever picks the issue up.
- If the recording shows a dev IP in the URL bar or a form, scrub it with `my-video-censor-ip` before posting.
