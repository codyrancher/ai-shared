The Resources card is now well-populated. Here's a summary of everything created in the `default` namespace for the `demo-resources` deployment:

**Resources card shows 3 rows:**

| Row | Dot | Summary |
| --- | --- | --- |
| Services | Green | 3 active (demo-app-http, demo-app-grpc, demo-app-metrics) |
| Ingresses | Green | 2 active (demo-app-ingress, demo-app-grpc-ingress) |
| Refers to | Yellow | 2 missing + 9 active (exercises truncation) |

**Related Resources tab (11 total):**

- 3 ConfigMaps (active): demo-app-config, demo-feature-flags, demo-nginx-conf
- 1 ConfigMap (missing): demo-missing-config - intentionally non-existent
- 3 Secrets (active): demo-db-credentials, demo-api-keys, demo-tls-cert
- 1 Secret (missing): demo-missing-secret - intentionally non-existent
- 1 ServiceAccount (active): demo-app-sa
- 2 ReplicaSets (active): from the deployment rollout

**Other cards:**

- Pods: 2 Running (100%) with 2 containers each (app + sidecar)
- Insights: Conditions (1 available + 1 progressing), Events (5 normal)

**Also created (still in the cluster):**

- PVC demo-data-claim (bound) and demo-cache-claim (pending, unused)
- PV demo-pv-data
- HPA demo-resources-hpa and PDB demo-resources-pdb (these exist but Steve doesn't create bidirectional relationships, so "Referred To By" stays empty)
