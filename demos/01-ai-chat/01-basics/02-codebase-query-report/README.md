# Querying the codebase for a linked report

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Onboard onto an unfamiliar area in minutes instead of grepping around for an hour, with links you can jump straight into.

## Orientation report

**Why:** Skips the manual code spelunking. You get a verifiable map with file:line links instead of reading the whole subsystem yourself.

```
Give me a short orientation report on how cluster provisioning is wired in this dashboard. Cover: the route and entry component, the store modules involved, and where the create/update API calls are made. Every claim must link to an exact file and line. Cap it at 15 bullets and end with the 3 files I should read first.
```

**Result:** [example result](files/result.md)

## What to look for

- Each bullet ends in a file:line reference you can click.
- The "read these 3 first" list is a genuine shortcut into the area.
- No hand-wavy claims: if it cannot point at code, it says so.

## Result

- `media/report.png` - A report with clickable file:line links (pending: browser.mjs screenshot)

## Notes

- Swap "cluster provisioning" for whatever area you are onboarding onto.
- "Every claim must link to an exact file and line" is the load-bearing clause: it forces verifiable output and clickable references in the IDE.
- Cap the length so you get an orientation, not a wall of text. Ask a follow-up to zoom into any single bullet.
