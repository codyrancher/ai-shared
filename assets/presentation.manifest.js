/*
 * presentation.manifest.js - MANIFEST for the AI Presentation site.
 *
 * Structure only. Each demo is just the path to its folder; id and n are derived
 * from that path (id = last segment without the NN- prefix, n = the NN- prefix),
 * and all copy (title, why, prompts, look-for, skills, files, media) lives in the
 * demo README.md + prompt.md and is fetched + parsed by app.js. See DEMO.schema.md.
 */
window.PRESENTATION = {
  title: "AI Presentation",
  tagline: "Practical ways to fold AI into a Rancher / Dashboard workflow",
  repo: "https://github.com/codyrancher/ai-shared",
  model: "Claude Opus 4.8",
  intro: {
    "heading": "Short discussion about the 1:1s",
    "points": [
      "Everyone is using AI.",
      "Most people have found small niches in their existing workflow to inject AI.",
      "Some have not tried the current SOTA models (Claude Opus 4.8 / Fable, OpenAI GPT 5.5). If you have been disappointed with the results, it is worth trying one of them again."
    ]
  },
  sections: [
    { id: "ai-chat", title: "AI Chat", blurb: "Interactive, conversational use of the agent. Demonstrated live in my Claude harness project.", groups: [
      { id: "basics", title: "Basics", blurb: "Basic in the sense that many people are already using variations of these, not that they are low value. Nice to run these inside a container or VM so you can let the agent work without constant supervision.", demos: [
        "demos/01-ai-chat/01-basics/01-codebase-query-report",
        "demos/01-ai-chat/01-basics/02-screenshot-prompting",
        "demos/01-ai-chat/01-basics/03-behavior-environment"
      ] },
      { id: "intermediate", title: "Intermediate", blurb: "Package repeated work into skills and drive the browser from the CLI.", demos: [
        "demos/01-ai-chat/02-intermediate/01-provisioning-resources-infra",
        "demos/01-ai-chat/02-intermediate/02-making-your-own-skills",
        "demos/01-ai-chat/02-intermediate/03-browser-skills-live"
      ] },
      { id: "advanced", title: "Advanced", blurb: "Let the agent loop on itself, analyze the whole backlog, and run multi-stage pipelines from prompts alone.", demos: [
        "demos/01-ai-chat/03-advanced/01-agent-loop-resolve-issue",
        "demos/01-ai-chat/03-advanced/02-loop-analyze-issues",
        "demos/01-ai-chat/03-advanced/03-prompt-only-pipelines"
      ] }
    ] },
    { id: "agentic", title: "Agentic", blurb: "Agents that run on their own: scheduled bots that groom, triage, and test the repo; unattended loops that grind a goal to done; multi-agent orchestrations that check their own work; and AI-built tooling that turns manual processes into buttons and reports.", groups: [
      { id: "scheduled-bots", title: "Scheduled repo bots", blurb: "Run on a schedule with no one watching — they read issues and PRs and post analysis, criteria, triage, or brand-new tests straight onto the tracker.", demos: [
        "demos/02-agentic/01-scheduled-bots/01-stale-bot",
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
        "demos/02-agentic/03-orchestration/03-bender"
      ] },
      { id: "ai-tooling", title: "AI-powered tooling", blurb: "AI that both builds and feeds the tool — consoles, dashboards, and reports where fetching, shaping, and rendering the data is a prompt, and extending it is a sentence.", demos: [
        "demos/02-agentic/04-ai-tooling/01-release-captaincy",
        "demos/02-agentic/04-ai-tooling/02-dependabot-alerts",
        "demos/02-agentic/04-ai-tooling/03-reports"
      ] },
      { id: "build-deploy", title: "Autonomous build & deploy", blurb: "Describe what you want; the agent creates the repo or branch, builds it, deploys it to a live cluster, verifies it, and registers it — the full lifecycle, unattended, one at a time, with status tracked on a Kubernetes resource.", demos: [
        "demos/02-agentic/05-build-deploy/01-feedback-console",
        "demos/02-agentic/05-build-deploy/02-extension-console"
      ] }
    ] }
  ]
};
