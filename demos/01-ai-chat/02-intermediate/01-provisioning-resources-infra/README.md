# Provisioning Resources & Infra

> **AI Chat > Intermediate** demo in [AI Shared](../../../../README.md).

**Why:** Stand up throwaway infra a feature needs without doing the fiddly, error-prone setup by hand.

## Provision in-cluster resources

**Why:** Describe 20 near-identical resources in one sentence instead of scripting a loop or running kubectl 20 times.

**Files:** [CLAUDE.md](files/CLAUDE.md)

```
Please create 20 config-maps in the rancher instance.
- They should be named `demo-config-${n}`
- They should have data `data-${n}`.
- Put them all in the `config-demo` namespace
```

**Result:**
![The 20 config-maps in the config-demo namespace](media/configmap-list.png)
![Detail of demo-config-19 and its data-19 key](media/configmap-detail.png)

## Quickly Exercise UI Areas

**Why:** Populate a screen with resources in every state you need to show, instead of hand-crafting each one to hit an edge case.

**Files:** [CLAUDE.md](files/CLAUDE.md)

```
Can you generate a number of resources with varying states so we can demonstrate and exercise the Resources card seen in the screenshot?
```

![The Resources card to populate and exercise](media/demo-resource-card.png)

**Result:**
[example result](files/resources-card.md)
![The Resources card populated with resources in varying states](media/demo-resource-result.png)

## Stand up and connect OIDC

**Why:** Saves an afternoon of container, client, and auth-config wiring, and it verifies the login for you at the end.

**Files:** [CLAUDE.md](files/CLAUDE.md)

```
Stand up a local OIDC providers using a docker container. Create several users and then wire to the Rancher Instance as an auth provider. After you're done provide each user name and pass in a table.
```

**Result:**
![OIDC provider set up and login working](media/demo-oidc.mp4)
[example result](files/result.md)

## Notes

- Dex is the lightest OIDC provider to script; Keycloak also works if you want a fuller UI.
- The reachability of the issuer URL from the Rancher server is the step most manual attempts get wrong. Call it out explicitly so the agent verifies it.
- "Finish by logging in to prove it works" turns this from a config change into a verified, demoable outcome.
