/* app.js - renders the AI Presentation site from window.PRESENTATION. */
(function () {
  'use strict';

  var P = window.PRESENTATION;
  var REPO = P.repo.replace(/\/$/, '');
  var BRANCH = 'main';

  var SPARK =
    '<svg class="spark" viewBox="0 0 24 24"><path fill="#d97757" d="M12 1.5l1.7 6.2c.3 1.1 1.5 2.3 2.6 2.6L22.5 12l-6.2 1.7c-1.1.3-2.3 1.5-2.6 2.6L12 22.5l-1.7-6.2c-.3-1.1-1.5-2.3-2.6-2.6L1.5 12l6.2-1.7c1.1-.3 2.3-1.5 2.6-2.6z"/></svg>';
  var COPY =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
  var EXPAND =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

  // ---- helpers ------------------------------------------------------------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function highlightPlaceholders(escaped) {
    // escaped text: highlight [bracket] and <angle> placeholder tokens
    return escaped
      .replace(/\[[^\]]+\]/g, function (m) { return '<span class="ph">' + m + '</span>'; })
      .replace(/&lt;[^&]*?&gt;/g, function (m) { return '<span class="ph">' + m + '</span>'; });
  }
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function blobUrl(path, file) { return REPO + '/blob/' + BRANCH + '/' + path + '/' + file; }
  function treeUrl(path) { return REPO + '/tree/' + BRANCH + '/' + path; }

  function copyText(text, btn) {
    var done = function () {
      var old = btn.innerHTML;
      btn.classList.add('done');
      btn.innerHTML = COPY + ' Copied';
      setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    } else {
      fallback(text); done();
    }
  }
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ---- markdown content loading + parsing --------------------------------
  // Demo copy lives in each demo's README.md + prompt.md (the manifest only
  // carries structure + media). We fetch those and pull a few anchors so the
  // renderer below stays unchanged:
  //   README.md : "**Why:**" line, "## What to look for" list, "## Skills & files" list
  //   prompt.md : each "## <title>" -> { why (**Why:**), text (``` block), screenshot (![]) }
  var mdCache = {};
  var currentDemoId = null;

  function mdSection(md, heading) {
    var re = new RegExp('^##\\s+' + heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm');
    var m = re.exec(md);
    if (!m) return '';
    var rest = md.slice(m.index + m[0].length);
    var next = rest.search(/^##\s+/m);
    return next >= 0 ? rest.slice(0, next) : rest;
  }
  function mdBullets(block) {
    return (block.match(/^-[ \t]+.+$/gm) || []).map(function (l) { return l.replace(/^-[ \t]+/, '').trim(); });
  }
  function parseReadme(md) {
    var why = (md.match(/^\*\*Why:\*\*[ \t]*(.+)$/m) || [])[1] || '';
    var skills = [], links = [];
    mdBullets(mdSection(md, 'Skills & files')).forEach(function (item) {
      var link = item.match(/\[`?([^`\]]+?)`?\]\(([^)]+)\)/);
      if (link) links.push({ label: link[1], href: link[2] });
      else { var sk = item.match(/`([^`]+)`/); if (sk) skills.push(sk[1]); }
    });
    return { why: why.trim(), lookFor: mdBullets(mdSection(md, 'What to look for')), skills: skills, links: links };
  }
  function parsePrompts(md) {
    var re = /^##[ \t]+(.+?)[ \t]*$/gm, heads = [], m;
    while ((m = re.exec(md))) heads.push({ title: m[1].trim(), lineStart: m.index, bodyStart: m.index + m[0].length });
    var out = [];
    for (var i = 0; i < heads.length; i++) {
      if (/^notes$/i.test(heads[i].title)) continue;
      var end = i + 1 < heads.length ? heads[i + 1].lineStart : md.length;
      var body = md.slice(heads[i].bodyStart, end);
      var code = body.match(/```[^\n]*\n([\s\S]*?)\n?```/);
      var shot = body.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      out.push({
        label: heads[i].title,
        why: ((body.match(/^\*\*Why:\*\*[ \t]*(.+)$/m) || [])[1] || '').trim(),
        text: code ? code[1].replace(/\s+$/, '') : '',
        screenshot: shot ? { alt: shot[1], src: shot[2] } : null
      });
    }
    return out;
  }
  function fetchText(url) {
    return fetch(url).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; });
  }
  function loadDemoContent(demo) {
    if (mdCache[demo.path]) return mdCache[demo.path];
    var base = demo.path + '/';
    var p = Promise.all([fetchText(base + 'README.md'), fetchText(base + 'prompt.md')]).then(function (res) {
      var r = parseReadme(res[0]);
      return { why: r.why, lookFor: r.lookFor, skills: r.skills, links: r.links, prompts: parsePrompts(res[1]) };
    });
    mdCache[demo.path] = p;
    return p;
  }

  // ---- flatten demos for routing + counts ---------------------------------
  var FLAT = [];
  P.sections.forEach(function (section) {
    section.groups.forEach(function (group) {
      group.demos.forEach(function (demo) {
        FLAT.push({ demo: demo, section: section, group: group });
      });
    });
  });
  function findEntry(id) {
    for (var i = 0; i < FLAT.length; i++) if (FLAT[i].demo.id === id) return FLAT[i];
    return null;
  }

  // ---- sidebar tree -------------------------------------------------------
  function renderTree(activeId) {
    var tree = document.getElementById('tree');
    var h = '';
    h += row('overview', 'overview', '<span class="dot">✳</span>', 'Overview', activeId === 'overview');
    P.sections.forEach(function (section) {
      h += '<div class="group-label">▾ ' + esc(section.title) + '</div>';
      section.groups.forEach(function (group) {
        var deep = !!group.title;
        if (deep) h += '<div class="group-label" style="padding-left:26px">' + esc(group.title) + '</div>';
        group.demos.forEach(function (demo) {
          h += row(demo.id, deep ? 'lvl2' : 'lvl1',
            '<span class="dot">✳</span><span class="n">' + demo.n + '</span>',
            demo.title, activeId === demo.id);
        });
      });
    });
    tree.innerHTML = h;
    Array.prototype.forEach.call(tree.querySelectorAll('.row'), function (r) {
      r.addEventListener('click', function () { location.hash = '#' + r.getAttribute('data-id'); closeNav(); });
    });
  }
  function row(id, lvl, lead, label, active) {
    return '<div class="row ' + lvl + (active ? ' active' : '') + '" data-id="' + esc(id) + '">' +
      lead + '<span class="label">' + esc(label) + '</span></div>';
  }

  // ===== Component: ScreenshotThumb ========================================
  // A small clickable screenshot that opens the ImageModal preview.
  //   ScreenshotThumb({src, alt}, basePath) -> html string
  function ScreenshotThumb(shot, basePath) {
    var src = /^(https?:|data:|\/)/.test(shot.src) ? shot.src : basePath + '/' + shot.src;
    return '<button class="prompt-thumb" data-src="' + esc(src) + '" data-alt="' + esc(shot.alt || '') + '" title="Click to preview">' +
      '<img src="' + esc(src) + '" alt="' + esc(shot.alt || '') + '" draggable="false" ' +
      'onerror="this.closest(&quot;.prompt-thumb&quot;).classList.add(&quot;broken&quot;)" />' +
      '<span class="pt-badge">' + EXPAND + ' screenshot</span>' +
      '</button>';
  }

  // ===== Component: PromptBox ==============================================
  // Renders one prompt as a Claude-style chat box. Reusable:
  //   PromptBox(prompt, idx, basePath) -> html string
  //   prompt: { label?, text, screenshot?: { src, alt } }
  // When a screenshot is present, its thumbnail sits at the top of the box
  // (in place of a "[paste a screenshot ...]" line in the text).
  function PromptBox(prompt, idx, basePath) {
    var body = highlightPlaceholders(esc(prompt.text));
    var thumb = prompt.screenshot ? ScreenshotThumb(prompt.screenshot, basePath) : '';
    return '' +
      '<div class="chat">' +
        (prompt.label ? '<div class="prompt-title">' + esc(prompt.label) + '</div>' : '') +
        (prompt.why ? '<div class="prompt-why">' + esc(prompt.why) + '</div>' : '') +
        '<div class="claude-box">' +
          '<div class="cb-head">' + SPARK +
            '<span class="who">You</span>' +
            '<span class="spacer"></span>' +
            '<button class="copy" data-i="' + idx + '">' + COPY + ' Copy</button>' +
          '</div>' +
          '<div class="cb-body">' + thumb + '<div class="cb-text">' + body + '</div></div>' +
          '<div class="cb-foot"><span class="hint">Paste into Claude Code in the harness project</span></div>' +
        '</div>' +
      '</div>';
  }

  // ---- media --------------------------------------------------------------
  function mediaCard(m, path) {
    if (m.pending) {
      return '<div class="media-card"><div class="placeholder">' +
        '<div><div class="big">' + (m.type === 'video' ? '🎬' : '🖼️') + '</div>' +
        '<div>Recording pending</div>' +
        '<div class="fn">' + esc(path + '/' + m.src) + '</div>' +
        (m.captureWith ? '<div class="cw">capture with ' + esc(m.captureWith) + '</div>' : '') +
        '</div></div>' +
        '<div class="cap">' + esc(m.caption || '') + '</div></div>';
    }
    var src = path + '/' + m.src;
    var inner = m.type === 'video'
      ? '<video controls preload="metadata" src="' + esc(src) + '"></video>'
      : '<img loading="lazy" alt="' + esc(m.caption || '') + '" src="' + esc(src) + '" ' +
        'onerror="this.closest(&quot;.media-card&quot;).classList.add(&quot;broken&quot;);this.remove();" />';
    return '<div class="media-card">' + inner +
      '<div class="cap">' + esc(m.caption || '') + '</div></div>';
  }

  // ===== Component: ImageModal ============================================
  // A reusable pan + zoom lightbox. Mount once, then ImageModal.open(src, alt).
  //   - drag to pan, wheel to zoom toward the cursor, double-click to reset
  //   - close with the X button or Esc
  var ImageModal = (function () {
    var root, stage, img, titleEl;
    var scale = 1, tx = 0, ty = 0, natW = 0, natH = 0;
    var dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
    var MIN = 0.1, MAX = 8;

    function apply() { img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')'; }
    function fit() {
      var r = stage.getBoundingClientRect();
      if (!natW || !natH) return;
      var s = Math.min(1, (r.width - 48) / natW, (r.height - 64) / natH);
      scale = s > 0 ? s : 1;
      tx = (r.width - natW * scale) / 2;
      ty = (r.height - natH * scale) / 2;
      apply();
    }
    function onWheel(e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      var cx = e.clientX - r.left, cy = e.clientY - r.top;
      var ns = Math.min(MAX, Math.max(MIN, scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
      tx = cx - (cx - tx) * (ns / scale);
      ty = cy - (cy - ty) * (ns / scale);
      scale = ns; apply();
    }
    function onDown(e) {
      if (e.button !== 0) return;
      dragging = true; sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
      stage.classList.add('grabbing'); e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      tx = stx + (e.clientX - sx); ty = sty + (e.clientY - sy); apply();
    }
    function onUp() { dragging = false; stage.classList.remove('grabbing'); }

    function open(src, alt) {
      titleEl.textContent = alt || '';
      natW = natH = 0; img.style.transform = '';
      img.onload = function () { natW = img.naturalWidth; natH = img.naturalHeight; fit(); };
      img.src = src; img.alt = alt || '';
      root.classList.add('show'); root.setAttribute('aria-hidden', 'false');
      if (img.complete && img.naturalWidth) { natW = img.naturalWidth; natH = img.naturalHeight; fit(); }
    }
    function close() { root.classList.remove('show'); root.setAttribute('aria-hidden', 'true'); img.src = ''; }

    function mount() {
      if (root) return;
      root = el(
        '<div class="img-modal" aria-hidden="true">' +
          '<div class="img-modal-bar">' +
            '<span class="img-modal-title"></span>' +
            '<span class="img-modal-hint">drag to move · scroll to zoom · double-click to reset · Esc to close</span>' +
            '<button class="img-modal-close" aria-label="Close preview">✕</button>' +
          '</div>' +
          '<div class="img-modal-stage"><img class="img-modal-img" alt="" draggable="false" /></div>' +
        '</div>'
      );
      document.body.appendChild(root);
      stage = root.querySelector('.img-modal-stage');
      img = root.querySelector('.img-modal-img');
      titleEl = root.querySelector('.img-modal-title');
      root.querySelector('.img-modal-close').addEventListener('click', close);
      stage.addEventListener('wheel', onWheel, { passive: false });
      stage.addEventListener('mousedown', onDown);
      stage.addEventListener('dblclick', fit);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('show')) close(); });
      window.addEventListener('resize', function () { if (root.classList.contains('show')) fit(); });
    }
    return { mount: mount, open: open, close: close };
  })();

  // ---- render a demo (copy is fetched from its markdown) -----------------
  function renderDemo(entry) {
    var d = entry.demo, section = entry.section, group = entry.group;
    currentDemoId = d.id;
    document.getElementById('tabName').textContent = d.title;
    var crumb = [section.title].concat(group.title ? [group.title] : []).concat([d.title]);
    document.getElementById('breadcrumbs').innerHTML = crumb
      .map(function (c) { return '<span>' + esc(c) + '</span>'; })
      .join('<span class="sep">›</span>');

    var content = document.getElementById('content');
    content.innerHTML =
      '<div class="eyebrow">' + esc(section.title) + (group.title ? ' · ' + esc(group.title) : '') + '</div>' +
      '<h1 class="demo-title">' + esc(d.title) + '</h1>' +
      '<div id="demo-body"><p class="loading">Loading…</p></div>';
    content.scrollTop = 0;

    loadDemoContent(d).then(function (c) {
      if (currentDemoId !== d.id) return;               // navigated away mid-fetch
      var body = document.getElementById('demo-body');
      if (!body) return;
      var h = '';
      if (c.why) h += '<p class="why-lead">' + esc(c.why) + '</p>';
      h += c.prompts.map(function (p, i) { return PromptBox(p, i, d.path); }).join('');

      if (c.lookFor && c.lookFor.length) {
        h += '<div class="section-h">What to look for</div>';
        h += '<ul class="lookfor">' + c.lookFor.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
      }

      h += '<div class="section-h">Result</div>';
      h += '<div class="media-grid">' + (d.media && d.media.length
        ? d.media.map(function (m) { return mediaCard(m, d.path); }).join('')
        : '<div class="media-card"><div class="placeholder"><div>No media yet</div></div></div>') + '</div>';

      var chips = (c.skills || []).map(function (s) { return '<span class="chip skill">✳ ' + esc(s) + '</span>'; });
      (c.links || []).forEach(function (l) {
        chips.push('<a class="chip file" target="_blank" rel="noopener" href="' + esc(blobUrl(d.path, l.href)) + '">▸ ' + esc(l.label) + '</a>');
      });
      chips.push('<a class="chip file" target="_blank" rel="noopener" href="' + esc(blobUrl(d.path, 'prompt.md')) + '">▸ prompt.md</a>');
      chips.push('<a class="chip file" target="_blank" rel="noopener" href="' + esc(blobUrl(d.path, 'README.md')) + '">▸ README.md</a>');
      h += '<div class="section-h">Skills &amp; files</div><div class="chips">' + chips.join('') + '</div>';

      h += '<div class="folder-link">Demo folder: <a target="_blank" rel="noopener" href="' + esc(treeUrl(d.path)) + '"><code>' + esc(d.path) + '</code></a></div>';

      body.innerHTML = h;
      Array.prototype.forEach.call(body.querySelectorAll('.copy'), function (btn) {
        btn.addEventListener('click', function () { copyText(c.prompts[+btn.getAttribute('data-i')].text, btn); });
      });
      Array.prototype.forEach.call(body.querySelectorAll('.prompt-thumb'), function (btn) {
        btn.addEventListener('click', function () { ImageModal.open(btn.getAttribute('data-src'), btn.getAttribute('data-alt')); });
      });
    }).catch(function () {
      if (currentDemoId !== d.id) return;
      var body = document.getElementById('demo-body');
      if (body) body.innerHTML = '<p class="loading">Could not load this demo. Serve the site over http (a local server or GitHub Pages); opening index.html via file:// blocks fetch.</p>';
    });
  }

  // ---- render overview ----------------------------------------------------
  function renderOverview() {
    currentDemoId = null;
    document.getElementById('tabName').textContent = 'Overview';
    document.getElementById('breadcrumbs').innerHTML = '<span>' + esc(P.title) + '</span>';
    var total = FLAT.length;
    var h = '';
    h += '<div class="ov-hero">' +
      '<div class="kicker">' + esc(P.model) + '</div>' +
      '<h1>' + esc(P.title) + '</h1>' +
      '<div class="tag">' + esc(P.tagline) + '</div></div>';

    h += '<div class="ov-card"><h3>' + esc(P.intro.heading) + '</h3><ul>' +
      P.intro.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>';

    h += '<div class="section-h">Demos (' + total + ')</div>';
    h += '<div class="ov-sections">';
    P.sections.forEach(function (section) {
      var count = 0;
      section.groups.forEach(function (g) { count += g.demos.length; });
      var first = section.groups[0].demos[0].id;
      h += '<div class="ov-sec" data-goto="' + esc(first) + '">' +
        '<h4>' + esc(section.title) + '</h4>' +
        '<p>' + esc(section.blurb) + '</p>' +
        '<div class="count">' + count + ' demo' + (count === 1 ? '' : 's') + ' →</div></div>';
    });
    h += '</div>';

    var content = document.getElementById('content');
    content.innerHTML = h;
    content.scrollTop = 0;
    Array.prototype.forEach.call(content.querySelectorAll('.ov-sec'), function (c) {
      c.addEventListener('click', function () { location.hash = '#' + c.getAttribute('data-goto'); });
    });
  }

  // ---- routing ------------------------------------------------------------
  function route() {
    var id = (location.hash || '').replace(/^#\/?/, '') || 'overview';
    var entry = findEntry(id);
    renderTree(entry ? id : 'overview');
    if (entry) renderDemo(entry); else renderOverview();
  }

  function closeNav() { document.body.classList.remove('nav-open'); }

  // ---- boot ---------------------------------------------------------------
  function boot() {
    document.getElementById('repoLink').href = REPO;
    document.getElementById('statusRepo').href = REPO;
    document.getElementById('statusCount').textContent = '✳ ' + FLAT.length + ' demos';
    document.getElementById('hamburger').addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    ImageModal.mount();
    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
