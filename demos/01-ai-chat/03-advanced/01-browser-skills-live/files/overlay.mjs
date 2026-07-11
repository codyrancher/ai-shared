// Shared overlay for all video recordings.
// Injects: cursor dot, click ripples, keystroke badges, URL bar, compositor repaints.
// Idempotent — safe to call multiple times or on every navigation.
//
// Usage:
//   import { installOverlay } from './overlay.mjs';
//   await page.evaluate(installOverlay);
//   await ctx.addInitScript(installOverlay);  // survive navigations
//   page.on('load', async () => { try { await page.evaluate(installOverlay); } catch {} });

export const installOverlay = () => {
  if (window.__overlayInstalled) return;
  window.__overlayInstalled = true;

  // --- Force continuous compositor repaints ----------------------------------
  // CDP screencast only emits frames when the compositor has new content.
  // Without this, quiet pauses produce no frames and the webm plays back
  // faster than real time.
  const repaintEl = document.createElement('div');
  repaintEl.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:100%;z-index:2147483640;pointer-events:none;opacity:0.003';
  document.body.appendChild(repaintEl);
  let hue = 0;
  (function tick() { hue = (hue + 1) % 360; repaintEl.style.background = `hsl(${hue},100%,50%)`; requestAnimationFrame(tick); })();

  // --- URL bar (bottom, 28px) ------------------------------------------------
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'left:0', 'right:0', 'bottom:0', 'height:28px',
    'background:rgba(18,18,22,0.82)', 'color:#eaeaea',
    'font:12px/28px ui-monospace,SFMono-Regular,Menlo,monospace',
    'padding:0 10px', 'z-index:2147483647', 'pointer-events:none',
    'border-top:1px solid rgba(255,255,255,0.1)',
    'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
    'backdrop-filter:blur(6px)',
    'display:flex', 'align-items:center', 'gap:8px',
  ].join(';');
  bar.innerHTML = '<span style="opacity:0.55;font-size:11px">URL</span><span id="__url"></span>';
  document.documentElement.appendChild(bar);
  const updateUrl = () => {
    const el = document.getElementById('__url');
    if (!el) return;
    el.textContent = location.href;
    const b = document.getElementById('__urlbar');
    if (b) {
      b.style.transition = 'none';
      b.style.background = 'rgba(220,60,100,0.6)';
      requestAnimationFrame(() => {
        b.style.transition = 'background 3s ease-out';
        b.style.background = 'rgba(18,18,22,0.82)';
      });
    }
  };
  bar.id = '__urlbar';
  updateUrl();
  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function() { origPush.apply(this, arguments); updateUrl(); };
  history.replaceState = function() { origReplace.apply(this, arguments); updateUrl(); };
  window.addEventListener('popstate', updateUrl);
  window.addEventListener('hashchange', updateUrl);

  // --- Cursor dot (16px pink circle with white border) -----------------------
  // No CSS transition — the recording script interpolates pointer position via
  // smoothMove(), so the dot should follow each mousemove event 1:1. A CSS
  // transition would smear over the per-step moves and lag visibly.
  const cursor = document.createElement('div');
  cursor.id = '__cursor';
  cursor.style.cssText = [
    'position:fixed', 'width:16px', 'height:16px',
    'background:rgba(220,60,100,0.85)', 'border:2px solid #fff',
    'border-radius:50%', 'box-shadow:0 2px 8px rgba(0,0,0,0.45)',
    'pointer-events:none', 'z-index:2147483646',
    'transform:translate(-50%,-50%)',
    'top:-100px', 'left:-100px',
  ].join(';');
  document.documentElement.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
  }, true);

  // --- Click ripples ---------------------------------------------------------
  const rippleCSS = document.createElement('style');
  rippleCSS.textContent = '@keyframes __ripple { to { width:50px; height:50px; opacity:0; } }';
  document.documentElement.appendChild(rippleCSS);
  document.addEventListener('mousedown', (e) => {
    const r = document.createElement('div');
    r.style.cssText = [
      'position:fixed', `top:${e.clientY}px`, `left:${e.clientX}px`,
      'width:10px', 'height:10px',
      'background:rgba(220,60,100,0.3)',
      'border:2px solid rgba(220,60,100,0.85)',
      'border-radius:50%', 'pointer-events:none',
      'z-index:2147483646', 'transform:translate(-50%,-50%)',
      'animation:__ripple .5s ease-out forwards',
    ].join(';');
    document.documentElement.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }, true);

  // --- Keystroke badges (bottom-right, above URL bar) ------------------------
  const tray = document.createElement('div');
  tray.style.cssText = [
    'position:fixed', 'right:12px', 'bottom:40px',
    'display:flex', 'flex-direction:column', 'align-items:flex-end',
    'gap:4px', 'pointer-events:none', 'z-index:2147483646',
  ].join(';');
  document.documentElement.appendChild(tray);
  const keyfadeCSS = document.createElement('style');
  keyfadeCSS.textContent = '@keyframes __keyfade { 0%{opacity:0;transform:translateY(6px)} 15%{opacity:1;transform:translateY(0)} 70%{opacity:1} 100%{opacity:0;transform:translateY(-4px)} }';
  document.documentElement.appendChild(keyfadeCSS);
  document.addEventListener('keydown', (e) => {
    const parts = [];
    if (e.ctrlKey && e.key !== 'Control') parts.push('Ctrl');
    if (e.metaKey && e.key !== 'Meta') parts.push('⌘');
    if (e.altKey && e.key !== 'Alt') parts.push('Alt');
    if (e.shiftKey && e.key.length > 1 && e.key !== 'Shift') parts.push('Shift');
    let key = e.key === ' ' ? 'Space' : e.key;
    if (['Control', 'Meta', 'Alt', 'Shift'].includes(key)) return;
    parts.push(key);
    const b = document.createElement('div');
    b.textContent = parts.join('+');
    b.style.cssText = [
      'background:rgba(18,18,22,0.92)', 'color:#fff',
      'font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace',
      'padding:6px 9px', 'border-radius:4px',
      'border:1px solid rgba(255,255,255,0.15)',
      'animation:__keyfade 1s ease-out forwards',
    ].join(';');
    tray.appendChild(b);
    setTimeout(() => b.remove(), 1100);
  }, true);

  // --- Highlight rectangles --------------------------------------------------
  // window.__highlight({ selector, rect, label, color }) -> id
  // window.__removeHighlight(id)
  // window.__clearHighlights()
  //
  // Static red rectangle around an element (style matched to my-browser-screenshot-comparison:
  // #ff3333, 2px border, 4px padding, 3px radius). Repositions every frame so
  // it tracks scrolling and layout shifts. Optional label badge above the rect.
  // pointer-events: none, so it never blocks clicks.
  const HL_COLOR = '#ff3333';
  const HL_PAD = 4;
  const HL_BORDER = 2;
  let __hlSeq = 0;
  window.__highlight = function(opts) {
    opts = opts || {};
    const id = '__hl_' + (++__hlSeq);
    const wrap = document.createElement('div');
    wrap.id = id;
    // Sits above the cursor dot (2147483646) so the label is never obscured
    // by the cursor when it arrives at the highlighted element.
    wrap.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483647;top:0;left:0;width:0;height:0';

    const rectDiv = document.createElement('div');
    rectDiv.style.cssText = [
      'position:fixed',
      `border:${HL_BORDER}px solid ${opts.color || HL_COLOR}`,
      'border-radius:3px',
      `box-shadow:0 0 0 1px rgba(255,255,255,0.5),0 0 12px ${opts.color || HL_COLOR}`,
      'pointer-events:none',
    ].join(';');
    wrap.appendChild(rectDiv);

    let labelDiv = null;
    if (opts.label) {
      labelDiv = document.createElement('div');
      labelDiv.textContent = opts.label;
      labelDiv.style.cssText = [
        'position:fixed',
        `background:${opts.color || HL_COLOR}`, 'color:#fff',
        'font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace',
        'padding:4px 8px', 'border-radius:3px',
        'white-space:nowrap',
        'box-shadow:0 1px 4px rgba(0,0,0,0.4)',
        'pointer-events:none',
      ].join(';');
      wrap.appendChild(labelDiv);
    }
    document.documentElement.appendChild(wrap);

    // Normalize the box shape — accept either Playwright's boundingBox()
    // ({x, y, width, height}) or DOM's getBoundingClientRect() (which has
    // {left, top, right, bottom, width, height}). The earlier version only
    // read .left/.top, so a Playwright rect would resolve to NaN and CSS
    // would render the highlight at 0,0 (top-left of viewport).
    const normalizeBox = (b) => {
      if (!b) return null;
      const left   = (typeof b.left   === 'number') ? b.left
                   : (typeof b.x      === 'number') ? b.x
                   : null;
      const top    = (typeof b.top    === 'number') ? b.top
                   : (typeof b.y      === 'number') ? b.y
                   : null;
      const width  = (typeof b.width  === 'number') ? b.width  : null;
      const height = (typeof b.height === 'number') ? b.height : null;
      if (left === null || top === null || width === null || height === null) return null;
      return { left, top, width, height };
    };
    const getBox = () => {
      if (opts.rect) return normalizeBox(opts.rect);
      if (opts.selector) {
        const el = document.querySelector(opts.selector);
        if (!el) return null;
        return normalizeBox(el.getBoundingClientRect());
      }
      return null;
    };
    const tick = () => {
      if (!document.getElementById(id)) return;
      const b = getBox();
      if (b) {
        rectDiv.style.left = (b.left - HL_PAD) + 'px';
        rectDiv.style.top = (b.top - HL_PAD) + 'px';
        rectDiv.style.width = (b.width + HL_PAD * 2) + 'px';
        rectDiv.style.height = (b.height + HL_PAD * 2) + 'px';
        rectDiv.style.display = '';
        if (labelDiv) {
          // Place label above the rect; if it would clip the top, drop it below.
          const labelLeft = Math.max(4, b.left - HL_PAD);
          const aboveTop = b.top - HL_PAD - 26;
          labelDiv.style.left = labelLeft + 'px';
          labelDiv.style.top = (aboveTop > 4 ? aboveTop : (b.top + b.height + HL_PAD + 4)) + 'px';
          labelDiv.style.display = '';
        }
      } else {
        rectDiv.style.display = 'none';
        if (labelDiv) labelDiv.style.display = 'none';
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return id;
  };
  window.__removeHighlight = function(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  };
  window.__clearHighlights = function() {
    document.querySelectorAll('[id^="__hl_"]').forEach(el => el.remove());
  };

  // --- Banner (narrative text strip near the top) ----------------------------
  // window.__banner('text', { duration: 3000, color: '#ff3333' }) -> id
  // window.__removeBanner(id)
  //
  // For narrative annotations like "Demonstrating live update by adding a
  // service". Sits below the URL bar with a fade-in/out animation. If
  // `duration` is set, auto-removes after that many ms. Otherwise call
  // __removeBanner(id) yourself. Multiple banners stack.
  let __bannerSeq = 0;
  const bannerWrap = document.createElement('div');
  bannerWrap.id = '__bannerWrap';
  bannerWrap.style.cssText = [
    'position:fixed', 'top:12px', 'left:50%',
    'transform:translateX(-50%)',
    'display:flex', 'flex-direction:column', 'align-items:center',
    'gap:6px', 'pointer-events:none', 'z-index:2147483647',
    'max-width:80vw',
  ].join(';');
  document.documentElement.appendChild(bannerWrap);
  const bannerFadeCSS = document.createElement('style');
  bannerFadeCSS.textContent = '@keyframes __bannerIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } } @keyframes __bannerOut { from { opacity:1; } to { opacity:0; transform:translateY(-6px); } }';
  document.documentElement.appendChild(bannerFadeCSS);
  window.__banner = function(text, opts) {
    opts = opts || {};
    const id = '__bn_' + (++__bannerSeq);
    const el = document.createElement('div');
    el.id = id;
    el.textContent = text;
    el.style.cssText = [
      `background:${opts.color || 'rgba(18,18,22,0.92)'}`,
      'color:#fff',
      'font:600 13px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace',
      'padding:8px 14px', 'border-radius:6px',
      'border:1px solid rgba(255,255,255,0.15)',
      'box-shadow:0 4px 12px rgba(0,0,0,0.5)',
      'animation:__bannerIn .25s ease-out forwards',
      'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
      'max-width:100%',
    ].join(';');
    bannerWrap.appendChild(el);
    if (opts.duration && opts.duration > 0) {
      setTimeout(() => window.__removeBanner(id), opts.duration);
    }
    return id;
  };
  window.__removeBanner = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.animation = '__bannerOut .25s ease-out forwards';
    setTimeout(() => el.remove(), 260);
  };
  window.__clearBanners = function() {
    document.querySelectorAll('[id^="__bn_"]').forEach(el => el.remove());
  };

  // --- Kill webpack-dev-server error overlay ---------------------------------
  const killOverlay = () => {
    ['webpack-dev-server-client-overlay', 'webpack-dev-server-client-overlay-div'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  };
  killOverlay();
  new MutationObserver(killOverlay).observe(document.documentElement, { childList: true, subtree: true });
};
