# Environment

The tools, containers, and services this project gives you. Prefer them over
guessing or asking me to run things by hand.

## Rancher instance
- A live Rancher is running for this project at https://$RANCHER_HOST_NAME.
- Admin credentials are in `.env` as `$RANCHER_ADMIN_USER` / `$RANCHER_ADMIN_PASS`.
- Use it to provision resources, reproduce issues, and verify fixes against a real cluster.

## Browser sidecar
- A Chromium runs alongside the project, exposed over the Chrome DevTools Protocol
  at `$CLAUDE_BROWSER_CDP`. It shares the logged-in Rancher session.
- Drive it with the `/workspace/browser.mjs` helper:
    - `browser.mjs screenshot <url> <out.png>` for a full-page screenshot
    - `browser.mjs record <url> <out.webm> <ms>` to record a video
    - `browser.mjs goto <url>` and `browser.mjs eval "<js>"` to navigate and inspect
- Run `wait-for-sidecars` first. The container takes a few seconds to boot and CDP
  refuses connections until it is up.

## Dashboard codebase
- The Rancher dashboard source (Vue 3 / TypeScript) is checked out at `/workspace/dashboard`.
- The `gh` CLI is authenticated against the dashboard repo, so you can read issues
  and open pull requests without me.

## Custom tools and skills
- Reusable playbooks live in `.claude/skills/`: recording browser videos, creating
  commits and PRs, reviewing PRs. Read a skill's `SKILL.md` before using it.
- When I add my own scripts or CLIs, I will describe them here so you reach for them
  instead of reinventing the step.
