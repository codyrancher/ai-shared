# 4. Customizing behavior with CLAUDE.md

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Change how the agent behaves with a few lines in CLAUDE.md, then provision in-cluster resources the same way.

## The idea

CLAUDE.md is read on every session, so a few lines there permanently shape behavior: writing style, "always lint before you say done", preferred tools. The same mechanism scales up: a short rule can teach the agent to provision resources inside the cluster on a keyword, which is a clean transition into the next demo.

## Prompt

**Shape behavior**

```
Add two rules to CLAUDE.md: never use em dashes in any output, and always run
yarn lint before you tell me a change is done. Then show me the diff.
```

**Provision in-cluster on a keyword**

```
Add a CLAUDE.md rule so that when I say "seed demo", you create a namespace called
demo-app in the local cluster and populate it with a sample Deployment, Service,
and ConfigMap using kubectl against the current kubeconfig. Then run it: seed demo.
```

Full prompt text: [`prompt.md`](./prompt.md) · Example: [`files/example-CLAUDE.md`](./files/example-CLAUDE.md)

## What to look for

- The next reply already obeys the new rule (no em dashes, lints first).
- A keyword like "seed demo" now maps to real kubectl actions.
- A few lines of natural language replace a runbook.

## Result

_Media pending. Record the rule being added and taking effect with `my-browser-record-video`; save at [`media/claude-md.webm`](./media/)._

## Skills & files

- Example: [`files/example-CLAUDE.md`](./files/example-CLAUDE.md)
- Capture: `my-browser-record-video`
