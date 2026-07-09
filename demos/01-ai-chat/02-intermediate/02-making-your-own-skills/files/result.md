---
name: summarize-issue
description: Turn a GitHub issue thread into a tight, reproducible brief plus a proposed fix - one-line problem statement, numbered repro steps from a known starting state, expected vs actual, environment, a root-cause hypothesis pinned to a file, and a fix sketch. Use at the start of issue work (before reproducing, recording, or coding), or whenever a thread is long, noisy, or has been re-scoped in the comments and you need a clean starting point.
---

The goal is a distilled brief someone else could act on without re-reading the thread: what is broken, exactly how to see it from a clean state, and the smallest change that fixes it. Favor precision over completeness - cut everything that does not help reproduce or fix the bug.

## Workflow

1. **Pull the full thread.** The issue number is encoded in this project's instance/branch name (`issue-NNNNN`). Fetch the body and every comment, not just the opening post:

   ```bash
   gh issue view <N> --repo rancher/dashboard --comments
   ```

2. **Read comments as corrections, not decoration.** On a long issue the opening post is often stale - repro steps get refined, the real trigger narrows, a maintainer reassigns the root cause, or a workaround reveals what is actually happening. When the thread and the opening post disagree, the latest confirmed comment wins. Note who confirmed it (reporter vs maintainer).

3. **Separate signal from noise.** Keep: the actual defect, current vs expected behavior, affected versions/environment, and any repro steps already provided. Drop: "+1 / me too", tangents, abandoned theories, and unrelated feature requests that piled onto the thread.

4. **Write the reproduction as numbered steps from a known starting state.** Someone should be able to follow it against a fresh Rancher. If the bug needs pre-existing resources (a downstream cluster, a project, a specific role), list what to create first as step 0 - do not assume the reader inherited the reporter's setup. State expected result and actual result explicitly and separately; "it's broken" is not a repro.

5. **Pin the environment and scope,** but only the parts that change the outcome: Rancher/dashboard version, browser, cluster type (local vs downstream, RKE2/k3s), user role. If the bug is version-specific or only reproduces on downstream clusters, say so up front - it saves the next person a wasted setup.

6. **Locate it in the code.** Grep for the visible strings, component name, route, or API type named in the issue and cite the likely `file:line`. This is a hypothesis to verify, not a verdict - label it as such.

7. **Propose a fix.** The smallest change that addresses the root cause (not just the symptom), where it goes, and any edge cases or side effects to check. If the thread is actually two bugs, a duplicate of another issue, already fixed on master, or not reproducible from the given information, say that plainly instead of forcing a fix.

## Output format

Keep it scannable. If a section is genuinely N/A (no special setup, environment-agnostic), write "none" rather than padding it.

```
Problem: <one line>

Repro:
  0. (setup, if any) ...
  1. ...
  2. ...

Expected: <...>
Actual:   <...>

Environment: <version / browser / cluster / role - only what matters>

Root cause (hypothesis): <file:line + one-line why>

Proposed fix: <smallest change + where + risks>
```

## What not to do

- **Do not trust the title or opening post alone.** The fix you would write from the title is often for the bug that got corrected three comments down.
- **Do not copy the reporter's steps verbatim if they start mid-flow.** Rewrite them to begin from a state anyone can reach.
- **Do not merge expected and actual into one sentence.** Whoever fixes it needs both, stated separately, to know when the bug is gone.
- **Do not overclaim the root cause.** A cited `file:line` with "likely" is useful; a confident wrong diagnosis sends the next person down a rabbit hole.
- **Do not pad the environment section.** List only the fields that change the outcome.
- **Do not silently drop a detail you could not reproduce.** If you cannot reproduce it, say so and list exactly what is missing.

Once the brief is written and the repro confirmed, hand off to the `record-browser-video` skill for the before video and the Fix Issue workflow for the change itself.
