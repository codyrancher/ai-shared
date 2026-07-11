---
name: my-browser-screenshot-comparison
description: Take a side-by-side comparison screenshot showing BEFORE (master) vs AFTER (current branch) of a page, with labeled headers, URLs, and red highlight rectangles around changed elements. Requires COMPARISON_BEFORE_URL and COMPARISON_AFTER_URL env vars (or --before-url/--after-url flags) pointing to the two deployments. Use when the user wants to visually compare UI changes between branches.
---

Generate a side-by-side comparison screenshot of two deployments (typically master vs the current fix branch) with labeled panels, URL display, and red highlight rectangles around changed elements.

## When to use

When the user says things like:
- "make a comparison screenshot"
- "compare the before and after"
- "show the diff between master and my branch"
- "screenshot the changes"

## Configuration

The script needs to know where the "before" (master) and "after" (dev branch) deployments are hosted. Set these via environment variables in `.env`, your shell profile, or pass them as CLI flags.

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `COMPARISON_BEFORE_URL` | Base URL for the master deployment | (required) |
| `COMPARISON_AFTER_URL` | Base URL for the dev branch deployment | (required) |
| `COMPARISON_BEFORE_LABEL` | Label for the left panel | `master` |
| `COMPARISON_AFTER_LABEL` | Label for the right panel | current git branch |

Example `.env` setup for two Rancher deployments:

```bash
COMPARISON_BEFORE_URL=https://rancher-master.example.com
COMPARISON_AFTER_URL=https://rancher-dev.example.com
COMPARISON_BEFORE_LABEL=master
COMPARISON_AFTER_LABEL=issue-16755
```

When the env vars are set, use `--path` to append the same page path to both base URLs:

```bash
node /workspace/.claude/skills/my-browser-screenshot-comparison/my-browser-screenshot-comparison.mjs \
  --path /dashboard/c/local/explorer/configmap \
  --highlight ".some-changed-element" \
  --output /workspace/screenshots/comparison.png
```

### CLI flags

Flags override environment variables when both are set.

| Flag | Purpose |
|---|---|
| `--before-url URL` | Full URL for the left (before) panel |
| `--after-url URL` | Full URL for the right (after) panel |
| `--path PATH` | Page path appended to both base URLs from env vars |
| `--before-label TEXT` | Label shown in the header (default: env or `master`) |
| `--after-label TEXT` | Label shown in the header (default: env or current git branch) |
| `--highlight SELECTOR` | CSS selector of element(s) to wrap with a red outline (repeatable) |
| `--wait-for SELECTOR` | Wait for this element to appear instead of `networkidle` (use for dev servers) |
| `--output PATH` | Output file path (default: `/workspace/screenshots/comparison.png`) |

Full example with all flags (no env vars needed):

```bash
node /workspace/.claude/skills/my-browser-screenshot-comparison/my-browser-screenshot-comparison.mjs \
  --before-url https://rancher-master.example.com/dashboard/c/local/explorer/configmap \
  --after-url  https://rancher-dev.example.com/dashboard/c/local/explorer/configmap \
  --before-label "master" \
  --after-label "issue-16755 branch" \
  --highlight ".some-changed-element" \
  --highlight "table.sortable-table" \
  --output /workspace/screenshots/comparison.png
```

## Output format

The script produces a single PNG image:
- Two panels side by side, each 1280x720
- A 52px header bar above each panel showing the label and page URL
- A 4px vertical divider between panels
- Red outline rectangles (2px border, 4px padding) around any highlighted elements
- Total image size: 2564 x 772 pixels

## Prerequisites

The browser (Playwright CDP endpoint) and both target pages must be reachable before running. If your environment uses sidecars or separate containers for the browser or the target apps, make sure they are started and responding first.

**Dev servers:** Webpack/Vite dev servers keep WebSocket connections open for HMR, so `networkidle` never resolves. Pass `--wait-for` with a CSS selector of an element that signals the page is ready (e.g., `.sortable-table`, `.dashboard-content`). The script will use `domcontentloaded` + wait for that element instead.

## Workflow

1. **Find the CSS selectors for the changed elements.** This is the most important step. The red highlight rectangles are what make the comparison useful - without them the viewer has to hunt for what changed. Review the code diff to understand which DOM elements were affected by the change. Then inspect the page (via `browser.mjs eval`, a Playwright script, or the DOM) to find stable CSS selectors for those elements. Every comparison MUST include at least one `--highlight` selector.

2. **Run the script with `--highlight` for each changed element.** Pass one `--highlight SELECTOR` flag per element that was affected by the change. Use multiple flags if several elements changed. If either deployment is a dev server (webpack/Vite), also pass `--wait-for SELECTOR` with a selector that signals the page is loaded (e.g., `[data-testid='header']`, `.sortable-table`), otherwise the script will hang waiting for `networkidle` which never resolves on dev servers.

3. **Verify the result.** Open the output with `Read` to confirm the comparison looks correct and that the red outlines are visible around the changed elements. If a selector didn't match or the outline is in the wrong place, adjust and re-run.

## Highlight selectors (required)

Every comparison screenshot MUST include `--highlight` flags. A comparison without highlights does not clearly communicate what changed.

The `--highlight` flag accepts any CSS selector. It resolves all matching elements on both pages independently, so:
- If an element exists on both pages, both get a red outline
- If an element only exists on one page (e.g., a new feature), only that side shows the highlight
- Multiple `--highlight` flags can target different elements

### How to find the right selectors

1. Look at the code diff to understand which components or DOM elements changed.
2. Inspect the live page to find a selector that targets the affected element. Use `browser.mjs eval "document.querySelector('.my-selector')?.getBoundingClientRect()"` to verify a selector matches and is in the viewport.
3. Prefer IDs, data-testid attributes, or structural selectors (`.sortable-table tbody tr:nth-child(3)`) over fragile class names.

## Tips

- Both deployments must be accessible from the browser. Make sure both are loaded and logged in (or handle auth in advance).
- The viewport is fixed at 1280x720. Elements below the fold won't appear. Navigate to the exact scroll position or use selectors that are visible in the initial viewport.
- Screenshots are saved under `/workspace/screenshots/` by default. Use these in PRs via the `my-pr-create` skill's media upload flow.
