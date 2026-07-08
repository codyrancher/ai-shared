# Prompt - Provisioning an OIDC provider outside the cluster

Paste into Claude Code in the harness project.

```
Stand up a Dex OIDC provider in a local container with an issuer reachable from the
Rancher server. Create a static client for Rancher, then configure this Rancher
instance to use that provider for auth, end to end. Walk me through each step, run
the commands, and finish by logging in through the new provider to prove it works.
```

## Notes

- Dex is the lightest OIDC provider to script; Keycloak also works if you want a fuller UI.
- The reachability of the issuer URL from the Rancher server is the step most manual attempts get wrong. Call it out explicitly so the agent verifies it.
- "Finish by logging in to prove it works" turns this from a config change into a verified, demoable outcome.
- See [`files/oidc-notes.md`](./files/oidc-notes.md) for the pieces involved and the usual snags.
