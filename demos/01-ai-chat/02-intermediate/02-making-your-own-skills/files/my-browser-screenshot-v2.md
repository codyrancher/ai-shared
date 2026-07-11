---
name: my-browser-screenshot
description: Take named screenshots of pages on this project's Rancher instance, optionally highlighting an element with a red outline and glow. Drives the browser sidecar, waits for real content, and saves each shot under the name the user asked for. Use whenever the user wants a screenshot of a Rancher list page, detail page, or a specific control called out.
---

Take screenshots of pages on this project's Rancher instance and save them under the names the user chooses. Highlight a control when the user asks for one to be called out.

## When to use

When the user says things like:
- "take a screenshot of the X list page"
- "screenshot the detail page for Y"
- "highlight the create button and screenshot it"

## Workflow

1. **Bring the sidecar up.** Run `wait-for-sidecars browser` first. The browser takes several seconds to boot and CDP refuses connections until it is up.

2. **Make sure there is something to look at.** If the page needs a resource to exist (a StatefulSet, a ConfigMap), create it against the Rancher instance first, or you will screenshot an empty-state page.

3. **Navigate and wait for the real content**, not just `load`. Rancher paints its shell before the rows arrive, so waiting on `load` alone gives you a screenshot of an empty table. Wait for a row or a heading that only exists once the data is in.

4. **Capture.** Always pass `--new-tab` so you do not navigate the tab the user is watching.

```bash
node /workspace/browser.mjs --new-tab screenshot \
  https://$RANCHER_HOST_NAME/dashboard/c/local/explorer/apps.statefulset \
  /workspace/screenshots/stateful-list.png
```

5. **Use the exact filenames the user asked for** and tell them where the files landed.

## Highlighting a control

**Do not improvise the highlight.** Getting this right by trial and error costs several rounds. Apply exactly this treatment so every screenshot in the repo looks the same:

```js
await page.locator(selector).evaluate((el) => {
  el.style.outline = '3px solid #e5484d';
  el.style.outlineOffset = '2px';
  el.style.borderRadius = '4px';
  el.style.boxShadow = '0 0 0 6px rgba(229, 72, 77, 0.35)';
});
await page.waitForTimeout(150); // let the style paint before capturing
```

Selectors that come up constantly in Rancher:

| Target | Selector |
|---|---|
| Create button on any list page | `.masthead .btn.role-primary` |
| A row's action menu | `tr .btn.actions` |
| Page masthead / title | `.masthead .title` |

Verify the highlight actually landed by reading the screenshot back before you hand it over. A selector that matched nothing fails silently.

## Gotchas (learned the hard way)

- **Never pass `fullPage: true` on a Rancher page.** It hangs and the capture times out. Screenshot the viewport instead. If you genuinely need the whole page, set the viewport tall enough rather than using `fullPage`.
- **A screenshot timeout is almost never a slow network.** It is usually `fullPage`, or waiting on `networkidle` on a page that keeps polling. Wait for a specific element instead.
- **Highlight before you capture, and only the element the user named.** Do not highlight a parent container.

## Notes

- Screenshot the list page and the detail page separately. They are different routes.
- When the user asks for several shots, capture them in one run so the cluster state is identical across all of them.
