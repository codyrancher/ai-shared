// Recording template — copy to /workspace/videos/ and customise.
//
// Usage:
//   cp .claude/skills/my-browser-record-video/record-template.mjs videos/record-my-demo.mjs
//   cp .claude/skills/my-browser-record-video/overlay.mjs        videos/overlay.mjs
//   # edit RANCHER, OUT, and the "Recorded actions" section
//   node videos/record-my-demo.mjs

import { chromium } from 'playwright-core';
import { promises as fs } from 'node:fs';
import { spawn, execSync } from 'node:child_process';
import { installOverlay } from './overlay.mjs';

const CDP = process.env.CLAUDE_BROWSER_CDP || 'http://localhost:9222';
const RANCHER_HOST = process.env.RANCHER_HOST_NAME;        // e.g. <project>-rancher
const RANCHER = `https://127.0.0.1:8005`;                  // dev server, or `https://${RANCHER_HOST}` for stock
const OUT = '/workspace/videos/demo.webm';
const FRAME_DIR = `/tmp/screencap-${Date.now()}`;
const FPS = 15;

// Token for /v1 API calls during the recording (resource creation, feature
// toggles, etc.). If you're not mutating Rancher, you can skip this.
let TOKEN = '';
try { TOKEN = execSync('cat /tmp/rancher-token.txt', { encoding: 'utf8' }).trim(); } catch {}

const browser = await chromium.connectOverCDP(CDP);
const ctx = browser.contexts()[0] || await browser.newContext();
const page = await ctx.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// --- Login (off-camera) -----------------------------------------------------
await page.goto(`${RANCHER}/auth/login`, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.locator('[data-testid="login-submit"]').waitFor({ state: 'visible', timeout: 20000 });
await page.locator('[data-testid="local-login-username"]').fill('admin');
await page.locator('[data-testid="local-login-password"] input').fill('<password>');
await page.locator('[data-testid="login-submit"]').click();
await page.waitForURL(u => !u.pathname.includes('/auth/login'), { timeout: 15000 });

// --- Navigate to target page (off-camera) ------------------------------------
// await page.goto(`${RANCHER}/c/local/explorer/...`, { waitUntil: 'domcontentloaded', timeout: 60000 });
// await page.locator('...').waitFor({ state: 'visible', timeout: 30000 });

// --- Install overlays (URL bar, cursor, click ripples, keystroke badges, highlights, banners)
await page.evaluate(installOverlay);
await ctx.addInitScript(installOverlay);
page.on('load', async () => { try { await page.evaluate(installOverlay); } catch {} });

// --- Frame capture (polled screenshot, with pause/resume) -------------------
// Polled `page.screenshot` is more resilient than CDP `Page.startScreencast`:
// it survives SPA navigations, full page reloads, and even Rancher backend
// restarts (where the page hangs for several seconds). The trade-off is
// slightly higher CPU; at 15fps and quality:80 jpegs this is fine.
//
// The `recording` flag lets you pause frame capture during long off-camera
// transitions (state changes, backend restarts) so they don't show up as dead
// air. Frames already captured stay; new ones aren't written while paused.
await fs.mkdir(FRAME_DIR, { recursive: true });
let frame = 0;
let recording = false;
const captureTimer = setInterval(async () => {
  if (!recording) return;
  try {
    const buf = await page.screenshot({ type: 'jpeg', quality: 80 });
    await fs.writeFile(`${FRAME_DIR}/f${String(frame++).padStart(6, '0')}.jpg`, buf);
  } catch {}
}, Math.floor(1000 / FPS));

// --- Helpers ----------------------------------------------------------------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// hover + small settle + click. The overlay's cursor dot has a 80ms CSS
// transition, so a 150-200ms settle reads as a deliberate movement. For
// longer cursor travel where you want a slower, more cinematic glide, use
// smoothMove() (defined below) instead.
async function moveAndClick(target, opts = {}) {
  await target.hover();
  await sleep(opts.settle ?? 180);
  await target.click();
}

// smoothMove: interpolate the pointer over `duration` ms with ease-out. Use
// this when the cursor needs to travel a long distance and the default 80ms
// CSS transition on the cursor dot would feel too abrupt. For most clicks,
// plain hover() + settle is enough — don't reach for this by default.
let lastX = 100, lastY = 100;
async function smoothMove(target, opts = {}) {
  const { duration = 350, steps = 20 } = opts;
  const box = typeof target.boundingBox === 'function' ? await target.boundingBox() : target;
  if (!box) throw new Error('smoothMove: target has no bounding box');
  const tx = box.x + (box.width ?? 0) / 2;
  const ty = box.y + (box.height ?? 0) / 2;
  const stepMs = Math.max(1, Math.floor(duration / steps));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = 1 - Math.pow(1 - t, 3);
    await page.mouse.move(lastX + (tx - lastX) * e, lastY + (ty - lastY) * e);
    await sleep(stepMs);
  }
  lastX = tx; lastY = ty;
}

// Character-by-character typing. Each keystroke fires a keydown which the
// overlay surfaces as a badge. NEVER use .fill() during recording — it's
// instant and invisible.
async function smoothType(text, delayPerChar = 60) {
  for (const ch of text) {
    await page.keyboard.type(ch, { delay: delayPerChar + Math.random() * 25 });
  }
}

// Red rectangle around an element (or static rect). Returns an id for
// removal. Tracks scrolls/layout shifts. Use for the SINGLE specific element
// the viewer should look at — not "all the cards on the page".
async function highlight(target, opts = {}) {
  let selector = null, rect = null;
  if (typeof target === 'string') selector = target;
  else if (typeof target.boundingBox === 'function') rect = await target.boundingBox();
  else rect = target;
  return page.evaluate(({ selector, rect, label, color }) =>
    window.__highlight({ selector, rect, label, color }),
    { selector, rect, label: opts.label || null, color: opts.color || null });
}
async function clearHighlight(id) {
  if (id) await page.evaluate((id) => window.__removeHighlight(id), id);
  else await page.evaluate(() => window.__clearHighlights());
}

// Narrative banner near top of screen. Use to label what's about to happen:
// "Demonstrating live update by adding a service". Pass duration:ms to
// auto-remove, otherwise call removeBanner(id). Multiple banners stack.
async function banner(text, opts = {}) {
  return page.evaluate(({ text, opts }) => window.__banner(text, opts), { text, opts });
}
async function removeBanner(id) {
  if (id) await page.evaluate((id) => window.__removeBanner(id), id);
  else await page.evaluate(() => window.__clearBanners());
}

// API call against the live Rancher (used for mutations during the demo).
// Requires TOKEN above. Returns parsed JSON or null.
function api(method, path, body = null) {
  if (!TOKEN || !RANCHER_HOST) throw new Error('api(): TOKEN or RANCHER_HOST_NAME missing');
  const bodyArg = body ? `-d ${JSON.stringify(JSON.stringify(body))}` : '';
  const out = execSync(
    `curl -sk -X ${method} "https://${RANCHER_HOST}${path}" ` +
    `-H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" ${bodyArg} 2>/dev/null`,
    { encoding: 'utf8' }
  );
  try { return JSON.parse(out); } catch { return out; }
}

// Poll Rancher's /v1 endpoint until it returns 200. Useful after toggling
// features like ui-sql-cache that cause Rancher to restart its server.
async function waitForRancher(maxWaitMs = 120000) {
  if (!RANCHER_HOST) return;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const code = execSync(
        `curl -sk -o /dev/null -w '%{http_code}' "https://${RANCHER_HOST}/v1" ` +
        `-H "Authorization: Bearer ${TOKEN}" 2>/dev/null`,
        { encoding: 'utf8' }
      ).trim();
      if (code === '200') return true;
    } catch {}
    await sleep(2000);
  }
  return false;
}

// --- Recorded actions -------------------------------------------------------
// Pacing rule: every fixed wait should be deliberate. Three valid reasons:
//   1. UI wait → use locator.waitFor() / page.waitForURL() / waitForResponse()
//   2. Viewer pacing → 300-800ms for "let them register what just happened"
//   3. Off-camera transition → set `recording = false` first, then sleep, then
//      `recording = true` once the UI is ready again
// Hard rule: never `await sleep(...)` >500ms while `recording = true` unless
// it's a deliberate viewer beat. Long backend transitions belong in #3.
recording = true;
await sleep(800);                                    // opening beat (viewer)

// ... your interactions here ...
//
// Click that reveals new UI — preferred pattern:
//   await someLocator.scrollIntoViewIfNeeded();
//   await moveAndClick(someLocator);                                // hover + 180ms + click
//   await page.locator('.next-panel').waitFor({ state: 'visible' }); // wait on UI, not clock
//
// Highlight + banner for a specific spot — sparingly, one or two per video:
//   const hl = await highlight(numberCell, { label: 'Live count' });
//   const bn = await banner('Adding a service to demonstrate live update', { duration: 3500 });
//   api('POST', '/v1/services', { ... });                           // trigger the change
//   await sleep(3000);                                              // let the UI update on screen
//   await clearHighlight(hl);
//
// Type into a focused input — keystroke badges pace this naturally:
//   await moveAndClick(inputLocator);
//   await smoothType('my-resource-name');
//
// Long off-camera transition (state change, backend restart):
//   recording = false;
//   await banner('Disabling VAI…', { duration: 2000 });
//   recording = true; await sleep(2000); recording = false;        // brief on-camera intro
//   api('PUT', '/v1/management.cattle.io.features/ui-sql-cache', { ... });
//   await sleep(8000);                                              // off-camera, no frames written
//   await waitForRancher();
//   await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
//   await page.evaluate(installOverlay);                            // re-inject after nav
//   recording = true;
//   await sleep(800);                                               // viewer settle

await sleep(1200);                                   // final hold (viewer)
recording = false;

// --- Encode + cleanup -------------------------------------------------------
clearInterval(captureTimer);
await page.close();
await browser.close();

console.log(`Captured ${frame} frames. Encoding...`);
await new Promise((resolve, reject) => {
  const ff = spawn('ffmpeg', [
    '-y', '-framerate', String(FPS),
    '-i', `${FRAME_DIR}/f%06d.jpg`,
    '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '1.5M',
    OUT,
  ], { stdio: 'inherit' });
  ff.on('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`)));
});
await fs.rm(FRAME_DIR, { recursive: true, force: true });
console.log(`saved ${OUT}`);
process.exit(0);
