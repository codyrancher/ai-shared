The summary API isn't implemented in `rancher/rancher` directly - it lives in **rancher/steve** (the Kubernetes API translator that Rancher embeds). Here's the chain:

### Query parameter parsing

[`pkg/stores/sqlpartition/listprocessor/processor.go`](https://github.com/rancher/steve/blob/e612a6ac529b44a2d044cc78873f95e9f84f21df/pkg/stores/sqlpartition/listprocessor/processor.go) - Constants at lines 34-36 define `summary`, `summaryonly`, and `summarynamespaced` params. The `ParseQuery` function (line 93) extracts them from the request URL.

### Summary aggregation (core logic)

[`pkg/sqlcache/informer/summary_fields.go`](https://github.com/rancher/steve/blob/e612a6ac529b44a2d044cc78873f95e9f84f21df/pkg/sqlcache/informer/summary_fields.go) - This is where the actual work happens. `ListSummaryFields` iterates each requested field and runs SQL `GROUP BY` queries against Steve's SQLite cache to produce the counts.

### Entry point that ties it together

[`pkg/sqlcache/informer/listoption_indexer.go`](https://github.com/rancher/steve/blob/e612a6ac529b44a2d044cc78873f95e9f84f21df/pkg/sqlcache/informer/listoption_indexer.go) (line 812) - `ListByOptions` calls `ListSummaryFields` first when `SummaryFieldList` is non-empty, then runs the main list query with `LIMIT 0` when `summaryonly` is set (so no resource objects are returned, only counts).

### The `LIMIT 0` injection

[`pkg/sqlcache/informer/sqlgenerator.go`](https://github.com/rancher/steve/blob/e612a6ac529b44a2d044cc78873f95e9f84f21df/pkg/sqlcache/informer/sqlgenerator.go) (line 357) - When `SummaryOnly` is true, appends `LIMIT 0` to skip fetching actual resources.

### Response types

[`pkg/types/server_types.go`](https://github.com/rancher/apiserver/blob/39a6f25351466abd074fa37ca555ba097b3d5849/pkg/types/server_types.go) in **rancher/apiserver** defines `APISummary`, `SummaryEntry`, and `SummaryWithBreakdown` (the structs that map to the JSON the dashboard consumes as `res.summary`).

### How the flow works end-to-end

1. Dashboard sends `GET /v1/{type}?summary={field}&summaryonly`
2. Steve's `ParseQuery` extracts the summary params into `ListOptions`
3. `ListByOptions` calls `ListSummaryFields`, which runs `SELECT ... GROUP BY` on the SQLite cache
4. `summaryonly` triggers `LIMIT 0` so no resource bodies are fetched
5. The `APISummary` struct is serialized into the JSON collection response under the `summary` key
