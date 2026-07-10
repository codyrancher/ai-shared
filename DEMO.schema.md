# Demo schema

A demo is a **folder path** listed in `assets/presentation.manifest.js` plus one
`README.md` in that folder that `app.js` fetches and parses. The manifest holds
structure only; all copy (and the prompts) lives in the README.

## Directory layout

```
demos/<NN-section>/<NN-group>/<NN-slug>/
├── README.md      # everything: title, why, prompts, look-for, skills & files, result
├── media/         # screenshots / videos referenced by ## Result and prompt screenshots
└── files/         # optional support artifacts (linked as chips)
```

## Manifest (`assets/presentation.manifest.js`)

`window.PRESENTATION.sections[].groups[].demos[]`, where each **demo is just its folder
path**:

```js
{ id: "basics", title: "Basics", blurb: "...", demos: [
  "demos/01-ai-chat/01-basics/01-screenshot-prompting",
  "demos/01-ai-chat/01-basics/02-codebase-query-report"
] }
```

Per-demo values are **derived from the path**:

- **id** = last segment without the `NN-` prefix (`01-screenshot-prompting` ->
  `screenshot-prompting`). URL hash (`#id`) and nav key; must be unique.
- **n** = the `NN-` prefix number (sidebar order).

Sections/groups are `{ id, title, blurb, groups | demos }`. A group with `title: null`
renders its demos directly under the section.

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
