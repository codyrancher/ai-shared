# Stale Bot

Keep the backlog tidy on autopilot so no one has to babysit stale issues. This was the first dip into agentic (as opposed to chat) interactions with AI: a routine that acts on its own rather than answering in a session. It replaced the former stalebot, which had no way to ignore label and milestone changes as "activity".

The workflow: [weekly-stale-issue-manager.md](https://github.com/rancher/dashboard/blob/master/.github/workflows/weekly-stale-issue-manager.md).

## The results

To date it has closed [43 stale issues](https://github.com/rancher/dashboard/issues?q=is%3Aissue%20state%3Aclosed%20label%3Abot%2Fstale-issue-manager%2Fclosed).
