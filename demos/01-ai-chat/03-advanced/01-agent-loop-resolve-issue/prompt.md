# Prompt - An agent that loops on itself to resolve an issue

Paste into Claude Code in the harness project.

```
Work issue #<N> end to end and do not stop until it is green. Loop: reproduce it
against the live Rancher and record a before video, find and apply the fix, verify
the repro no longer happens and record an after video, run yarn lint and the
relevant tests, and if anything fails go back and fix it. When it is all passing,
commit on a branch named issue-<N> using the my-commit-create skill. Re-read your
own diff and the issue before you call it done.
```

## Notes

- The loop only converges if the done condition is checkable by the agent itself: a passing repro, green lint, green tests. Vague conditions ("make it good") never terminate.
- "Re-read your own diff and the issue before you call it done" catches the classic failure where the agent fixes a symptom and drifts from the actual ask.
- `my-code-autofix` wraps this exact prompt to fire unattended when a fresh harness project is created. Running it by hand is the interactive version of the same loop.
- Best run inside a container/VM so the agent can act freely without risking your machine.
