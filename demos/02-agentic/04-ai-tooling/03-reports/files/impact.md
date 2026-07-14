# Interrupt-Duty Reports — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Whoever's on interrupt duty starts the day by manually scanning Jira and GitHub to
figure out what's new, what's waiting, and what's most urgent — then (maybe) writing
it up. It's repetitive, easy to do inconsistently, and a tax on the most senior time
that tends to rotate through the role.

## The approach

A **fixed prompt + fixed format** pipeline: gather from set sources, rank by set
rules, render a dated Markdown report, save it so history is browsable. One report
type per tab (daily, Jira development, Dependabot status/PRs), all the same skeleton
pointed at different data.

## Estimated time saved

| | Manual | Automated |
| --- | --- | --- |
| Daily triage scan + write-up | ~30–45 min every morning | read the generated report |
| Consistency day to day / person to person | varies | identical shape every time |
| Adding a new report type | build it by hand | describe "gather → rank → render", reuse the skeleton |

**Headline:** ~30–45 min of senior time every morning becomes zero, the report is
consistent regardless of who's on duty, and new report types cost a sentence.

## Why this shape

The data-gathering and rendering are the reusable parts; intent is the only variable.
Fixing the pipeline and expressing new reports in plain English means there's no
boundary on what you can produce and no per-report engineering.
