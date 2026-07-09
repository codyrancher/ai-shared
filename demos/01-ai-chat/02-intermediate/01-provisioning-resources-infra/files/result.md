## Setup Complete

**Keycloak OIDC Provider** is running in the `keycloak` namespace on the Rancher k3s cluster, exposed at `http://ai-presentation-rancher:30443`.

The `rancher` realm is configured with a `rancher` OIDC client and wired into Rancher as the Keycloak OIDC auth provider.

**Keycloak Admin Console:** `http://ai-presentation-rancher:30443` (user: `kcadmin` / pass: `kcadmin123`)

### OIDC Users

| Username | Password | Email | First Name | Last Name | Group |
| --- | --- | --- | --- | --- | --- |
| alice | P@ssw0rd!Alice | alice@example.com | Alice | Johnson | devops |
| bob | P@ssw0rd!Bob | bob@example.com | Bob | Smith | developers |
| carol | P@ssw0rd!Carol | carol@example.com | Carol | Williams | devops |
| dave | P@ssw0rd!Dave | dave@example.com | Dave | Brown | viewers |
| eve | P@ssw0rd!Eve | eve@example.com | Eve | Davis | developers |

Users can log in by clicking "Log in with OIDC" on the Rancher login page, which redirects to Keycloak for authentication. The `accessMode` is set to `unrestricted`, so any Keycloak user can log in. Group claims (`groups`) are also passed through for `RBAC` if needed.
