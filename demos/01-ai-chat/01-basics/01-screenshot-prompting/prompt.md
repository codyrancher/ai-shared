# Prompting with screenshots

Paste into Claude Code in the harness project.

## Quick text sharing

**Why:** Saves the tedium of selecting, copying, and reformatting a stack trace or log. The picture carries the text for you.

```
This is the failure from our CI run. Read the error and the stack frames in the screenshot, locate the responsible code in this repo, and explain the root cause. Link the files and lines you reference.
```

![A screenshot pasted straight into the prompt (click to pan / zoom)](media/example-screenshot.png)

## Spatial awareness

**Why:** Faster than writing paragraphs about a layout bug. You point at the region and the agent sees where things sit.

```
The control I circled in red overlaps the search box on narrow viewports. Using the layout you can see in the screenshot, find the Vue component that renders this area and propose a CSS fix that keeps them from colliding below 768px.
```

![A UI screenshot you annotate and paste (click to pan / zoom)](media/example-ui.png)

## Notes

- Paste images directly into Claude Code (drag/drop or clipboard). No need to transcribe text out of them first.
- Annotate before pasting (a red circle, an arrow) when the screen has more than one candidate target.
- Screenshots beat pasted text when layout matters: alignment, overlap, spacing, "which of these three".
