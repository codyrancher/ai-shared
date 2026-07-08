# 2. Querying the codebase for a linked report

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Ask a question about the codebase and get back a report whose every claim links to a file and line.

## The idea

Instead of grepping around yourself, ask for an orientation report. The value is not just the answer, it is that each point is a clickable file:line, so you can verify and jump straight to the code. Great for onboarding onto an unfamiliar area.

## Prompt

```
Give me a short orientation report on how cluster provisioning is wired in this
dashboard. Cover: the route and entry component, the store modules involved, and
where the create/update API calls are made. Every claim must link to an exact file
and line. Cap it at 15 bullets and end with the 3 files I should read first.
```

Full prompt text: [`prompt.md`](./prompt.md)

## What to look for

- Each bullet ends in a file:line reference you can click.
- The "read these 3 first" list is a genuine shortcut into the area.
- No hand-wavy claims: if it cannot point at code, it says so.

## Result

_Media pending. Screenshot the rendered report with `browser.mjs screenshot` and save it at [`media/report.png`](./media/)._

## Skills & files

- Capture: `browser.mjs screenshot`
