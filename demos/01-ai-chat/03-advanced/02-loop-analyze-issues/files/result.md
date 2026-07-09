# Rancher/Dashboard open-issue backlog: hotspots & duplication

*Based on the 200 most recent open issues (`gh issue list -R rancher/dashboard -L 200`). Areas inferred from `area/*` labels plus title keywords; an issue can touch more than one area.*

## Top hotspots

| Area | Open issues |
| --- | --- |
| Cluster provisioning / CAPI (RKE2, imported, day-2 ops) | 37 |
| Extensions (shell, prod-reg, resources API) | 31 |
| Auth / RBAC (auth providers, roles, kubeconfig) | 21 |
| Agentic / AI workflows (bot-filed) | 14 |
| Tables / lists / pagination | 13 |
| Forms / validation | 9 |
| Design-system components | 9 |
| Charts / Apps (Helm) | 8 |
| Fleet | 6 |
| Dependencies | 6 |

## Largest near-duplicate clusters

- **Extensions "Tech Debt" cleanup** (largest single theme, 14 issues, mostly split off one epic): #18313, #18312, #18311, #18310, #18308, #18307, #18306, #18305, #18139, #18032, #18010, #17940, #17321, #17237
- **Auto-filed `[aw]` agentic-workflow failure reports** (bot noise, two are literally identical "No-Op Runs"): #18280, #18276, #18275, #18274, #17988, #17830, #17128
- **"Support disabling of local auth provider"** (1 epic + 3 base/backport duplicate pairs): #17637 (epic), #18144 + #18285, #18134 + #18135, #18129 + #18130
- **Imported-cluster "day-2 ops" support** (#18250 and #17263 are the same etcd-snapshot ask; #18251 is its backport): #18250, #18251, #17263, #17265, #17266
- **"Update community EOL notification"** (base + one backport per release line): #18318, #18320, #18321, #18322
- **Edit YAML for v2prov CAPI clusters** (form vs native, enable vs disable): #18014, #17680, #17679

*Bonus clean base+backport triple worth deduping: "Ingress Controller Dual-Mode fails" #18248, #18260, #18289.*
