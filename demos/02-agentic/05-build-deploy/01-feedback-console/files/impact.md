# Screenshot Feedback Agent — impact

*Rough estimates to frame the value, not audited metrics.*

## The problem we're solving

UI feedback is vague and slow to act on. "Move the create button", "remove that
link" — someone has to interpret what element is meant, find it in the code, make a
branch, implement it, and deploy something before anyone can even *see* whether it's
right. That round-trip runs through an engineer for every small ask, so most small
asks never happen.

## The approach

An in-product panel captures an **annotated screenshot + a sentence + a target
branch** and writes it as a `feedback.rancher.io` resource. An **autonomous watcher
agent** picks it up, locates the element from the screenshot and route context, makes
the change on the branch, deploys a **preview environment**, and marks the resource
Done with the URL (or Failed with a reason). A console shows every feedback's status,
commit, preview link, and the live agent activity.

## Estimated time saved

| | Manual | Feedback agent |
| --- | --- | --- |
| "I want X changed" → something you can look at | engineer interprets, branches, implements, deploys | requester self-serves the first pass |
| Who can request a visible change | effectively engineers | anyone, by pointing at the UI |
| Feedback that ever gets tried | the ones worth an engineer's time | small asks too, because they're cheap |
| Reviewing the result | read a diff / imagine it | click a running preview |

**Headline:** the loop from "describe a UI change" to "see it deployed" collapses
from an engineer round-trip to a self-service action, and small changes that used to
die in the backlog become one-click previews.

## Why AI (and why CRD-native)

- **AI** turns a pointed screenshot + a sentence into a located edit — interpreting
  intent and spatial reference is exactly what it's good at, and refusing to guess
  when the target isn't verifiable is what keeps it trustworthy.
- **Modeling feedback as a Kubernetes resource** (status Pending → Processing →
  Done/Failed) makes the whole pipeline observable, retryable, and recoverable with
  ordinary tooling — the console and the agent are just actors over those resources.
