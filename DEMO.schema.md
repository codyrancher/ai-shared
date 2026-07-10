# Demo schema

An entry is a **folder path** listed in `assets/presentation.manifest.js` plus one
`README.md` in that folder that `app.js` fetches. The manifest holds structure only;
all copy lives in the README.

There are two kinds of entry, told apart by the **path prefix**:

| Path | Kind | How the README renders |
| --- | --- | --- |
| `demos/...` | **demo** | Parsed for anchors (`**Why:**`, prompt code blocks, `**Files:**`, `**Result:**`) and rendered as prompt boxes. |
| anything else (`pages/...`) | **page** | The **whole README.md is rendered as markdown**. No anchor parsing. |

## Directory layout

```
demos/<NN-section>/<NN-group>/<NN-slug>/
├── README.md      # title, why, prompts, skills & files, per-prompt results
├── media/         # screenshots / videos referenced by prompts
└── files/         # optional support artifacts (linked as chips)

pages/<NN-slug>/
├── README.md      # a plain markdown document, rendered top to bottom
├── media/         # images referenced normally with ![](media/x.png)
└── files/         # optional artifacts, linked normally with [x](files/x.md)
```

## Manifest (`assets/presentation.manifest.js`)

`window.PRESENTATION.sections[].groups[].demos[]`, where each entry is just its folder
path (a demo or a page):

```js
{ id: "basics", title: "Basics", blurb: "...", demos: [
  "demos/01-ai-chat/01-basics/01-screenshot-prompting",  // demo: anchors parsed
  "pages/01-stale-bot"                                   // page: whole md rendered
] }
```

`window.PRESENTATION.overview` is the page shown at the root route (`#overview`),
e.g. `"pages/overview"`. It renders exactly like any other page.

Per-entry values are **derived from the path**:

- **id** = last segment without the `NN-` prefix (`01-screenshot-prompting` ->
  `screenshot-prompting`). URL hash (`#id`) and nav key; must be unique.
- **n** = the `NN-` prefix number (sidebar order).

Sections/groups are `{ id, title, blurb, groups | demos }`. A group with `title: null`
renders its entries directly under the section.

## Pages

A page's README.md is rendered as ordinary markdown, so write it as a normal document:
`#` is the page title, headings/lists/tables/code fences all render, images open in the
zoom modal, and relative links (`files/x.md`, `media/y.png`) resolve against the page
folder. None of the demo anchors below apply.

### Page containers

For richer layout, a page can use `::: <name>` ... `:::` containers:

| Container | Renders |
| --- | --- |
| `::: hero` | The big page header. A lone `**bold**` line becomes the coral kicker, `# text` the large title, and the remaining line the muted tagline. |
| `::: sections` | The generated section cards, with live demo counts, clickable through to each section. Takes no content. |
| `::: <other>` | A `<div class="ov-<other>">` with its inner markdown rendered. `::: card` gives the bordered card. |

```markdown
::: hero
**Claude Opus 4.8**
# AI Presentation
Practical ways to fold AI into a Rancher / Dashboard workflow
:::

::: card
### Short discussion about the 1:1s

- Everyone is using AI.
:::

::: sections
:::
```

## `README.md` anchors

- `# <title>` (H1) -> nav label, tab, page heading.
- `**Why:** <text>` (the first one, before any `##`) -> demo benefit line under the title.
- **Every `## <heading>` that is not a reserved section (below) is a prompt:**
  - heading text -> prompt title
  - `**Why:** <text>` -> per-prompt line
  - first fenced code block -> the prompt text (copyable)
  - optional `![alt](media/x.png)` -> screenshot thumbnail (opens the modal)
  - optional `**Result:**` -> a result shown under the prompt. It may include:
    - `![caption](media/x.png)` / `![caption](media/x.mp4)` lines -> a plain "Result"
      block of screenshots (click to zoom) or a video player, and/or
    - `[label](files/result.md)` -> the markdown file rendered as a "Claude" reply bubble
      (for a captured text answer)
    - `[label](files/result.html)` -> a clickable preview of the generated HTML page that
      opens it, rendered, in a lightbox modal (for a generated diagram/report page)
    - media and a text reply can both be present; media renders first
  - optional `**Files:** [label](files/x.md) [label2](files/y)` -> file chips shown above
    the prompt; clicking one opens a preview modal (markdown for `.md`, raw text otherwise)
- **Reserved `##` sections** (parsed by name, never treated as prompts):
  - `## What to look for` -> `-` bullets become look-for items.
  - `## Skills & files` -> `-` bullets: `` `name` `` -> skill chip; `` [`label`](href) ``
    -> file chip (`href` relative to the demo folder) that opens the preview modal on
    click. Renders above the prompts. (Per-prompt `**Files:**` is usually cleaner.)
  - `## Notes` -> ignored by the site (human notes).

Recommended order: title + why, then Skills & files, then the prompt sections, then
Notes. On the site, Skills & files renders above the prompt so it reads as relevant
context for it.

## Add a demo

1. Create `demos/<section>/<group>/<NN-slug>/` with `README.md`, `media/`, optional `files/`.
2. Fill in the anchors above.
3. Add the folder path (a string) to the right group's `demos` array in `assets/presentation.manifest.js`.
4. Serve over http and refresh.
