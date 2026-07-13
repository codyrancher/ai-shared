# UI Locale Translation (multi-agent)

> **Agentic > Multi-agent orchestration** demo in [AI Shared](../../../../README.md).

**Why:** Translate and maintain a locale file too big for any single pass by splitting it across a translator agent and a checker agent — they build the whole file section by section, so size stops being the blocker.

## Translate-then-verify, part by part

**Why:** The file is larger than one context can reliably handle. Chunking it and adding a second agent to check each chunk is what keeps a huge translation both *complete* and *consistent*.

```
Orchestrate localization of the UI locale file as a two-agent loop over chunks:

translator → take the next batch of untranslated/changed keys and translate them,
             following the existing tone, placeholders ({var}), and terminology
             already used in the file.
checker    → review that batch: correct meaning, placeholders intact, consistent
             terminology, valid structure. Approve → merge the batch. Reject →
             send it back with specifics.

Iterate batch by batch until the whole file is covered. Keep a running glossary so
terminology stays consistent across chunks.
```

## What to look for

- Volume is the whole challenge. The file is big enough that a single pass degrades or drops keys. Chunking sidesteps the context limit; the file is assembled from many small, reliable pieces.
- A second agent buys consistency. The checker catches broken placeholders, drifting terminology, and structural mistakes before a batch lands — the failure modes that make machine translation feel sloppy.
- A shared glossary keeps terms stable across hundreds of independently-translated chunks.
- Estimated time saved: full-file localization is otherwise days of engineer wrangling or paid vendor turnaround per language; here it's an unattended batched run with spot-review. Ran as a GitHub Actions multi-agent orchestration. Full breakdown in the impact.md file above.

## Skills & files

- [`impact.md`](files/impact.md)

## Notes

- This is the "big file" pattern generalized: when the artifact exceeds what one agent can hold, a producer/checker pair working in chunks beats one agent attempting the whole thing.
- Placeholder and terminology integrity are the things reviewers usually have to babysit in bulk translation; making them the checker's explicit job is what makes the output shippable.
- Same GitHub Actions orchestration backbone as the E2E automation demo — reused for a completely different volume problem.
