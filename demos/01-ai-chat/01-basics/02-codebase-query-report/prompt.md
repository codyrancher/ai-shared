# Prompt - Querying the codebase for a linked report

Paste into Claude Code in the harness project.

```
Give me a short orientation report on how cluster provisioning is wired in this
dashboard. Cover: the route and entry component, the store modules involved, and
where the create/update API calls are made. Every claim must link to an exact file
and line. Cap it at 15 bullets and end with the 3 files I should read first.
```

## Notes

- Swap "cluster provisioning" for whatever area you are onboarding onto.
- "Every claim must link to an exact file and line" is the load-bearing clause: it forces verifiable output and clickable references in the IDE.
- Cap the length so you get an orientation, not a wall of text. Ask a follow-up to zoom into any single bullet.
