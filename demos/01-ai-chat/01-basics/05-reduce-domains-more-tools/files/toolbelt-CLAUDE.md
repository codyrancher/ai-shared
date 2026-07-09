# CLAUDE.md - Toolbelt section (example)

Drop a section like this into CLAUDE.md so the agent reaches for real tools instead
of asking you to do things by hand. This is the durable version of basics 6.

## Toolbelt

Prefer these over manual steps. If a task needs the browser, Rancher, or GitHub,
use the matching tool.

- **Browser (screenshots / video):** `node /workspace/browser.mjs ...`
  (`screenshot`, `record`, `record-script`, `goto`, `eval`). Pass `--new-tab` for
  transient/automated work so the user's tab is untouched.
- **Bring up dependencies:** `wait-for-sidecars` before any browser or Rancher work.
  It starts the sidecars if needed and blocks until CDP and the Rancher API answer.
- **Report a missing tool:** when a CLI is not installed, POST it to the insights
  endpoint (see `.claude/rules/insights.md`) so the gap is tracked.
- **Skills:** the `my-*` skills cover the common flows: `my-browser-record-video`,
  `my-browser-screenshot-comparison`, `my-commit-create`, `my-pr-create`,
  `my-pr-review`, `my-code-autofix`, `my-video-censor-ip`.

## Working agreement

- Reach for a tool before asking me to do a manual step.
- If a tool you need is missing, tell me and I will add it (that is how the toolbelt
  grows).
- Keep the active scope narrow: one issue, one cluster, one task at a time.

## Why

Two levers: fewer domains live at once (narrow scope) and more the agent can do on
its own (rich tools). Together they make unattended runs reliable.
