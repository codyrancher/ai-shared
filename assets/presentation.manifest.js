/*
 * presentation.manifest.js - MANIFEST for the AI Presentation site.
 *
 * Structure only. Each entry is just the path to its folder; id and n are derived
 * from that path (id = last segment without the NN- prefix, n = the NN- prefix).
 *
 * Two kinds of entry, told apart by the path prefix:
 *   demos/...  -> a DEMO. Its README.md is parsed for anchors (**Why:**, prompt code
 *                 blocks, **Files:**, **Result:**) and rendered as prompt boxes.
 *   anything else (pages/...) -> a PAGE. Its whole README.md is rendered as markdown,
 *                 with no anchor parsing.
 *
 * `outline` and `overview` are the standalone pages pinned to the top of the nav,
 * in that order; `outline` is the root route. See DEMO.schema.md.
 */
window.PRESENTATION = {
  title: "AI Presentation",
  tagline: "Practical ways to fold AI into a Rancher / Dashboard workflow",
  repo: "https://github.com/codyrancher/ai-shared",
  model: "Claude Opus 4.8",
  outline: "pages/outline",
  overview: "pages/overview",
  levelSetting: "pages/level-setting",
  sections: [
    { id: "ai-chat", title: "AI Chat", blurb: "Interactive, conversational use of the agent. Demonstrated live in my Claude harness project.", groups: [
      { id: "basics", title: "Basics", blurb: "Basic in the sense that many people are already using variations of these, not that they are low value. Nice to run these inside a container or VM so you can let the agent work without constant supervision.", demos: [
        "demos/01-ai-chat/01-basics/01-codebase-query-report",
        "demos/01-ai-chat/01-basics/02-screenshot-prompting",
        "demos/01-ai-chat/01-basics/03-behavior-environment"
      ] },
      { id: "intermediate", title: "Intermediate", blurb: "Package repeated work into skills and drive the browser from the CLI.", demos: [
        "demos/01-ai-chat/02-intermediate/01-provisioning-resources-infra",
        "demos/01-ai-chat/02-intermediate/02-making-your-own-skills"
      ] },
      { id: "advanced", title: "Advanced", blurb: "Let the agent loop on itself, analyze the whole backlog, and run multi-stage pipelines from prompts alone.", demos: [
        "demos/01-ai-chat/03-advanced/01-browser-skills-live",
        "demos/01-ai-chat/03-advanced/02-agent-loop-resolve-issue"
      ] }
    ] },
    { id: "agentic", title: "Agentic", blurb: "Agents that run on their own: scheduled bots that groom, triage, and test the repo; unattended loops that grind a goal to done; multi-agent orchestrations that check their own work; and AI-built tooling that turns manual processes into buttons and reports.", groups: [
      { id: "scheduled-bots", title: "Scheduled repo bots", blurb: "Run on a schedule with no one watching — they read issues and PRs and post analysis, criteria, triage, or brand-new tests straight onto the tracker.", demos: [
        "pages/02-agentic/01-scheduled-bots/01-stale-bot",
        "demos/02-agentic/01-scheduled-bots/02-daily-issue-grooming",
        "demos/02-agentic/01-scheduled-bots/03-issue-triage",
        "demos/02-agentic/01-scheduled-bots/04-test-improver"
      ] },
      { id: "unattended-loops", title: "Unattended & looping agents", blurb: "One agent, one goal, running to completion — trigger, inspect, fix, repeat until it's genuinely done, guarded so it can't cheat the check.", demos: [
        "demos/02-agentic/02-unattended-loops/01-compatibility-extension-test",
        "demos/02-agentic/02-unattended-loops/02-eslint-migration",
        "demos/02-agentic/02-unattended-loops/03-fix-dependabot"
      ] },
      { id: "orchestration", title: "Multi-agent orchestration", blurb: "Specialized agents pipelined together, every doer paired with a verifier that grades and gates — so the run converges instead of looping on bad output.", demos: [
        "demos/02-agentic/03-orchestration/01-e2e-test-automation",
        "demos/02-agentic/03-orchestration/02-ui-locales",
        "pages/02-agentic/03-orchestration/03-bender"
      ] },
      { id: "ai-tooling", title: "AI-powered tooling", blurb: "AI that both builds and feeds the tool — consoles, dashboards, and reports where fetching, shaping, and rendering the data is a prompt, and extending it is a sentence.", demos: [
        "demos/02-agentic/04-ai-tooling/01-release-captaincy",
        "demos/02-agentic/04-ai-tooling/02-dependabot-alerts",
        "demos/02-agentic/04-ai-tooling/03-reports"
      ] },
      { id: "build-deploy", title: "Autonomous build & deploy", blurb: "Describe what you want; the agent creates the repo or branch, builds it, deploys it to a live cluster, verifies it, and registers it — the full lifecycle, unattended, one at a time, with status tracked on a Kubernetes resource.", demos: [
        "demos/02-agentic/05-build-deploy/01-feedback-console",
        "demos/02-agentic/05-build-deploy/02-extension-console",
        "demos/02-agentic/05-build-deploy/03-fix-vulnerability-console"
      ] }
    ] }
  ]
};
