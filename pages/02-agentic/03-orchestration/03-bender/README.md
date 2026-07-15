# Bender Pipeline

A new tool to provide a better way to experiment and iterate on agentic workflows and pipelines. Retry on fresh context instead of babysitting one long run, and reuse what each run produces.

## Aspiration

- Resolve issues end to end without human intervention up until PR review, starting with a number of the simpler ones.
- Every issue Bender works leaves behind a prompt or skill the team can run by hand next time.

## Walkthrough

1. The motivation: solve issues e2e, and harvest reusable prompts/skills for the team.
2. Iterate and retry prompts on fresh context instead of fighting a poisoned one.
3. The interrogation tools on a pre-existing run (inspect inputs, outputs, and state per stage).
4. Start a run and open a live tool: the browser view or the streaming logs.
5. Restart a single stage without rerunning the whole pipeline.

## Demo

- Live instance to demo against: [https://100.90.154.26:4444/](https://100.90.154.26:4444/).
