# Stale Bot

Keep the backlog tidy on autopilot so no one has to babysit stale issues. A few lines run daily on their own, saving a recurring manual chore forever.

## The definition

```
/schedule daily at 08:00: Find open issues in rancher/dashboard with no activity in 90 days and no milestone or assignee. Post the standard stale warning. If an already-warned issue has been silent another 14 days, close it as stale with a short explanation and the stale label. Skip anything labeled keep or security.
```

See [`stale-bot.md`](files/stale-bot.md) for the full definition.

## Notes

- This is a scheduled routine, not an interactive prompt. It runs on cron with no one watching, so the guardrails matter more than the happy path.
- The two-stage design (warn, then close only after a further 14 days of silence) gives humans a window to intervene before anything is closed.
- The `keep` / `security` skip list is the safety valve. Expand it with any label that should never be auto-touched.
- Track outcomes so you can show the closed-issue count over time. That number is the whole pitch for running it.
