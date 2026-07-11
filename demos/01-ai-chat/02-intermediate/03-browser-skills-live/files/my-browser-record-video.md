---
name: my-browser-record-video
description: Record a smooth browser video against this project's Rancher instance. Iterate against the live UI to discover the exact action sequence, save it as a Playwright script, then play it back through `browser.mjs record-script` to capture a single uninterrupted recording. Use whenever capturing reproduction videos, fix demonstration videos, or any browser interaction recording.
---

Record a video of browser interaction against this project's Rancher instance. Videos are VP9 webm with an injected overlay (URL bar, cursor dot, click ripples, keystroke badges, URL change highlights).

## Workflow: iterate → script → reset → record

**Do not record while you're still figuring out the steps.** If you record live during exploration, every "what do I click next" pause becomes a multi-second dead zone in the video. Instead:

1. **Iterate against the live UI** to discover the exact sequence of clicks/inputs/waits that produces the bug or demonstrates the fix. Use `browser.mjs --new-tab goto`, ad-hoc playwright-core scripts, or DOM inspection — whatever is fastest to converge on the correct sequence. **Don't record yet.**
2. **Capture the sequence as a small Playwright script** at e.g. `/workspace/repro.mjs`. The script must default-export an `async ({page, ctx, startRecording}) => ...` function. Include the navigation that gets you to the start state — the script is responsible for everything from `goto` through the final assertion.
3. **Verify the script reaches the goal end-to-end** by running it via `record-script` once. If a step fails, edit and re-run. Iterate until a single clean run produces what you want.
4. **Reset state** if the script created/mutated Rancher resources that would prevent a clean re-run (delete the cluster you made, randomise resource names with `Date.now()`, etc.). Often this is unnecessary for read-only repros.
5. **Final recording** — re-run with `record-script` against a fresh sidecar state. The video captures only the smooth scripted execution, no agent-thinking pauses.

## The `record-script` command

```bash
# script default-exports async ({page, ctx, startRecording}) => { ... }
node /workspace/browser.mjs record-script /workspace/repro.mjs /workspace/videos/before-fix.webm
```

Recording is **deferred** — frames are not saved until your script calls `startRecording()`. This keeps the initial page load (blank → spinner → content) out of the video. Call `startRecording()` after the page is loaded and ready, right before the first visible user action.

Always uses a fresh tab so the user's open tabs are untouched.

Save scripts and videos under `/workspace/videos/` (and keep the script next to its video — it's the source of truth for "what was recorded" and is easy to replay or tweak).

### Script template

The script function receives helpers in its argument: `{ page, ctx, startRecording, click, type, move, waitFor, highlight, removeHighlight, clearHighlights, MOVE_DELAY, TYPE_DELAY }`. The helpers wrap the `hover → wait → interact` pattern so you don't have to repeat it. Viewport is pinned to 1280x720 automatically.

```js
// /workspace/repro.mjs
export default async function ({ page, startRecording, click, type, waitFor, highlight, removeHighlight }) {
  // --- Setup (not recorded) ------------------------------------------------
  await page.goto('https://ai-presentation-rancher')
  await page.waitForLoadState('networkidle')

  // --- Start recording ------------------------------------------------------
  startRecording()

  // --- Visible interactions (recorded) --------------------------------------
  // Login. `type` does move → click → keystroke-by-keystroke for you.
  await type('input[name="username"]', 'admin')
  await type('input[name="password"]', 'password')
  await click('button[type="submit"]')

  await page.waitForURL(/\/dashboard/)
  await waitFor('nav.side-nav')  // wait on the UI to settle, not on the clock

  // Highlight the affected control for 0.75s, then move on
  const id = await highlight('button.cluster-switch', 'Crashes here')
  await page.waitForTimeout(750)
  await removeHighlight(id)

  // ... rest of the repro
}
```

The helpers accept either a string selector (`'button.submit'`) or a Playwright Locator (`page.locator('button.submit')`); use whichever is shorter at the call site. Drop down to raw `page.mouse.*` only when you need coord-based clicks.

## Before recording, ensure sidecars are up

```bash
wait-for-sidecars browser
```

The browser sidecar takes several seconds to boot, and CDP refuses connections until it is fully up. Skipping this leaves you with empty videos.

## Quick fallback: live recording with fixed duration

When you genuinely need a freeform recording (not from a script), the original mode still works:

```bash
node /workspace/browser.mjs record https://ai-presentation-rancher /workspace/videos/freeform.webm 15000
```

`<url> <out.webm> [durationMs]`. Default duration 10s. Avoid for reproductions — pauses in your driving show up as pauses in the video.

## CRITICAL: every interaction needs mouse movement

The overlay's cursor dot has a 150ms CSS transition. **Every click, type, or selection MUST be preceded by moving the mouse to the target and waiting for the transition.** If Playwright fires mousedown without a prior `page.mouse.move()` or `.hover()`, the cursor dot stays wherever it was and the viewer sees a ghost click with no visible pointer. This is the #1 cause of recordings that "don't highlight the mouse."

**Use the `click`, `type`, and `move` helpers** — they handle the hover-and-wait for you, so the cursor dot is always on-target when the click ripple fires. Don't call `loc.click()` or `page.fill()` directly:

```js
// Wrong — cursor dot doesn't move, no click ripple visible
await page.locator('button.submit').click()
await page.fill('input[name="user"]', 'admin')

// Right — helpers move the cursor + wait MOVE_DELAY first
await click('button.submit')
await type('input[name="user"]', 'admin')
```

For coord-based clicks where there's no locator (e.g. clicking inside an iframe by pixel position), do it manually:

```js
await page.mouse.move(x, y)
await page.waitForTimeout(MOVE_DELAY)
await page.mouse.click(x, y)
```

## CRITICAL: wait on elements, never on the clock

`waitForTimeout(N)` always burns its full N milliseconds, even if the page was ready 50ms in. Across a 30-second video that adds up to seconds of pure dead air, and it's the #1 reason draft recordings come out twice as long as they need to be. **Wait for the UI to actually be in the state you need, then continue immediately.**

The `waitFor(target, opts?)` helper wraps `locator.waitFor()` and accepts a string selector. Use it for element-presence waits; use `page.waitForResponse(...)`, `page.waitForURL(...)`, `page.waitForLoadState(...)` for the network/navigation cases.

| Don't | Do |
|-------|-----|
| `await page.waitForTimeout(2000)` // wait for page | `await waitFor('table.cluster-list')` |
| `await page.waitForTimeout(1000)` // wait for modal | `await waitFor('.modal')` |
| `await page.waitForTimeout(500)` // wait for menu | `await waitFor('[role="menu"]')` |
| `await page.waitForTimeout(3000)` // wait for API | `await page.waitForResponse(r => r.url().includes('/v1/clusters'))` |
| `await page.waitForTimeout(1500)` // wait for spinner | `await waitFor('.loading-indicator', { state: 'hidden' })` |
| `await page.waitForTimeout(2000)` // wait for nav | `await page.waitForURL(/\/cluster\/local/)` |

**The only legitimate uses of `waitForTimeout` in a recording script:**

- `MOVE_DELAY` (~180ms) after `.hover()` so the cursor-dot CSS transition completes before the click.
- Highlight hold (~750ms) so the viewer's eye registers what was highlighted.
- Opening beat (~500ms) after `startRecording()` so the first frame isn't mid-paint.
- Final hold (~750ms) so the recording doesn't end on a navigation flash.

If you find yourself reaching for `waitForTimeout(1500)` because "the table needs a moment to load", that's wrong — the table has a selector you can wait on. If you're unsure what selector marks "ready", inspect the DOM live in the iterate phase (step 1 of the workflow) and write the wait against whatever appears at the moment the UI settles.

## Type character-by-character, never use fill()

`page.fill()` sets the value instantly — invisible in a recording. The `type` helper drives keystroke-by-keystroke at `TYPE_DELAY` (60ms) so each character appears as a visible badge in the overlay:

```js
await type('input[name="user"]', 'admin')
// equivalent to: await click('input[name="user"]') + page.keyboard.type('admin', { delay: 60 })
```

Override the per-key delay when you need to (lower for long strings, higher for emphasis): `await type(loc, 'verylongvalue', { delay: 40 })`. Don't reach for `page.fill()` even when nobody's watching the typing happen — silently-set values look like glitches in playback.

## Show the load-bearing steps, not every step

Show the steps a viewer needs to reproduce the bug or believe the fix: navigation, the specific control being acted on, the resulting state. **Cut anything that doesn't carry weight** — don't open the hamburger menu to navigate if the collapsed-sidebar icon is already clickable; don't expand a section if the bug appears in the collapsed view; don't visit an intermediate page just because a human would. Each non-load-bearing step adds seconds of dead air for a reviewer who's seen the dashboard a hundred times.

## Pacing budget

Target **15-30 seconds total** for a single before- or after-video. Each demonstration beat (hover, click, highlight, scroll) sits on screen for roughly **0.75s** — long enough for the eye to register, short enough that the viewer doesn't tap "skip". A 1.5s hold is only justified when an element is dense (a table row among many, a deeply-nested control) or when you genuinely need the highlight label to be read.

If a draft video runs over 30s, the first place to look is timeout-based waits where an element wait would do — see the CRITICAL section above. After that, trim highlight holds and cut non-load-bearing navigation steps.

## URL change highlights

Full navigation, `pushState`, `replaceState`, and hash changes are auto-highlighted in the URL bar with a pink flash that fades over 3 seconds, which makes route transitions pop in the recording.

## Highlighting elements

To call attention to a specific element — the bug location, the changed control, the affected row — use the `highlight` helper. It draws a red labeled rectangle (2px `#ff3333`, 4px padding, 3px radius) that repositions every frame so it tracks scrolling and layout shifts, sits `pointer-events:none` above the cursor dot, and accepts the same selector/locator inputs as `click`:

```js
const id = await highlight('button.cluster-switch', 'Crashes here')
await page.waitForTimeout(750)   // 0.75s hold — see Pacing budget
await removeHighlight(id)
```

Color is overridable per call: `await highlight(loc, 'New', { color: '#22cc66' })`. Drop all open highlights at once with `await clearHighlights()`.

If the target rerenders or moves around mid-recording, fall back to the page-level API so the overlay re-resolves the element on every frame:

```js
const id = await page.evaluate(
  ({ selector, label }) => window.__highlight({ selector, label }),
  { selector: 'tr[data-row="123"] td.status', label: 'Status flips here' },
)
```

Use highlights sparingly — one or two per video, held just long enough for the viewer to see them, then cleared before the next interaction. Highlight the SINGLE thing the viewer should look at, not "all three cards on the page".

**Highlight DOM elements only — never the overlay itself.** The URL bar, keystroke badges, and cursor dot are part of the recording overlay, not the page. Highlighting them is meaningless to the viewer.

## Bare modifier keys render as "(hold)" badges

The keystroke-badge handler emits a held-modifier badge (e.g. `Alt (hold)`) whenever `Alt`, `Ctrl`, `Meta`, or `Shift` is pressed on its own. The badge stays on screen for as long as the key is held and drops on keyup. Combos like `Ctrl+K` and `Alt+F4` continue to render as a single combined badge that fades after 1.2s. You shouldn't need to inject anything for repros that hinge on holding a modifier alone — just drive the key the way you would in real use:

```js
await page.keyboard.down('Alt')
await loc.hover()
await page.waitForTimeout(MOVE_DELAY)
await loc.click()
await page.keyboard.up('Alt')
```

## Webpack dev-server runtime overlay

The Rancher dashboard runs under webpack-dev-server, which mounts a runtime-error iframe (`#webpack-dev-server-client-overlay`) at max z-index whenever there's a compile or runtime warning. That iframe intercepts mouse events even though it looks like an overlay, which kills the cursor dot, click ripples, and keystroke badges. The injected overlay continuously removes that iframe via MutationObserver, so you don't need to handle it manually. Don't add your own `dismissOverlay` calls; they're redundant and can race with the navigation re-inject.

## Compositor keepalive (automatic — don't reimplement)

CDP screencast only emits frames when the compositor produces new content. During quiet `waitForTimeout` pauses with no animation the stream would otherwise go silent, so a fixed-fps webm would play back faster than wall time. The overlay drives a 1px invisible canvas via rAF (at `opacity:0.003`, which is above the threshold where chromium short-circuits the layer) to keep the compositor busy throughout the recording. Don't add your own canvas/rAF loops to scripts; they're redundant.

## Troubleshooting: cursor not visible in the recording

If the playback shows clicks happening but no pink cursor dot or ripples:
1. Confirm `browser.mjs` has the webpack-overlay killer (search for `killWebpackOverlay`). Older copies don't.
2. Make sure every interaction follows the **hover → wait MOVE_DELAY → click** pattern. Bare `page.click()` with no prior pointer move means the cursor never moved, so there's nothing to render.
3. Check that you called `startRecording()` *after* the page is idle. If you call it before the navigation finishes, the overlay may have been re-injected mid-frame.
