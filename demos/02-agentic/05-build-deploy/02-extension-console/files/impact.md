# Extension Console — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

Building a Rancher UI extension is real front-end work: scaffold a repo, write the
CRUD pages with proper validation, follow the current component patterns, build it,
deploy it to a cluster, register it, and check it actually works. Going from "I want
a cert-manager CRUD" to a working, registered extension is days — and it's specialized
enough that only a few people can do it.

## The approach

A console where the **description is the only spec**. An autonomous agent creates the
repo under your org, builds the extension from the description (Composition API +
`<script setup>` + TS, following newer patterns), deploys a developer-load to the test
cluster, registers it, **verifies it with Playwright** by driving the real UI, and
persists it — status tracked on a Kubernetes resource, one request at a time.

## Estimated time saved

| | Manual | Extension agent |
| --- | --- | --- |
| Scaffold + build a CRUD extension | days of front-end work | a description + repo name |
| Deploy + register on the cluster | manual steps each time | part of the pipeline |
| Confirm it works | click through by hand | Playwright drives the UI automatically |
| Who can do it | extension-experienced devs | anyone who can describe it |

**Headline:** the extension lifecycle collapses from days of specialized front-end
work to a plain-English description that returns a registered, browser-verified
extension running in Rancher.

## Why this is the strong showcase

- **Description-as-spec** pushes all the implementation decisions to the agent — you
  brief intent and constraints, it owns the build.
- **Playwright verification** is the trust anchor: end-to-end proof in the real UI,
  not just "it compiled."
- **CRD-native** status (Pending → Processing → Done/Failed) makes the whole autonomous
  pipeline observable, serial, and recoverable with ordinary cluster tooling.
- It handled **edge cases correctly** (read-only for controller-managed
  CertificateRequests/Orders/Challenges), which is where naive generation usually
  breaks.

## Metrics to capture later

- Build success rate and how often Playwright catches a broken extension pre-Done.
- Time from request → registered extension, vs a hand-built baseline.
