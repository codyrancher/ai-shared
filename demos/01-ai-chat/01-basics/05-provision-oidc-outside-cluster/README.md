# 5. Provisioning resources outside the cluster (OIDC)

> **AI Chat › Basics** in the [AI Presentation](../../../../README.md)

**Goal:** Spin up an OIDC provider outside the cluster and wire Rancher auth to it, end to end.

## The idea

The agent is not limited to the repo or the cluster. Here it stands up a Dex OIDC provider in a container, registers a client, points Rancher auth at it, and proves the login works. This is the payoff of giving the agent real tools: it can build the surrounding infrastructure a feature needs, not just the code.

## Prompt

```
Stand up a Dex OIDC provider in a local container with an issuer reachable from the
Rancher server. Create a static client for Rancher, then configure this Rancher
instance to use that provider for auth, end to end. Walk me through each step, run
the commands, and finish by logging in through the new provider to prove it works.
```

Full prompt text: [`prompt.md`](./prompt.md) · Moving parts: [`files/oidc-notes.md`](./files/oidc-notes.md)

## What to look for

- It provisions the container, the client, and the Rancher auth config as one flow.
- It handles issuer reachability between the two (a common snag).
- It closes the loop by actually logging in through the new provider.

## Result

_Media pending. Record the provider coming up and the login succeeding with `my-browser-record-video`; save at [`media/oidc.webm`](./media/)._

## Skills & files

- Moving parts / gotchas: [`files/oidc-notes.md`](./files/oidc-notes.md)
- Capture: `my-browser-record-video`
