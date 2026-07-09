# Cluster Provisioning in Rancher Dashboard: Orientation

**Route and entry**
- The provisioning cluster type is the constant `CAPI.RANCHER_CLUSTER = 'provisioning.cattle.io.cluster'` (`shell/config/types.js:287`); everything below keys off this type string.
- The "Cluster Management" product registers it and points its nav/create target at the generic route `c-cluster-product-resource` in the `management` store (`shell/config/product/manager.js:39`, route object at `shell/config/product/manager.js:48`).
- Routes are generic/param-driven: list is `c-cluster-product-resource` (`shell/config/router/routes.js:516`) and Create is `c-cluster-product-resource-create` at path `/c/:cluster/:product/:resource/create` (`shell/config/router/routes.js:520`), rendering `shell/pages/c/_cluster/_product/_resource/create.vue`.
- That page is a thin wrapper that just mounts `<ResourceDetail>` (`shell/pages/c/_cluster/_product/_resource/create.vue:11`).
- `ResourceDetail` resolves the per-type form via the `type-map/importEdit` getter (`shell/components/ResourceDetail/index.vue:405`), which dynamically imports `@shell/edit/<type>` (`shell/store/type-map.js:1336` -> `shell/utils/dynamic-importer.js:60`).
- For this type that resolves to the entry component `CruCluster` at `shell/edit/provisioning.cattle.io.cluster/index.vue:39` (folder index), a subtype chooser rendering a `SelectIconGrid` of providers (`shell/edit/provisioning.cattle.io.cluster/index.vue:606`).
- Once a provider is picked, it delegates the real form to `<Rke2Config>` (`shell/edit/provisioning.cattle.io.cluster/rke2.vue`) or an extension-supplied component (`shell/edit/provisioning.cattle.io.cluster/index.vue:631`).

**Store modules**
- Three Steve (Vuex) stores are registered in `shell/store/index.js:52`: `management` (baseUrl `/v1`), `cluster` (per-cluster, dynamic baseUrl), and `rancher` (Norman, `/v3`); provisioning clusters live in the `management` store.
- Each store is built by the `SteveFactory`/config default export in `shell/plugins/steve/index.js:15` (factory) and `shell/plugins/steve/index.js:65` (module config).
- The model is `ProvCluster extends SteveModel` (`shell/models/provisioning.cattle.io.cluster.js:39`); it hydrates most display data by cross-referencing the paired `management.cattle.io.cluster` via `management/byId` in its `mgmt` getter (`shell/models/provisioning.cattle.io.cluster.js:371`).
- `SteveModel` (`shell/plugins/steve/steve-class.js:18`) adds Steve-specific save cleanup (`cleanForSave`, `shell/plugins/steve/steve-class.js:53`) and a strategic-merge PATCH `update()` (`shell/plugins/steve/steve-class.js:98`).

**Create / update API calls**
- The form's save entry is `saveOverride` (`shell/edit/provisioning.cattle.io.cluster/rke2.vue:1719`), which funnels into `actuallySave(url)` (`shell/edit/provisioning.cattle.io.cluster/rke2.vue:1819`).
- Create calls `this.value.save({ url })` against the collection link (`shell/edit/provisioning.cattle.io.cluster/rke2.vue:1826`); update calls `this.value.save()` (`shell/edit/provisioning.cattle.io.cluster/rke2.vue:1832`).
- `save()` resolves to the shared `_save` (`shell/plugins/dashboard-store/resource-class.js:1251`): it picks the collection URL for new resources vs `linkFor('update')`/`self` for existing (`shell/plugins/dashboard-store/resource-class.js:1268`) and sets method `post` (create) vs `put` (update) at `shell/plugins/dashboard-store/resource-class.js:1279`.
- `_save` then dispatches the store `request` action (`shell/plugins/dashboard-store/resource-class.js:1336`), whose Steve implementation issues the actual HTTP call via `this.$axios(opt)` in `makeRequest` (`shell/plugins/steve/actions.js:22`, axios call at `shell/plugins/steve/actions.js:146`).

**Read these 3 first**
1. `shell/edit/provisioning.cattle.io.cluster/rke2.vue` (the real provisioning form and its save path)
2. `shell/edit/provisioning.cattle.io.cluster/index.vue` (entry component / provider chooser)
3. `shell/config/product/manager.js` (route, product, and type wiring that gets you there)
