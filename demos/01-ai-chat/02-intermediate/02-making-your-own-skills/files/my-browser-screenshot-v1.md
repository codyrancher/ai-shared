---
name: my-browser-screenshot
description: Take named screenshots of pages on this project's Rancher instance. Drives the browser sidecar, waits for the page to render, and saves each shot under the name the user asked for. Use whenever the user wants a screenshot of a Rancher list page, detail page, or any specific screen.
---

Take screenshots of pages on this project's Rancher instance and save them under the names the user chooses.

## When to use

When the user says things like:
- "take a screenshot of the X list page"
- "screenshot the detail page for Y"
- "grab a picture of that screen and call it Z"

## Workflow

1. **Bring the sidecar up.** Run `wait-for-sidecars browser` first. The browser takes several seconds to boot and CDP refuses connections until it is up.

2. **Make sure there is something to look at.** If the page needs a resource to exist (a StatefulSet, a ConfigMap), create it against the Rancher instance first, or you will screenshot an empty-state page.

```bash
kubectl apply -f - <<'YAML'
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
YAML
```

3. **Navigate and wait for the real content.** Rancher paints its shell before the rows arrive, so waiting on `load` alone gives you a screenshot of an empty table.

4. **Capture with `browser.mjs`.** Always pass `--new-tab` so you do not navigate the tab the user is watching.

```bash
node /workspace/browser.mjs --new-tab screenshot \
  https://$RANCHER_HOST_NAME/dashboard/c/local/explorer/apps.statefulset \
  /workspace/screenshots/stateful-list.png
```

5. **Use the exact filenames the user asked for** and tell them where the files landed.

## Notes

- Screenshot the list page and the detail page separately. They are different routes.
- If the user wants a control called out, inject some CSS onto the element before capturing.
