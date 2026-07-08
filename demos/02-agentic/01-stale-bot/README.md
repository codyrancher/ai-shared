# 1. Stale bot

> **Agentic** in the [AI Presentation](../../../README.md)

**Goal:** A tiny scheduled agent that warns and closes stale issues, defined in a few lines.

## The idea

The whole thing is a short scheduled prompt: find issues gone quiet, warn them, and close the ones that stay quiet, with an escape hatch for anything labeled `keep` or `security`. Two things to show: how small the definition is, and the running count of issues it has already closed. Small definition, real ongoing leverage.

## Definition (prompt)

```
/schedule daily at 08:00: Find open issues in rancher/dashboard with no activity in
90 days and no milestone or assignee. Post the standard stale warning. If an
already-warned issue has been silent another 14 days, close it as stale with a short
explanation and the stale label. Skip anything labeled keep or security.
```

Full definition: [`prompt.md`](./prompt.md) · Notes: [`files/stale-bot.md`](./files/stale-bot.md)

## What to look for

- The entire bot is a handful of lines of plain language.
- It has an escape hatch (`keep` / `security`) so it stays safe unattended.
- The closed-issue count shows the compounding value over time.

## Result

_Media pending._
- Screenshot the schedule definition → [`media/definition.png`](./media/)
- Screenshot the closed-issue count → [`media/closed-count.png`](./media/)

## Skills & files

- Notes / guardrails: [`files/stale-bot.md`](./files/stale-bot.md)
- Capture: `browser.mjs screenshot`
