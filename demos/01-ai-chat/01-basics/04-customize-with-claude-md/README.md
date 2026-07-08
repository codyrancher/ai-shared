# Customizing behavior with CLAUDE.md

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Stop re-explaining the same preferences every session; write the rule once and it sticks.

## Shape behavior

**Why:** Never type "run lint first" or "no em dashes" again. Set it once and every reply obeys.

```
Add two rules to CLAUDE.md: never use em dashes in any output, and always run yarn lint before you tell me a change is done. Then show me the diff.
```

## Provision in-cluster on a keyword

**Why:** Collapses a multi-step kubectl runbook into a single word you can rerun anytime.

```
Add a CLAUDE.md rule so that when I say "seed demo", you create a namespace called demo-app in the local cluster and populate it with a sample Deployment, Service, and ConfigMap using kubectl against the current kubeconfig. Then run it: seed demo.
```

## What to look for

- The next reply already obeys the new rule (no em dashes, lints first).
- A keyword like "seed demo" now maps to real kubectl actions.
- A few lines of natural language replace a runbook.

## Skills & files

- [`example-CLAUDE.md`](files/example-CLAUDE.md)

## Result

- `media/claude-md.webm` - Rule added, behavior changes in the same session (pending: my-browser-record-video)

## Notes

- CLAUDE.md is loaded at the start of every session, so rules stick without re-prompting.
- Keep rules imperative and testable ("always run X", "never do Y"), so you can see them take effect immediately.
- The keyword-to-kubectl rule is the bridge into demo 5: once the agent can act on the cluster from a phrase, it can also provision the infrastructure around it.
- See [`files/example-CLAUDE.md`](./files/example-CLAUDE.md) for a ready-to-adapt block.
