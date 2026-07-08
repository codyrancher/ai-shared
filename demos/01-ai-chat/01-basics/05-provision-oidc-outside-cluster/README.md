# Provisioning resources outside the cluster (OIDC)

> **AI Chat > Basics** demo in [AI Shared](../../../../README.md).

**Why:** Stand up throwaway infra a feature needs without doing the fiddly, error-prone setup by hand.

## What to look for

- It provisions the container, the client, and the Rancher auth config as one flow.
- It handles issuer reachability between the two (a common snag).
- It closes the loop by actually logging in through the new provider.

## Prompts

See [`prompt.md`](./prompt.md).

## Skills & files

- [`oidc-notes.md`](files/oidc-notes.md)

## Result

- _Pending:_ Dex up, Rancher wired, login through the new provider (capture with `my-browser-record-video`), save as `media/oidc.webm`
