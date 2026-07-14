# UI Locale Translation (multi-agent) — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

The UI locale file is large — large enough that a single agent (or a single human
sitting) can't reliably translate or update it in one go without dropping keys,
breaking `{placeholders}`, or letting terminology drift. Bulk machine translation
alone tends to be inconsistent; human/vendor translation is slow and costs money.

## The approach

A **two-agent loop over chunks**: a translator does the next batch following existing
tone and a shared glossary; a checker reviews each batch for meaning, intact
placeholders, consistent terminology, and structure, then approves or rejects with
specifics. The full file is assembled from many small, verified pieces.

## Estimated time saved

| | Manual / vendor | Multi-agent |
| --- | --- | --- |
| Full-file localization, per language | days of engineer wrangling or paid vendor turnaround | unattended batched run + spot review |
| Consistency across the file | manual QA pass | checker enforces it per batch |
| Handling a file bigger than one context | not feasible in one pass | chunking makes it routine |

**Headline:** a large-file translation that doesn't fit in one pass becomes an
unattended, self-checking batched run — turning days of wrangling (or vendor cost
and lead time) into review-only effort.

## Why multi-agent (not one big agent)

- **Chunking** defeats the context-size limit that makes the big file unmanageable.
- **A dedicated checker** enforces placeholder/terminology/structure integrity — the
  exact things that make bulk translation look careless.
- **A shared glossary** keeps terms consistent across independently-processed chunks.
