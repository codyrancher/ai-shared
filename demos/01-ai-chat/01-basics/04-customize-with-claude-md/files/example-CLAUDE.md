# CLAUDE.md (example)

A CLAUDE.md is read at the start of every session. A handful of lines here changes
behavior for good, with no re-prompting. This example shows both flavors: shaping
how the agent works, and teaching it to act on the cluster from a keyword.

## Writing style

- Never use em dashes in any output (code, comments, commits, chat). Use a regular
  dash, parentheses, or split the sentence.

## Definition of done

- Always run `yarn lint` before telling me a change is done. If it fails, fix it
  before reporting back.
- Re-read your own diff against the request before you say it is finished.

## Cluster shortcuts

- When I say "seed demo", provision a demo workload in the local cluster:
  1. Create the namespace `demo-app` if it does not exist.
  2. Apply a sample `Deployment` (nginx, 2 replicas), a `Service` (ClusterIP), and a
     `ConfigMap` into it, using `kubectl` against the current kubeconfig.
  3. Print the resulting `kubectl get all -n demo-app` so I can see it landed.
- When I say "reset demo", delete the `demo-app` namespace.

## Notes

- Keep every rule imperative and checkable ("always X", "never Y", "when I say Z,
  do ..."). Vague rules do not change behavior.
- This is where a runbook goes to die: anything you would otherwise paste every
  session belongs here instead.
