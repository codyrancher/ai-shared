Here's what `setColsOptions` does:

**Purpose:** It builds the list of column options used by the advanced filtering feature in `SortableTable`. It computes which columns are available for filtering and visibility toggling.

**How it works (3 steps):**

1. **Collects table header columns** (lines 128-170) - Iterates over `this.headers`, building an object per column with its `name`, localized `label`, a JSON-encoded `value` (combining sort paths and value accessors for filter matching), an `isFilter` flag (whether the column is searchable), and `isColVisible` (preserving current visibility state if the column already existed in `columnOptions`).
2. **Collects Kubernetes label columns** (lines 173-204) - Scans all rows for `metadata.labels`, creating additional column entries for each unique label key. These are hidden by default (`isColVisible: false`) and marked with `isLabel: true`.
3. **Prepends an "All Columns" option** (lines 209-217) - Adds a synthetic entry at the front of the list that lets the user filter across all columns at once.

**How it's used:**

It's called indirectly via `updateColsOptions()` at [advanced-filtering.js:259](#codebase-query-report), which assigns the return value to `this.columnOptions`. That method is triggered by the `@update-cols-options` event emitted from the `THead` component in [index.vue:1358](#codebase-query-report). The resulting `columnOptions` array is passed back down as the `:table-cols-options` prop to `THead` at [line 1343](#codebase-query-report), driving both the column visibility toggles and the advanced filter dropdown.
