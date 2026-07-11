#!/usr/bin/env node
// Side-by-side comparison screenshot of two pages (before/after).
//
// Usage:
//   node /workspace/.claude/skills/my-browser-screenshot-comparison/my-browser-screenshot-comparison.mjs [options]
//
// Options:
//   --before-url URL         Full URL for the "before" screenshot
//   --after-url URL          Full URL for the "after" screenshot
//   --before-label TEXT      Label for the before panel (default: "master")
//   --after-label TEXT       Label for the after panel (default: current git branch)
//   --path PATH              Page path appended to both base URLs (use with env vars)
//   --highlight SELECTOR     CSS selector of element to highlight (repeatable)
//   --wait-for SELECTOR      Wait for this element instead of networkidle (use for dev servers)
//   --output PATH            Output file (default: /workspace/screenshots/comparison.png)
//
// Environment variables (fallbacks when flags are not provided):
//   COMPARISON_BEFORE_URL    URL for the "before" deployment
//   COMPARISON_AFTER_URL     URL for the "after" deployment
//   COMPARISON_BEFORE_LABEL  Label for the before panel
//   COMPARISON_AFTER_LABEL   Label for the after panel

import { chromium } from 'playwright-core'
import { promises as fs } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

const CDP = process.env.CLAUDE_BROWSER_CDP || 'http://localhost:9222'

const PANEL_WIDTH = 1280
const PANEL_HEIGHT = 720
const HEADER_HEIGHT = 52
const DIVIDER_WIDTH = 4
const HIGHLIGHT_PADDING = 4
const HIGHLIGHT_COLOR = '#ff3333'
const HIGHLIGHT_BORDER_WIDTH = 2

function parseArgs(argv) {
  const args = {
    beforeUrl:   process.env.COMPARISON_BEFORE_URL   || '',
    afterUrl:    process.env.COMPARISON_AFTER_URL     || '',
    beforeLabel: process.env.COMPARISON_BEFORE_LABEL  || 'master',
    afterLabel:  process.env.COMPARISON_AFTER_LABEL   || '',
    highlights:  [],
    output:      '/workspace/screenshots/comparison.png',
    path:        '',
    waitFor:     '',
  }

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--before-url':   args.beforeUrl   = argv[++i]; break
      case '--after-url':    args.afterUrl    = argv[++i]; break
      case '--before-label': args.beforeLabel = argv[++i]; break
      case '--after-label':  args.afterLabel  = argv[++i]; break
      case '--highlight':    args.highlights.push(argv[++i]); break
      case '--output':       args.output      = argv[++i]; break
      case '--path':         args.path        = argv[++i]; break
      case '--wait-for':     args.waitFor     = argv[++i]; break
    }
  }

  if (args.path) {
    const suffix = args.path.startsWith('/') ? args.path : `/${args.path}`
    if (args.beforeUrl) args.beforeUrl = args.beforeUrl.replace(/\/+$/, '') + suffix
    if (args.afterUrl)  args.afterUrl  = args.afterUrl.replace(/\/+$/, '') + suffix
  }

  if (!args.afterLabel) {
    try {
      args.afterLabel = execSync('git branch --show-current', { encoding: 'utf8', cwd: '/workspace' }).trim() || 'current branch'
    } catch {
      args.afterLabel = 'current branch'
    }
  }

  if (!args.beforeUrl || !args.afterUrl) {
    console.error('Error: --before-url and --after-url are required (or set COMPARISON_BEFORE_URL / COMPARISON_AFTER_URL)')
    process.exit(1)
  }

  return args
}

async function capturePanel(ctx, url, selectors, waitFor) {
  const page = await ctx.newPage()
  await page.setViewportSize({ width: PANEL_WIDTH, height: PANEL_HEIGHT })

  if (waitFor) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.locator(waitFor).first().waitFor({ state: 'visible', timeout: 30_000 })
  } else {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
  }

  const highlights = []
  for (const sel of selectors) {
    try {
      const els = await page.locator(sel).all()
      for (const el of els) {
        const box = await el.boundingBox({ timeout: 5000 })
        if (box) highlights.push(box)
      }
    } catch { /* element not found, skip */ }
  }

  const buffer = await page.screenshot({ type: 'png' })
  await page.close()

  return { base64: buffer.toString('base64'), url, highlights }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function highlightDivs(highlights, offsetX) {
  return highlights.map(box => {
    const x = offsetX + box.x - HIGHLIGHT_PADDING
    const y = HEADER_HEIGHT + box.y - HIGHLIGHT_PADDING
    const w = box.width + HIGHLIGHT_PADDING * 2
    const h = box.height + HIGHLIGHT_PADDING * 2
    return `<div style="
      position:absolute;
      left:${x}px; top:${y}px;
      width:${w}px; height:${h}px;
      border:${HIGHLIGHT_BORDER_WIDTH}px solid ${HIGHLIGHT_COLOR};
      border-radius:3px;
      pointer-events:none;
      box-sizing:border-box;
    "></div>`
  }).join('\n')
}

function buildCompositeHtml(before, after, args) {
  const totalWidth = PANEL_WIDTH * 2 + DIVIDER_WIDTH
  const totalHeight = HEADER_HEIGHT + PANEL_HEIGHT
  const afterX = PANEL_WIDTH + DIVIDER_WIDTH

  return `<!DOCTYPE html>
<html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${totalWidth}px; height:${totalHeight}px;
    overflow:hidden; background:#1a1a2e;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  }
</style></head>
<body>

  <!-- Before header -->
  <div style="
    position:absolute; left:0; top:0;
    width:${PANEL_WIDTH}px; height:${HEADER_HEIGHT}px;
    background:#2a1a1a; border-bottom:1px solid #444;
    padding:8px 16px;
  ">
    <div style="font-size:14px; font-weight:700; color:#ff6b6b; letter-spacing:0.5px;">
      BEFORE <span style="font-weight:400; color:#cc8888;">(${escapeHtml(args.beforeLabel)})</span>
    </div>
    <div style="
      font-size:11px; color:#888;
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
      margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    ">${escapeHtml(before.url)}</div>
  </div>

  <!-- After header -->
  <div style="
    position:absolute; left:${afterX}px; top:0;
    width:${PANEL_WIDTH}px; height:${HEADER_HEIGHT}px;
    background:#1a1a2a; border-bottom:1px solid #444;
    padding:8px 16px;
  ">
    <div style="font-size:14px; font-weight:700; color:#6bc5ff; letter-spacing:0.5px;">
      AFTER <span style="font-weight:400; color:#88aacc;">(${escapeHtml(args.afterLabel)})</span>
    </div>
    <div style="
      font-size:11px; color:#888;
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
      margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    ">${escapeHtml(after.url)}</div>
  </div>

  <!-- Divider -->
  <div style="
    position:absolute; left:${PANEL_WIDTH}px; top:0;
    width:${DIVIDER_WIDTH}px; height:${totalHeight}px;
    background:#444;
  "></div>

  <!-- Before screenshot -->
  <img src="data:image/png;base64,${before.base64}" style="
    position:absolute; left:0; top:${HEADER_HEIGHT}px;
    width:${PANEL_WIDTH}px; height:${PANEL_HEIGHT}px;
  ">

  <!-- After screenshot -->
  <img src="data:image/png;base64,${after.base64}" style="
    position:absolute; left:${afterX}px; top:${HEADER_HEIGHT}px;
    width:${PANEL_WIDTH}px; height:${PANEL_HEIGHT}px;
  ">

  <!-- Highlight rectangles -->
  ${highlightDivs(before.highlights, 0)}
  ${highlightDivs(after.highlights, afterX)}

</body></html>`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const browser = await chromium.connectOverCDP(CDP)
  const ctx = browser.contexts()[0] || await browser.newContext()

  console.log(`Capturing BEFORE: ${args.beforeUrl}`)
  const before = await capturePanel(ctx, args.beforeUrl, args.highlights, args.waitFor)

  console.log(`Capturing AFTER: ${args.afterUrl}`)
  const after = await capturePanel(ctx, args.afterUrl, args.highlights, args.waitFor)

  console.log('Compositing comparison image...')
  const html = buildCompositeHtml(before, after, args)

  const composePage = await ctx.newPage()
  const totalWidth = PANEL_WIDTH * 2 + DIVIDER_WIDTH
  const totalHeight = HEADER_HEIGHT + PANEL_HEIGHT
  await composePage.setViewportSize({ width: totalWidth, height: totalHeight })
  await composePage.setContent(html, { waitUntil: 'load' })

  await composePage.waitForFunction(() => {
    const imgs = document.querySelectorAll('img')
    return Array.from(imgs).every(img => img.complete && img.naturalWidth > 0)
  })

  await fs.mkdir(path.dirname(args.output), { recursive: true })
  await composePage.screenshot({ path: args.output, type: 'png' })
  await composePage.close()

  try { await browser.close() } catch {}
  console.log(`Saved comparison screenshot: ${args.output}`)
}

main().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})
