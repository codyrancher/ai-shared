# Security Alert Dashboards — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Security-alert data (Dependabot open/fixed/dismissed, severity, package) is there,
but nobody sees the *trend* — is the backlog growing, what's aging, where's the
risk concentrated? A normal answer means standing up a small frontend project to
fetch, shape, and render it, plus maintaining it forever.

## The approach

Let AI **build the dashboard and feed it**: pull the alert data, shape it, render a
self-contained page (alerts over time, severity breakdown, open backlog). Extend it
by asking in plain English and regenerate.

## Estimated time saved

| | Bespoke tool | AI-built |
| --- | --- | --- |
| Initial build (data plumbing + UI) | ~days | minutes to generate |
| Add a new metric / cut / overlay | a code change + deploy | a sentence, regenerate |
| Ongoing maintenance | a standing tax | re-prompt when needed |

**Headline:** the visibility you'd normally defer because a dashboard is "a project"
becomes a few minutes of prompting, and every change is a sentence instead of a
ticket.

## Why AI fits

The costly part of an internal dashboard is the plumbing and upkeep, not the chart.
AI owning fetch → shape → render (and re-render on request) removes exactly that
cost, which is also what makes it easy to maintain and recover.
