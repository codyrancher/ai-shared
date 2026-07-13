Here's a summary of what we did, and the skill I generalized out of it.

## What this conversation actually did

1. Created a StatefulSet (`web`) so the list page had something in it.
2. Navigated to the StatefulSet list page and waited for the rows to render.
3. Highlighted the **Create** button and captured `stateful-list.png`.
4. Opened the detail page for `web` and captured `stateful-detail.png`.

The reusable shape is: bring the sidecar up, make sure the resource exists, navigate and wait for real content, capture under the name the user asked for.

## The skill

Created `.claude/skills/my-browser-screenshot/SKILL.md`, matching the structure of your existing `my-*` skills (frontmatter `name` + a trigger-shaped `description`, a "When to use" list, then a numbered playbook).

- **Trigger:** phrases like "take a screenshot of the X list page" or "screenshot the detail page for Y".
- **Playbook:** `wait-for-sidecars browser`, create the resource if the page needs one, navigate and wait for content, capture with `browser.mjs --new-tab screenshot`, save under the exact filename requested.

Invoke it with `/my-browser-screenshot`.
