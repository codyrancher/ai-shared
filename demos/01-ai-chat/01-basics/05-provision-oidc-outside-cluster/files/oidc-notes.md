# OIDC provisioning - moving parts and gotchas

The agent should treat this as one end-to-end flow, not three disconnected tasks.
These notes exist so the demo does not stall on the usual snags.

## The pieces

1. **OIDC provider** - Dex in a container (lightest to script). Alternatively
   Keycloak if you want a UI to click through during the demo.
2. **Static client** - a client id + secret + redirect URI registered in the
   provider for Rancher to use.
3. **Rancher auth config** - point Rancher's OIDC / Keycloak (OIDC) auth provider at
   the issuer URL, client id, and secret.
4. **Proof** - log out and log back in through the new provider.

## The gotcha that eats most attempts

**Issuer reachability.** The issuer URL Rancher is configured with must resolve and
be reachable *from the Rancher server*, not just from your laptop. `localhost` on
your machine is not `localhost` inside the Rancher container. Use a hostname/IP both
sides agree on, and have the agent verify reachability from the Rancher side before
saving the auth config.

## A good end state to demo

- Dex running, its issuer reachable from Rancher.
- Rancher auth provider enabled and saved without error.
- A fresh login redirects to Dex, authenticates, and lands back in Rancher as the
  mapped user.

## Why this belongs in the presentation

It is the clearest example of the agent building the infrastructure *around* a
feature, not just editing code. Same toolbelt idea as basics 6: give it the tools
(docker, kubectl, the Rancher API) and it can stand up the whole scenario.
