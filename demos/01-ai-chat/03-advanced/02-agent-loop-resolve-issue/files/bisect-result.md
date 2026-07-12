Here's the bisection result:

**Introducing commit:** `731387c6d` - "Resize table action buttons" (Phillip Rak, June 19, 2026), part of PR #18108 (`task/table-actions-resize`).

**The change:** A single line was removed from [SortableTable/index.vue](#agent-loop-resolve-issue) - the `size="large"` prop was deleted from the bulk action `RcButton` components. This caused the buttons to fall back to the default `size="medium"`.

**Why it causes the misalignment:** The medium-size RcButton uses `font-size: 14px`, `min-height: 32px`, and `line-height: calc(10/7)` (~20px), while the large size used `font-size: 16px`, `min-height: 40px`, and `line-height: 1.5` (24px). The icon elements (`<i class="icon ...">`) slotted into the button are font-based icons whose rendered size is set by the global `.icon` class and doesn't scale with the button's size prop. At the large button size there was enough vertical space for the icons to appear centered alongside the text, but at medium the icon's intrinsic height differs from the text's line-height, causing the icon to sit visually offset from the text despite `align-items: center` on the flex container.

**Screenshots verified:**

- `c0271168b` (parent, with `size="large"`) - icons and text align properly
- `731387c6d` (this commit, without `size="large"`) - icons misaligned with text
- HEAD - same misalignment persists
