For each issue in `/workspace/data/geezy.sqlite` (`issue_analyses`), perform two analyses:
1. find likely duplicate issues among the open set, and
2. identify which parts of the rancher/dashboard codebase the issue most likely relates to so we can track bug-density per code area.

- Store results back to the geezy DB so the dashboard can visualize them.
- Process 100 issues per batch
