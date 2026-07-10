Here's a commit message for the staged changes, following the structure in CLAUDE.md:

```
Fix AlertmanagerConfig save error when root route has no receiver

Fixes #17347

- Rework applyDefaults() to seed spec.receivers and spec.route on
  resources that were loaded without a route, instead of bailing out
  early when spec already existed, so the Route tab always has an
  object to bind to.
- Switch the route defaults from the deprecated match/matchRe fields to
  matchers, matching the AlertmanagerConfig v1alpha1 schema used by
  monitoring stack 109+.
- Add cleanForSave() to drop spec.route on save when it has no
  receiver, since a root route with no receiver can't direct alerts and
  is rejected by the API. This is the change that fixes the save error.
- Add unit tests covering applyDefaults() seeding/backfilling and
  cleanForSave() dropping vs keeping the route.
```

Want me to commit this, or adjust the wording first?
