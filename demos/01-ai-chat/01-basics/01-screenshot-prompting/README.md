# 1. Prompting with screenshots

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Use screenshots to share text without copy/paste and to give the agent spatial context.

## The idea

A screenshot does two jobs at once. It carries text (a stack trace, a log line, a config) so you skip the copy/paste dance, and it carries layout, which lets you point at a region of the UI and have the agent reason about where things sit relative to each other. The model reads both the words and the picture.

## Prompt

**Quick text sharing**

```
[paste a screenshot of the failing CI job / terminal]

This is the failure from our CI run. Read the error and the stack frames in the
screenshot, locate the responsible code in this repo, and explain the root cause.
Link the files and lines you reference.
```

**Spatial awareness**

```
[paste a screenshot of the dashboard with the control circled in red]

The control I circled in red overlaps the search box on narrow viewports. Using
the layout you can see in the screenshot, find the Vue component that renders this
area and propose a CSS fix that keeps them from colliding below 768px.
```

Full prompt text: [`prompt.md`](./prompt.md)

## What to look for

- The agent transcribes and acts on text straight from the image, no paste needed.
- It uses position ("overlaps", "to the right of", "below the fold") to find the right component.
- Annotating the screenshot (a red circle) is enough to disambiguate the target.

## Result

_Media pending. Capture a short screen recording with the `my-browser-record-video` skill and drop it at [`media/screenshot-prompting.webm`](./media/)._

## Skills & files

- Capture: `my-browser-record-video`
