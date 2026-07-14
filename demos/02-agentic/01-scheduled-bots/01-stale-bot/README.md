# Stale Bot

> **Agentic > Scheduled repo bots** demo in [AI Shared](../../../../README.md).

**Why:** Keep the backlog tidy on autopilot so no one has to babysit stale issues.

## The definition

**Why:** A few lines run daily on their own, saving a recurring manual chore forever.

```
/schedule daily at 08:00: Find open issues in rancher/dashboard with no activity in 90 days and no milestone or assignee. Post the standard stale warning. If an already-warned issue has been silent another 14 days, close it as stale with a short explanation and the stale label. Skip anything labeled keep or security.
```

Live definition running in the repo: [`weekly-stale-issue-manager.md`](https://github.com/rancher/dashboard/blob/master/.github/workflows/weekly-stale-issue-manager.md?plain=1). It replaced the former stalebot, which had no way to ignore label/milestone changes as "activity."

## Skills & files

- [`stale-bot.md`](files/stale-bot.md)

## Notes

- This was the first dip into agentic (vs. chat) interactions with AI — a routine that acts on its own rather than answering in a session.
- This is a scheduled routine, not an interactive prompt. It runs on cron with no one watching, so the guardrails matter more than the happy path.
- The two-stage design (warn, then close only after a further 14 days of silence) gives humans a window to intervene before anything is closed.
- The `keep` / `security` skip list is the safety valve. Expand it with any label that should never be auto-touched.
- Track outcomes so you can show the closed-issue count over time; that number is the whole pitch for running it. To date it has closed [43 stale issues](https://github.com/rancher/dashboard/issues?q=is%3Aissue%20state%3Aclosed%20label%3Abot%2Fstale-issue-manager%2Fclosed). See [`files/stale-bot.md`](./files/stale-bot.md).
