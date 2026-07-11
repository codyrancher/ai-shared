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
    // escaped text: highlight [bracket] context tokens (brackets stripped, so the
    // inner text reads naturally, e.g. "the current selection") and <angle> tokens.
    return escaped
      .replace(/\[[^\]]+\]/g, function (m) { return '<span class="ph">' + m.slice(1, -1) + '</span>'; })
      .replace(/&lt;[^&]*?&gt;/g, function (m) { return '<span class="ph">' + m + '</span>'; });
  }
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function blobUrl(path, file) { return REPO + '/blob/' + BRANCH + '/' + path + '/' + file; }
  function treeUrl(path) { return REPO + '/tree/' + BRANCH + '/' + path; }
  // A file chip that opens the FileModal preview on click (and links to GitHub on modified-click).
  function fileChip(basePath, label, href) {
    var abs = /^(https?:|\/)/.test(href) ? href : basePath + '/' + href;
    return '<a class="chip file" href="' + esc(blobUrl(basePath, href)) + '" data-file="' + esc(abs) + '" data-label="' + esc(label) + '">▸ ' + esc(label) + '</a>';
  }

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
  function parseMedia(md) {
    return mdBullets(mdSection(md, 'Result')).map(function (item) {
      var src = (item.match(/`([^`]+)`/) || [])[1] || '';
      var pend = item.match(/\(pending:\s*([^)]+)\)/i);
      var caption = item.replace(/`[^`]+`/, '').replace(/\(pending:[^)]*\)/i, '').replace(/^[\s-]+/, '').trim();
      return {
        type: /\.(webm|mp4|mov|m4v)$/i.test(src) ? 'video' : 'image',
        src: src, caption: caption, pending: !!pend, captureWith: pend ? pend[1].trim() : undefined
      };
    }).filter(function (m) { return m.src; });
  }
  function parseReadme(md) {
    var title = (md.match(/^#[ \t]+(.+?)[ \t]*$/m) || [])[1] || '';
    var why = (md.match(/^\*\*Why:\*\*[ \t]*(.+)$/m) || [])[1] || '';
    var skills = [], links = [];
    mdBullets(mdSection(md, 'Skills & files')).forEach(function (item) {
      var link = item.match(/\[`?([^`\]]+?)`?\]\(([^)]+)\)/);
      if (link) links.push({ label: link[1], href: link[2] });
      else { var sk = item.match(/`([^`]+)`/); if (sk) skills.push(sk[1]); }
    });
    return {
      title: title.trim(), why: why.trim(),
      lookFor: mdBullets(mdSection(md, 'What to look for')),
      skills: skills, links: links, media: parseMedia(md)
    };
  }
  // A demo's README holds both copy and prompts. Every `## heading` is a prompt
  // except these reserved section names.
  var RESERVED = { 'what to look for': 1, 'skills & files': 1, 'result': 1, 'notes': 1 };
  function parsePrompts(md) {
    var re = /^##[ \t]+(.+?)[ \t]*$/gm, heads = [], m;
    while ((m = re.exec(md))) heads.push({ title: m[1].trim(), lineStart: m.index, bodyStart: m.index + m[0].length });
    var out = [];
    for (var i = 0; i < heads.length; i++) {
      if (RESERVED[heads[i].title.toLowerCase()]) continue;
      var end = i + 1 < heads.length ? heads[i + 1].lineStart : md.length;
      var body = md.slice(heads[i].bodyStart, end);
      // Split the prompt body at the "**Result:**" marker so the prompt's own
      // screenshot/files are parsed from before it and result media from after.
      var resIdx = body.search(/^\*\*Result:\*\*/im);
      var beforeRes = resIdx >= 0 ? body.slice(0, resIdx) : body;
      var afterRes = resIdx >= 0 ? body.slice(resIdx) : '';

      var code = beforeRes.match(/```[^\n]*\n([\s\S]*?)\n?```/);
      var shot = beforeRes.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
      var filesLine = beforeRes.match(/^\*\*Files:\*\*[ \t]*(.+)$/im);
      var files = [];
      if (filesLine) {
        var fre = /\[([^\]]+)\]\(([^)]+)\)/g, fm;
        while ((fm = fre.exec(filesLine[1]))) files.push({ label: fm[1].replace(/`/g, ''), href: fm[2] });
      }
      // Result: images/videos -> a plain result block; a .md link -> a Claude reply. Both may coexist.
      var resultMedia = (afterRes.match(/!\[[^\]]*\]\([^)\s]+\)/g) || []).map(function (x) {
        var im = x.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
        return { alt: im[1], src: im[2], type: /\.(mp4|webm|mov|m4v)$/i.test(im[2]) ? 'video' : 'image' };
      });
      var linkMatch = resIdx >= 0 ? afterRes.match(/(?:^|[^!])\[([^\]]*)\]\(([^)\s]+)\)/) : null;
      var resultHref = linkMatch ? linkMatch[2] : null;
      var resultLabel = linkMatch ? linkMatch[1].replace(/`/g, '') : null;

      out.push({
        label: heads[i].title,
        why: ((beforeRes.match(/^\*\*Why:\*\*[ \t]*(.+)$/m) || [])[1] || '').trim(),
        text: code ? code[1].replace(/\s+$/, '') : '',
        screenshot: shot ? { alt: shot[1], src: shot[2] } : null,
        resultHref: resultHref,
        resultLabel: resultLabel,
        resultMedia: resultMedia,
        files: files
      });
    }
    return out;
  }
  function fetchText(url) {
    return fetch(url).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; });
  }
  // An entry under demos/ is a DEMO (anchor-parsed into prompt boxes). Anything
  // else (pages/...) is a PAGE: its whole README.md is rendered as markdown.
  function isPage(path) { return !/^demos\//.test(path); }

  function loadDemoContent(demo) {
    if (mdCache[demo.path]) return mdCache[demo.path];
    var p = fetchText(demo.path + '/README.md').then(function (md) {
      if (demo.page) {
        return { title: ((md.match(/^#\s+(.+?)\s*$/m) || [])[1] || demo.id), page: true, md: md };
      }
      var r = parseReadme(md);
      var prompts = parsePrompts(md);
      return Promise.all(prompts.map(function (pr) {
        // Only a local markdown result is fetched and rendered as a Claude reply.
        if (!pr.resultHref || /^https?:/i.test(pr.resultHref) || !/\.(md|markdown)$/i.test(pr.resultHref)) return pr;
        return fetchText(demo.path + '/' + pr.resultHref).then(function (t) { if (t) pr.resultMd = t; return pr; }, function () { return pr; });
      })).then(function (prs) {
        return { title: r.title, why: r.why, lookFor: r.lookFor, skills: r.skills, links: r.links, media: r.media, prompts: prs };
      });
    });
    mdCache[demo.path] = p;
    return p;
  }

  // id/n derived from the folder path; title/media/copy come from the markdown.
  function deriveId(path) { return path.split('/').pop().replace(/^\d+[-_]?/, ''); }
  function deriveN(path, i) { var m = path.split('/').pop().match(/^(\d+)/); return m ? parseInt(m[1], 10) : i + 1; }

  // Standalone pages pinned to the top of the nav (outline, then overview), in order.
  // Each is a page whose whole README.md renders as markdown; the first is the root route.
  var TOP_PAGES = [];
  if (P.outline) TOP_PAGES.push({ id: 'outline', path: P.outline, nav: 'Agenda' });
  if (P.overview) TOP_PAGES.push({ id: 'overview', path: P.overview, nav: 'AI 1 on 1s' });
  function topPageById(id) { for (var i = 0; i < TOP_PAGES.length; i++) if (TOP_PAGES[i].id === id) return TOP_PAGES[i]; return null; }
  var DEFAULT_ID = TOP_PAGES.length ? TOP_PAGES[0].id : (FLAT[0] && FLAT[0].demo.id);

  var contentById = {};
  var pageContent = {};
  function prefetchAll() {
    var jobs = FLAT.map(function (f) {
      return loadDemoContent(f.demo).then(
        function (c) { contentById[f.demo.id] = c; },
        function () { contentById[f.demo.id] = null; }
      );
    });
    TOP_PAGES.forEach(function (tp) {
      jobs.push(loadDemoContent({ path: tp.path, id: tp.id, page: true }).then(
        function (c) { pageContent[tp.id] = c; }, function () { pageContent[tp.id] = null; }
      ));
    });
    return Promise.all(jobs);
  }
  function demoTitle(demo) { var c = contentById[demo.id]; return (c && c.title) || demo.id; }

  // ---- flatten demos for routing + counts ---------------------------------
  var FLAT = [];
  P.sections.forEach(function (section) {
    section.groups.forEach(function (group) {
      group.demos.forEach(function (path, i) {
        var demo = { path: path, id: deriveId(path), n: deriveN(path, i), page: isPage(path) };
        group.demos[i] = demo; // replace the path string with the derived object
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
    TOP_PAGES.forEach(function (tp) {
      h += row(tp.id, 'overview', '<span class="dot">✳</span>', tp.nav, activeId === tp.id);
    });
    P.sections.forEach(function (section) {
      h += '<div class="group-label">▾ ' + esc(section.title) + '</div>';
      section.groups.forEach(function (group) {
        var deep = !!group.title;
        if (deep) h += '<div class="group-label" style="padding-left:26px">' + esc(group.title) + '</div>';
        group.demos.forEach(function (demo) {
          h += row(demo.id, deep ? 'lvl2' : 'lvl1',
            '<span class="dot">✳</span><span class="n">' + demo.n + '</span>',
            demoTitle(demo), activeId === demo.id);
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

  // ---- minimal markdown -> html (for rendering captured demo results) ----
  var mdBase = '';
  function resolveSrc(src) {
    return /^(https?:|data:|\/)/.test(src) ? src : (mdBase ? mdBase.replace(/\/$/, '') + '/' + src : src);
  }
  function mdInline(s) {
    s = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    s = s.replace(/`([^`]+)`/g, function (_, c) { return '<code>' + c + '</code>'; });
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (_, alt, src) {
      var u = resolveSrc(src);
      return '<img class="cr-img" alt="' + alt + '" src="' + u + '" data-full="' + u + '" />';
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) {
      // In-page anchors stay in this tab; everything else resolves against the
      // markdown's own folder so relative links (files/x.md) do not 404.
      if (/^#/.test(u)) return '<a href="' + u + '">' + t + '</a>';
      return '<a href="' + resolveSrc(u) + '" target="_blank" rel="noopener">' + t + '</a>';
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s;
  }
  // Build a (possibly nested) <ul> from list items tagged with their leading-space
  // indent, so sub-bullets nest instead of flattening to one level.
  function renderList(items) {
    var html = '', stack = [];
    for (var k = 0; k < items.length; k++) {
      var it = items[k];
      if (stack.length === 0) { stack.push(it.indent); html += '<ul><li>' + mdInline(it.text); continue; }
      var top = stack[stack.length - 1];
      if (it.indent > top) { stack.push(it.indent); html += '<ul><li>' + mdInline(it.text); }
      else if (it.indent === top) { html += '</li><li>' + mdInline(it.text); }
      else {
        while (stack.length > 1 && it.indent < stack[stack.length - 1]) { html += '</li></ul>'; stack.pop(); }
        html += '</li><li>' + mdInline(it.text);
        stack[stack.length - 1] = it.indent;
      }
    }
    while (stack.length > 0) { html += '</li></ul>'; stack.pop(); }
    return html;
  }
  // The generated section cards (live demo counts). Emitted by `::: sections`.
  function sectionsBlock() {
    var h = '<div class="section-h">Demos (' + FLAT.length + ')</div><div class="ov-sections">';
    P.sections.forEach(function (section) {
      var count = 0;
      section.groups.forEach(function (g) { count += g.demos.length; });
      var first = section.groups[0].demos[0].id;
      h += '<div class="ov-sec" data-goto="' + esc(first) + '">' +
        '<h4>' + esc(section.title) + '</h4>' +
        '<p>' + esc(section.blurb) + '</p>' +
        '<div class="count">' + count + ' demo' + (count === 1 ? '' : 's') + ' →</div></div>';
    });
    return h + '</div>';
  }

  // `::: <name>` ... `:::` containers, so a page's markdown can still produce the
  // richer blocks (hero, card, generated section cards) rather than plain prose.
  function renderContainer(name, inner, basePath, hOff) {
    if (name === 'sections') return sectionsBlock();
    if (name === 'hero') {
      var kick = inner.match(/^\*\*(.+?)\*\*\s*$/m);
      var h1 = inner.match(/^#\s+(.+?)\s*$/m);
      var tag = inner.split('\n').filter(function (l) {
        var t = l.trim();
        return t && !/^\*\*.+\*\*$/.test(t) && !/^#\s+/.test(t);
      }).join(' ').trim();
      return '<div class="ov-hero">' +
        (kick ? '<div class="kicker">' + mdInline(kick[1]) + '</div>' : '') +
        (h1 ? '<h1>' + mdInline(h1[1]) + '</h1>' : '') +
        (tag ? '<div class="tag">' + mdInline(tag) + '</div>' : '') +
        '</div>';
    }
    // Any other name becomes <div class="ov-<name>"> with its markdown rendered inside.
    return '<div class="ov-' + esc(name) + '">' + renderMarkdown(inner, basePath, hOff) + '</div>';
  }

  // headingOffset: how much to demote headings. Default 2, so an embedded result's
  // `#` renders as an <h3>. Pages pass 0 so their `#` is a real page <h1>.
  function renderMarkdown(md, basePath, headingOffset) {
    mdBase = basePath || '';
    var hOff = headingOffset == null ? 2 : headingOffset;
    var lines = String(md).replace(/\r/g, '').split('\n'), out = '', i = 0;
    var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    // YAML frontmatter (SKILL.md and friends). Render name/description as a header
    // block instead of letting the `---` fences collapse into a run-on paragraph.
    if (lines[0] === '---') {
      var fmEnd = -1;
      for (var f = 1; f < lines.length; f++) { if (lines[f] === '---') { fmEnd = f; break; } }
      if (fmEnd > 0) {
        var meta = {};
        for (var g = 1; g < fmEnd; g++) {
          var kv = lines[g].match(/^([A-Za-z_-]+):\s*(.*)$/);
          if (kv) meta[kv[1].toLowerCase()] = kv[2].trim();
        }
        if (meta.name || meta.description) {
          out += '<div class="md-front">' +
            (meta.name ? '<div class="mf-name">' + mdInline(meta.name) + '</div>' : '') +
            (meta.description ? '<div class="mf-desc">' + mdInline(meta.description) + '</div>' : '') +
            '</div>';
        }
        i = fmEnd + 1;
      }
    }

    while (i < lines.length) {
      var line = lines[i];
      if (/^```/.test(line)) {
        var buf = []; i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out += '<pre><code>' + esc(buf.join('\n')) + '</code></pre>'; continue;
      }
      var cm = line.match(/^:::\s*([a-z][\w-]*)\s*$/i);
      if (cm) {
        var cbuf = []; i++;
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) { cbuf.push(lines[i]); i++; }
        i++; // consume the closing :::
        out += renderContainer(cm[1].toLowerCase(), cbuf.join('\n'), basePath, hOff); continue;
      }
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i + 1])) {
        var cells = function (l) { return l.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); };
        var head = cells(line); i += 2; var rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
        out += '<table><thead><tr>' + head.map(function (c) { return '<th>' + mdInline(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + mdInline(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; continue;
      }
      var hm = line.match(/^(#{1,6})\s+(.+)$/);
      if (hm) { var lvl = Math.min(6, hm[1].length + hOff); out += '<h' + lvl + '>' + mdInline(hm[2].trim()) + '</h' + lvl + '>'; i++; continue; }
      if (/^>\s?/.test(line)) { var qb = []; while (i < lines.length && /^>\s?/.test(lines[i])) { qb.push(lines[i].replace(/^>\s?/, '')); i++; } out += '<blockquote>' + mdInline(qb.join(' ')) + '</blockquote>'; continue; }
      if (/^\s*[-*+]\s+/.test(line)) {
        var uli = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          var um = lines[i].match(/^(\s*)[-*+]\s+(.*)$/);
          uli.push({ indent: um[1].replace(/\t/g, '    ').length, text: um[2] });
          i++;
        }
        out += renderList(uli); continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) { var ol = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { ol.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; } out += '<ol>' + ol.map(function (t) { return '<li>' + mdInline(t) + '</li>'; }).join('') + '</ol>'; continue; }
      if (/^\s*$/.test(line)) { i++; continue; }
      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|>\s?|\s*[-*+]\s+|\s*\d+\.\s+)/.test(lines[i]) && !/^\s*\|.*\|\s*$/.test(lines[i])) { para.push(lines[i]); i++; }
      out += '<p>' + mdInline(para.join(' ')) + '</p>';
    }
    return out;
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
    // A result link is either a local .html page (embedded preview modal) or an
    // external URL (rendered as a link out, e.g. to a PR comment).
    var rHref = prompt.resultHref;
    var rExternal = !!rHref && /^https?:/i.test(rHref);
    var htmlHref = (rHref && !rExternal && /\.html?$/i.test(rHref)) ? rHref : null;
    var htmlUrl = htmlHref ? (/^(data:|\/)/.test(htmlHref) ? htmlHref : basePath + '/' + htmlHref) : null;
    var htmlLabel = prompt.resultLabel || 'Result';
    var extUrl = rExternal ? rHref : null;
    return '' +
      '<div class="chat">' +
        (prompt.label ? '<div class="prompt-title">' + esc(prompt.label) + '</div>' : '') +
        (prompt.why ? '<div class="prompt-why">' + esc(prompt.why) + '</div>' : '') +
        (prompt.files && prompt.files.length ? '<div class="prompt-files">' + prompt.files.map(function (f) { return fileChip(basePath, f.label, f.href); }).join('') + '</div>' : '') +
        (prompt.text
          ? '<div class="claude-box">' +
              '<div class="cb-head">' + SPARK +
                '<span class="who">You</span>' +
                '<span class="spacer"></span>' +
                '<button class="copy" data-i="' + idx + '">' + COPY + ' Copy</button>' +
              '</div>' +
              '<div class="cb-body">' + thumb + '<div class="cb-text">' + body + '</div></div>' +
            '</div>'
          : '') +
        (prompt.resultMd
          ? '<div class="claude-reply"><div class="cr-head">' + SPARK + '<span class="who">Claude</span><span class="cr-tag">example result</span></div>' +
            '<div class="cr-body">' + renderMarkdown(prompt.resultMd, basePath) + '</div></div>'
          : '') +
        (htmlUrl
          ? '<div class="prompt-result"><div class="pr-label">Result</div>' +
            '<button class="result-embed" data-html="' + esc(htmlUrl) + '" data-label="' + esc(htmlLabel) + '" title="Click to open">' +
              '<span class="re-frame-wrap"><iframe class="re-frame" src="' + esc(htmlUrl) + '" sandbox="allow-same-origin" scrolling="no" tabindex="-1" aria-hidden="true"></iframe></span>' +
              '<span class="re-overlay"><span class="re-label">🗺 ' + esc(htmlLabel) + '</span><span class="re-open">Open ↗</span></span>' +
            '</button></div>'
          : '') +
        (extUrl
          ? '<div class="prompt-result"><div class="pr-label">Result</div>' +
            '<a class="result-link" href="' + esc(extUrl) + '" target="_blank" rel="noopener">' +
              '<span class="rl-label">' + esc(htmlLabel) + '</span>' +
              '<span class="rl-go">Open ↗</span>' +
            '</a></div>'
          : '') +
        (prompt.resultMedia && prompt.resultMedia.length
          ? '<div class="prompt-result"><div class="pr-label">Result</div>' +
            prompt.resultMedia.map(function (m) {
              var src = /^(https?:|data:|\/)/.test(m.src) ? m.src : basePath + '/' + m.src;
              var inner = m.type === 'video'
                ? '<video class="pr-video" controls preload="metadata" src="' + esc(src) + '"></video>'
                : '<img class="cr-img" src="' + esc(src) + '" data-full="' + esc(src) + '" alt="' + esc(m.alt) + '" />';
              return '<figure class="pr-shot">' + inner + (m.alt ? '<figcaption>' + esc(m.alt) + '</figcaption>' : '') + '</figure>';
            }).join('') +
            '</div>'
          : '') +
      '</div>';
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

  // ===== Component: FileModal =============================================
  // Previews a linked file in a modal. Markdown (.md) is rendered; anything
  // else is shown as raw text.
  var FileModal = (function () {
    var root, titleEl, bodyEl, ghEl;
    function open(url, label, gh) {
      titleEl.textContent = label || 'File';
      if (gh) { ghEl.href = gh; ghEl.style.display = ''; } else { ghEl.style.display = 'none'; }
      bodyEl.innerHTML = '<p class="loading">Loading…</p>';
      root.classList.add('show'); root.setAttribute('aria-hidden', 'false');
      fetchText(url).then(function (t) {
        if (!t) { bodyEl.innerHTML = '<p class="loading">Could not load this file.</p>'; return; }
        if (/\.(md|markdown)$/i.test(url)) bodyEl.innerHTML = '<div class="cr-body fm-md">' + renderMarkdown(t, url.replace(/\/[^/]*$/, '')) + '</div>';
        else bodyEl.innerHTML = '<pre class="fm-raw"><code>' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
        bodyEl.scrollTop = 0;
      });
    }
    function close() { root.classList.remove('show'); root.setAttribute('aria-hidden', 'true'); }
    function mount() {
      if (root) return;
      root = el(
        '<div class="file-modal" aria-hidden="true">' +
          '<div class="fm-panel">' +
            '<div class="fm-head"><span class="fm-title"></span><a class="fm-gh" target="_blank" rel="noopener">GitHub ↗</a><button class="fm-close" aria-label="Close">✕</button></div>' +
            '<div class="fm-body"></div>' +
          '</div>' +
        '</div>'
      );
      document.body.appendChild(root);
      titleEl = root.querySelector('.fm-title');
      bodyEl = root.querySelector('.fm-body');
      ghEl = root.querySelector('.fm-gh');
      root.querySelector('.fm-close').addEventListener('click', close);
      root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('show')) close(); });
    }
    return { mount: mount, open: open };
  })();

  // ===== Component: HtmlModal =============================================
  // Renders a generated HTML page (e.g. a data-flow diagram) in a sandboxed
  // iframe inside a lightbox. Mount once, then HtmlModal.open(url, label).
  var HtmlModal = (function () {
    var root, titleEl, frameEl, openEl;
    function open(url, label) {
      titleEl.textContent = label || 'Preview';
      openEl.href = url;
      frameEl.src = url;
      root.classList.add('show'); root.setAttribute('aria-hidden', 'false');
    }
    function close() { root.classList.remove('show'); root.setAttribute('aria-hidden', 'true'); frameEl.src = 'about:blank'; }
    function mount() {
      if (root) return;
      root = el(
        '<div class="html-modal" aria-hidden="true">' +
          '<div class="hm-panel">' +
            '<div class="hm-head"><span class="hm-title"></span><a class="hm-open" target="_blank" rel="noopener">Open in new tab ↗</a><button class="hm-close" aria-label="Close">✕</button></div>' +
            '<div class="hm-body"><iframe class="hm-frame" sandbox="allow-same-origin" title="Preview"></iframe></div>' +
          '</div>' +
        '</div>'
      );
      document.body.appendChild(root);
      titleEl = root.querySelector('.hm-title');
      frameEl = root.querySelector('.hm-frame');
      openEl = root.querySelector('.hm-open');
      root.querySelector('.hm-close').addEventListener('click', close);
      root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('show')) close(); });
    }
    return { mount: mount, open: open };
  })();

  // ---- render a demo (copy comes from its prefetched markdown) -----------
  function renderDemo(entry) {
    var d = entry.demo, section = entry.section, group = entry.group;
    var c = contentById[d.id] || {};
    var title = c.title || d.id;
    document.getElementById('tabName').textContent = title;
    var crumb = [section.title].concat(group.title ? [group.title] : []).concat([title]);
    document.getElementById('breadcrumbs').innerHTML = crumb
      .map(function (x) { return '<span>' + esc(x) + '</span>'; })
      .join('<span class="sep">›</span>');

    var h = '';
    h += '<div class="eyebrow">' + esc(section.title) + (group.title ? ' · ' + esc(group.title) : '') + '</div>';

    if (d.page) {
      // A page renders its whole README.md as markdown, no anchor parsing.
      h += '<div class="page-body cr-body">' + renderMarkdown(c.md || '', d.path, 0) + '</div>';
    } else {
      h += '<h1 class="demo-title">' + esc(title) + '</h1>';
      if (c.why) h += '<p class="why-lead">' + esc(c.why) + '</p>';

      // Skills & files render above the prompt so they read as relevant context for it.
      var chips = (c.skills || []).map(function (s) { return '<span class="chip skill">✳ ' + esc(s) + '</span>'; });
      (c.links || []).forEach(function (l) { chips.push(fileChip(d.path, l.label, l.href)); });
      if (chips.length) h += '<div class="section-h">Skills &amp; files</div><div class="chips">' + chips.join('') + '</div>';

      h += (c.prompts || []).map(function (p, i) { return PromptBox(p, i, d.path); }).join('');

      if (c.lookFor && c.lookFor.length) {
        h += '<div class="section-h">What to look for</div>';
        h += '<ul class="lookfor">' + c.lookFor.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
      }
    }

    h += '<div class="folder-link">' + (d.page ? 'Page folder: ' : 'Demo folder: ') + '<a target="_blank" rel="noopener" href="' + esc(treeUrl(d.path)) + '"><code>' + esc(d.path) + '</code></a> · <a target="_blank" rel="noopener" href="' + esc(blobUrl(d.path, 'README.md')) + '">README.md</a></div>';

    var content = document.getElementById('content');
    content.innerHTML = h;
    content.scrollTop = 0;

    Array.prototype.forEach.call(content.querySelectorAll('.copy'), function (btn) {
      btn.addEventListener('click', function () { copyText((c.prompts || [])[+btn.getAttribute('data-i')].text, btn); });
    });
    Array.prototype.forEach.call(content.querySelectorAll('.prompt-thumb'), function (btn) {
      btn.addEventListener('click', function () { ImageModal.open(btn.getAttribute('data-src'), btn.getAttribute('data-alt')); });
    });
    Array.prototype.forEach.call(content.querySelectorAll('.chip.file'), function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let modified-click open GitHub
        e.preventDefault();
        FileModal.open(a.getAttribute('data-file'), a.getAttribute('data-label'), a.getAttribute('href'));
      });
    });
    Array.prototype.forEach.call(content.querySelectorAll('.result-embed'), function (btn) {
      btn.addEventListener('click', function () { HtmlModal.open(btn.getAttribute('data-html'), btn.getAttribute('data-label')); });
    });
    wirePageContent(content);
  }

  // ---- render overview ----------------------------------------------------
  // A pinned top page (outline / overview): its whole README.md renders as markdown.
  function renderStandalonePage(tp) {
    currentDemoId = null;
    document.getElementById('tabName').textContent = tp.nav;
    document.getElementById('breadcrumbs').innerHTML = '<span>' + esc(P.title) + '</span>';

    var c = pageContent[tp.id] || {};
    var content = document.getElementById('content');
    content.innerHTML = '<div class="page-body cr-body">' + renderMarkdown(c.md || '', tp.path, 0) + '</div>';
    content.scrollTop = 0;
    wirePageContent(content);
  }

  // Interactions for markdown-rendered content (pages and the overview).
  function wirePageContent(content) {
    Array.prototype.forEach.call(content.querySelectorAll('.cr-img'), function (img) {
      img.addEventListener('click', function () { ImageModal.open(img.getAttribute('data-full') || img.getAttribute('src'), img.getAttribute('alt') || ''); });
    });
    Array.prototype.forEach.call(content.querySelectorAll('.ov-sec'), function (sec) {
      sec.addEventListener('click', function () { location.hash = '#' + sec.getAttribute('data-goto'); });
    });
  }

  // ---- routing ------------------------------------------------------------
  function route() {
    var id = (location.hash || '').replace(/^#\/?/, '') || DEFAULT_ID;
    var top = topPageById(id);
    var entry = top ? null : findEntry(id);
    var activeId = (top || entry) ? id : DEFAULT_ID;
    renderTree(activeId);
    if (top) renderStandalonePage(top);
    else if (entry) renderDemo(entry);
    else if (topPageById(DEFAULT_ID)) renderStandalonePage(topPageById(DEFAULT_ID));
    else renderStandalonePage(TOP_PAGES[0]);
  }

  function closeNav() { document.body.classList.remove('nav-open'); }

  // ---- boot ---------------------------------------------------------------
  function boot() {
    document.getElementById('repoLink').href = REPO;
    document.getElementById('hamburger').addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    ImageModal.mount();
    FileModal.mount();
    HtmlModal.mount();
    window.addEventListener('hashchange', route);
    document.getElementById('tree').innerHTML = '<div class="loading" style="padding:12px 16px">Loading…</div>';
    document.getElementById('content').innerHTML = '<p class="loading">Loading demos…</p>';
    prefetchAll().then(route);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
