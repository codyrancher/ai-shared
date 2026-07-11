#!/usr/bin/env node
// CDP helper for driving the browser sidecar via Playwright.
// Usage:
//   node /workspace/browser.mjs screenshot <url> <out.png>
//   node /workspace/browser.mjs record <url> <out.webm> [durationMs]
//   node /workspace/browser.mjs goto <url>                # just navigate the active tab
//   node /workspace/browser.mjs eval "<js>"              # run JS in the active tab, print result
//
// Pass `--new-tab` (anywhere in the args) to open a fresh tab for the
// command and auto-close it on exit, instead of reusing the user's active
// tab. Use this for any transient/automated work (e.g. scraping, uploading,
// background checks) so the user's open tabs aren't navigated away from.
//
// `record` injects a visual overlay into the page (URL bar at the bottom,
// cursor dot that tracks mouse movement, click ripples, and keystroke badges)
// so the resulting webm shows the URL, the pointer, and input actions even
// though CDP screencast only captures the viewport.
//
// CDP endpoint comes from $CLAUDE_BROWSER_CDP (set in .bashrc by init.sh).

import { chromium } from 'playwright-core'
import { promises as fs } from 'node:fs'
import { spawn } from 'node:child_process'

const CDP = process.env.CLAUDE_BROWSER_CDP || 'http://localhost:9222'

// Overlay installed into the page for `record`. Idempotent — safe to run on
// every navigation. Positions the URL bar at the bottom (semi-transparent,
// 32px) so it minimally covers the page; cursor + ripples + key badges
// float above.
const OVERLAY_SCRIPT = () => {
  if (document.getElementById('__hn_urlbar')) return

  const style = document.createElement('style')
  style.textContent = `
    @keyframes __hn_ripple { to { width: 56px; height: 56px; opacity: 0; } }
    @keyframes __hn_keyfade {
      0%   { opacity: 0; transform: translateY(8px); }
      12%  { opacity: 1; transform: translateY(0); }
      70%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-6px); }
    }
  `
  document.documentElement.appendChild(style)

  // --- URL bar (bottom) ---------------------------------------------------
  const bar = document.createElement('div')
  bar.id = '__hn_urlbar'
  bar.style.cssText = [
    'position:fixed', 'left:0', 'right:0', 'bottom:0', 'height:28px',
    'background:rgba(18,18,22,0.82)', 'color:#eaeaea',
    'font:12px/28px ui-monospace,SFMono-Regular,Menlo,monospace',
    'padding:0 10px', 'z-index:2147483647', 'pointer-events:none',
    'border-top:1px solid rgba(255,255,255,0.1)',
    'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
    'display:flex', 'align-items:center', 'gap:8px',
    'backdrop-filter:blur(6px)',
  ].join(';')
  bar.innerHTML = '<span style="opacity:0.55;font-size:11px">URL</span><span id="__hn_url"></span>'
  document.documentElement.appendChild(bar)

  const updateUrl = () => {
    const el = document.getElementById('__hn_url')
    if (!el) return
    el.textContent = location.href
    const b = document.getElementById('__hn_urlbar')
    if (b) {
      b.style.transition = 'none'
      b.style.background = 'rgba(220,60,100,0.6)'
      requestAnimationFrame(() => {
        b.style.transition = 'background 3s ease-out'
        b.style.background = 'rgba(18,18,22,0.82)'
      })
    }
  }
  updateUrl()
  const origPush = history.pushState
  const origReplace = history.replaceState
  history.pushState = function () { origPush.apply(this, arguments); updateUrl() }
  history.replaceState = function () { origReplace.apply(this, arguments); updateUrl() }
  window.addEventListener('popstate', updateUrl)
  window.addEventListener('hashchange', updateUrl)

  // --- Cursor dot ---------------------------------------------------------
  const cursor = document.createElement('div')
  cursor.id = '__hn_cursor'
  cursor.style.cssText = [
    'position:fixed', 'width:14px', 'height:14px',
    'background:rgba(220,60,100,0.85)', 'border:2px solid #fff',
    'border-radius:50%', 'box-shadow:0 2px 8px rgba(0,0,0,0.4)',
    'pointer-events:none', 'z-index:2147483646',
    'transform:translate(-50%,-50%)', 'transition:top .15s linear,left .15s linear',
    'top:-100px', 'left:-100px',
  ].join(';')
  document.documentElement.appendChild(cursor)

  // --- Force continuous frame emission ------------------------------------
  // CDP Page.startScreencast only emits frames when the compositor produces
  // new content. During quiet waitForTimeout pauses with no motion, frames
  // stop, and the resulting webm at fixed 15 fps plays back faster than
  // real time. Animate a 1px invisible canvas via rAF so the compositor
  // always has work, keeping playback in sync with wall time.
  const __hn_ff = document.createElement('canvas')
  __hn_ff.width = 1; __hn_ff.height = 1
  __hn_ff.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;pointer-events:none;opacity:0.003;z-index:2147483645'
  document.documentElement.appendChild(__hn_ff)
  const __hn_ffctx = __hn_ff.getContext('2d')
  let __hn_fft = 0
  const __hn_tick = () => {
    __hn_ffctx.fillStyle = (__hn_fft++ & 1) ? '#000' : '#fff'
    __hn_ffctx.fillRect(0, 0, 1, 1)
    requestAnimationFrame(__hn_tick)
  }
  requestAnimationFrame(__hn_tick)

  document.addEventListener('mousemove', (e) => {
    cursor.style.top = e.clientY + 'px'
    cursor.style.left = e.clientX + 'px'
  }, true)

  // --- Click ripples ------------------------------------------------------
  document.addEventListener('mousedown', (e) => {
    const r = document.createElement('div')
    r.style.cssText = [
      'position:fixed', `top:${e.clientY}px`, `left:${e.clientX}px`,
      'width:10px', 'height:10px',
      'background:rgba(220,60,100,0.35)',
      'border:2px solid rgba(220,60,100,0.85)',
      'border-radius:50%', 'pointer-events:none',
      'z-index:2147483646', 'transform:translate(-50%,-50%)',
      'animation:__hn_ripple .6s ease-out forwards',
    ].join(';')
    document.documentElement.appendChild(r)
    setTimeout(() => r.remove(), 700)
  }, true)

  // --- Keystroke badges ---------------------------------------------------
  const tray = document.createElement('div')
  tray.id = '__hn_keys'
  tray.style.cssText = [
    'position:fixed', 'right:12px', 'bottom:40px',
    'display:flex', 'flex-direction:column', 'align-items:flex-end',
    'gap:4px', 'pointer-events:none', 'z-index:2147483646',
  ].join(';')
  document.documentElement.appendChild(tray)

  // --- Nuke the webpack-dev-server runtime error overlay ------------------
  // The dev server mounts an iframe (#webpack-dev-server-client-overlay) at
  // max z-index whenever there's a compile/runtime warning. Iframes intercept
  // mouse events even with parent pointer-events:none, so once it's up the
  // cursor dot stops tracking and the recording shows no pointer. Kill it
  // every time it appears.
  const killWebpackOverlay = () => {
    for (const id of ['webpack-dev-server-client-overlay', 'webpack-dev-server-client-overlay-div']) {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }
  killWebpackOverlay()
  new MutationObserver(killWebpackOverlay).observe(document.documentElement, { childList: true, subtree: true })

  // --- Highlight API -------------------------------------------------------
  window.__hn_highlights = {}

  window.__highlight = ({ element, selector, label, color = '#ff3333', id }) => {
    const el = element || (selector ? document.querySelector(selector) : null)
    if (!el) return null
    const overlay = document.createElement('div')
    overlay.id = id
    overlay.style.cssText = `position:fixed;border:2px solid ${color};border-radius:3px;pointer-events:none;z-index:2147483646;padding:0;`
    if (label) {
      const lbl = document.createElement('div')
      lbl.textContent = label
      lbl.style.cssText = `position:absolute;top:-20px;left:0;background:${color};color:white;font-size:11px;padding:1px 5px;border-radius:2px;white-space:nowrap;`
      overlay.appendChild(lbl)
    }
    document.documentElement.appendChild(overlay)
    const track = () => {
      if (!document.getElementById(id)) return
      const rect = el.getBoundingClientRect()
      overlay.style.left = (rect.left - 4) + 'px'
      overlay.style.top = (rect.top - 4) + 'px'
      overlay.style.width = (rect.width + 8) + 'px'
      overlay.style.height = (rect.height + 8) + 'px'
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
    window.__hn_highlights[id] = overlay
    return id
  }

  window.__removeHighlight = (id) => {
    const el = document.getElementById(id)
    if (el) el.remove()
    delete window.__hn_highlights[id]
  }

  window.__clearHighlights = () => {
    for (const [id, el] of Object.entries(window.__hn_highlights)) {
      if (el && el.parentNode) el.remove()
    }
    window.__hn_highlights = {}
  }

  // --- Keystroke badges (with bare modifier hold support) -------------------
  const __hn_heldMods = {}

  document.addEventListener('keydown', (e) => {
    const key = e.key

    if (['Control', 'Meta', 'Alt', 'Shift'].includes(key)) {
      if (__hn_heldMods[key]) return
      const b = document.createElement('div')
      b.textContent = `${key === 'Meta' ? '⌘' : key} (hold)`
      b.style.cssText = [
        'background:rgba(18,18,22,0.92)', 'color:#fff',
        'font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace',
        'padding:6px 9px', 'border-radius:4px',
        'border:1px solid rgba(255,255,255,0.15)',
      ].join(';')
      tray.appendChild(b)
      __hn_heldMods[key] = b
      return
    }

    for (const [mod, badge] of Object.entries(__hn_heldMods)) {
      badge.remove()
      delete __hn_heldMods[mod]
    }

    const parts = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.metaKey) parts.push('⌘')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey && key.length > 1) parts.push('Shift')
    parts.push(key === ' ' ? 'Space' : key)

    const b = document.createElement('div')
    b.textContent = parts.join('+')
    b.style.cssText = [
      'background:rgba(18,18,22,0.92)', 'color:#fff',
      'font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace',
      'padding:6px 9px', 'border-radius:4px',
      'border:1px solid rgba(255,255,255,0.15)',
      'animation:__hn_keyfade 1.2s ease-out forwards',
    ].join(';')
    tray.appendChild(b)
    setTimeout(() => b.remove(), 1300)
  }, true)

  document.addEventListener('keyup', (e) => {
    if (__hn_heldMods[e.key]) {
      __hn_heldMods[e.key].remove()
      delete __hn_heldMods[e.key]
    }
  }, true)
}

async function connect({ newTab = false } = {}) {
  const browser = await chromium.connectOverCDP(CDP)
  const ctx = browser.contexts()[0] || await browser.newContext()
  let page
  let createdPage = false
  if (newTab || ctx.pages().length === 0) {
    page = await ctx.newPage()
    createdPage = true
  } else {
    page = ctx.pages()[0]
  }
  return { browser, ctx, page, createdPage }
}

async function disconnect({ browser, page, createdPage }) {
  if (createdPage) { try { await page.close() } catch { /* ignore */ } }
  try { await browser.close() } catch { /* ignore */ }
}

async function installOverlay(page, ctx) {
  // addInitScript runs on every future navigation.
  await ctx.addInitScript(OVERLAY_SCRIPT)
  // Also install on the currently-loaded document, if any.
  try { await page.evaluate(OVERLAY_SCRIPT) } catch { /* about:blank etc. */ }
}

async function screenshot(url, out, opts) {
  const conn = await connect(opts)
  if (url && url !== '-') await conn.page.goto(url, { waitUntil: 'networkidle' })
  await conn.page.screenshot({ path: out, fullPage: true })
  console.log(`saved ${out}`)
  await disconnect(conn)
}

async function goto(url, opts) {
  const conn = await connect(opts)
  await conn.page.goto(url, { waitUntil: 'networkidle' })
  console.log(`navigated to ${url}`)
  await disconnect(conn)
}

async function evalJs(expr, opts) {
  const conn = await connect(opts)
  const result = await conn.page.evaluate(expr)
  console.log(JSON.stringify(result, null, 2))
  await disconnect(conn)
}

// Uses CDP Page.startScreencast to capture frames, then ffmpeg to assemble webm.
// Overlay (URL bar + cursor + click/key indicators) is injected before capture.
async function record(url, out, durationMs, opts) {
  await runRecording(out, opts, async (page) => {
    if (url && url !== '-') await page.goto(url, { waitUntil: 'domcontentloaded' })
    await new Promise(r => setTimeout(r, Number(durationMs) || 10_000))
  })
}

// Build interaction helpers for record-script. These wrap hover → wait →
// interact so the cursor dot is always on-target when the click fires.
function buildHelpers(page) {
  const MOVE_DELAY = 180
  const TYPE_DELAY = 60

  const loc = (sel) => typeof sel === 'string' ? page.locator(sel) : sel

  async function move(target) {
    await loc(target).hover()
    await page.waitForTimeout(MOVE_DELAY)
  }

  async function click(target) {
    await move(target)
    await loc(target).click()
  }

  async function type(target, text, opts = {}) {
    const delay = opts.delay || TYPE_DELAY
    await click(target)
    await page.keyboard.type(text, { delay })
  }

  async function waitFor(target, opts = {}) {
    await loc(target).waitFor(opts)
  }

  let hlCounter = 0

  async function highlight(target, label, opts = {}) {
    const l = loc(target)
    const id = `__hn_hl_${hlCounter++}`
    const color = opts.color || '#ff3333'
    await l.evaluate((el, { id, label, color }) => {
      window.__highlight({ element: el, label, color, id })
    }, { id, label, color })
    return id
  }

  async function removeHighlight(id) {
    if (!id) return
    await page.evaluate((id) => window.__removeHighlight(id), id)
  }

  async function clearHighlights() {
    await page.evaluate(() => window.__clearHighlights())
  }

  return { click, type, move, waitFor, highlight, removeHighlight, clearHighlights, MOVE_DELAY, TYPE_DELAY }
}

// Run a user-provided playwright script while recording. The script receives
// helpers for interaction (click, type, move, waitFor, highlight, etc.) plus
// a `startRecording` callback — call it after page load / setup is done so
// the video only captures smooth user interactions, not the initial load.
// Recording stops the moment the script's promise resolves.
// Viewport is pinned to 1280×720.
//
// The script must default-export an async function that accepts
// {page, ctx, startRecording, click, type, move, waitFor, highlight, ...}.
async function recordScript(scriptPath, out, opts) {
  const path = await import('node:path')
  const { pathToFileURL } = await import('node:url')
  const abs = path.resolve(scriptPath)
  const mod = await import(pathToFileURL(abs).href)
  const action = mod.default || mod.run
  if (typeof action !== 'function') {
    throw new Error(`script ${scriptPath} must default-export (or export 'run') an async function ({page, ctx, startRecording, click, type, ...}) => ...`)
  }
  // Always use a new tab so the script doesn't trample on whatever the user is
  // currently looking at, and so the overlay's cursor starts in a clean place.
  // deferCapture: script controls when frames start being saved via startRecording().
  // viewport: pin to 1280×720 for consistent recording output.
  await runRecording(out, { ...opts, newTab: true, deferCapture: true, viewport: { width: 1280, height: 720 } }, async (page, ctx, startRecording) => {
    const helpers = buildHelpers(page)
    await action({ page, ctx, startRecording, ...helpers })
  })
}

// Shared recording machinery — sets up overlay + screencast, runs the body,
// then stops + ffmpeg-assembles. `body` controls what happens during capture
// (fixed duration for `record`, scripted actions for `recordScript`).
//
// opts.deferCapture: if true, frames are discarded until body calls
// startRecording(). Use for record-script so the initial page load
// (blank → spinner → content) stays out of the video.
async function runRecording(out, opts, body) {
  const conn = await connect(opts)
  if (opts.viewport) {
    await conn.page.setViewportSize(opts.viewport)
  }
  await installOverlay(conn.page, conn.ctx)
  try { await conn.page.evaluate(OVERLAY_SCRIPT) } catch {}
  // addInitScript can miss navigations on CDP connections — re-inject on load.
  conn.page.on('load', async () => {
    try { await conn.page.evaluate(OVERLAY_SCRIPT) } catch {}
  })
  const client = await conn.page.context().newCDPSession(conn.page)
  const tmpDir = `/tmp/screencast-${Date.now()}`
  await fs.mkdir(tmpDir, { recursive: true })
  let frame = 0
  let capturing = !opts.deferCapture
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    if (capturing) {
      const n = String(frame++).padStart(6, '0')
      await fs.writeFile(`${tmpDir}/f${n}.jpg`, Buffer.from(data, 'base64'))
    }
    await client.send('Page.screencastFrameAck', { sessionId })
  })
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 80, everyNthFrame: 1 })
  const startRecording = () => { capturing = true }
  try {
    await body(conn.page, conn.ctx, startRecording)
  } finally {
    try { await client.send('Page.stopScreencast') } catch { /* page may be closed */ }
    await disconnect(conn)
  }
  await new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-y', '-framerate', '15', '-i', `${tmpDir}/f%06d.jpg`, '-c:v', 'libvpx-vp9', '-b:v', '1M', out], { stdio: 'inherit' })
    ff.on('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`)))
  })
  await fs.rm(tmpDir, { recursive: true, force: true })
  console.log(`saved ${out}`)
}

const argv = process.argv.slice(2)
const newTab = argv.includes('--new-tab')
const positional = argv.filter(a => a !== '--new-tab')
const [cmd, ...rest] = positional
const opts = { newTab }
try {
  if (cmd === 'screenshot') await screenshot(rest[0], rest[1] || 'screenshot.png', opts)
  else if (cmd === 'record') await record(rest[0], rest[1] || 'recording.webm', rest[2], opts)
  else if (cmd === 'record-script') await recordScript(rest[0], rest[1] || 'recording.webm', opts)
  else if (cmd === 'goto') await goto(rest[0], opts)
  else if (cmd === 'eval') await evalJs(rest[0], opts)
  else {
    console.error(`Unknown command: ${cmd}`)
    console.error(`Usage: browser.mjs {screenshot|record|record-script|goto|eval} ... [--new-tab]`)
    process.exit(1)
  }
} catch (err) {
  console.error(err.message || err)
  process.exit(1)
}
