You're right, most of that session was spent on the highlight. Looking back, the back and forth had three causes, and I folded a fix for each into the skill.

## What actually cost us the rounds

| What happened | Why | What the skill now says |
|---|---|---|
| The capture kept timing out | `fullPage: true` hangs on Rancher list pages | "Never pass `fullPage: true`. Screenshot the viewport instead." |
| Retried with longer timeouts, still hung | We were waiting on `networkidle`, but the page keeps polling | Wait for a specific element that only exists once the data is in |
| The highlight was improvised each time | Nothing said *how* to highlight, so I invented styling per attempt | An exact outline + glow recipe, copy-pasteable |

## Changes to `my-browser-screenshot/SKILL.md`

- Added a **Highlighting a control** section with the exact treatment (3px `#e5484d` outline, 2px offset, and a soft glow), plus a `waitForTimeout(150)` so the style paints before the capture.
- Added a **selector cheatsheet** for the targets that keep coming up: the Create button (`.masthead .btn.role-primary`), row action menus, and the page title.
- Added a **Gotchas** section leading with the `fullPage` timeout, since that alone burned several attempts.
- Told the skill to **read the screenshot back** and confirm the highlight landed. A selector that matches nothing fails silently, which is what sent us in circles.
- Updated the `description` so it mentions highlighting, otherwise the skill will not auto-fire when you ask for a called-out control.

Next time `/my-browser-screenshot highlight the create button on the statefulset list page` should be a single pass.
