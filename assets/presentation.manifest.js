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
        "demos/01-ai-chat/03-advanced/02-agent-loop-resolve-issue",
        "demos/01-ai-chat/03-advanced/03-prompt-only-pipelines"
      ] }
    ] },
    { id: "agentic", title: "Agentic", blurb: "Unattended agents on a schedule, and a local pipeline for solving issues end to end.", groups: [
      { id: "agentic-showcases", title: null, blurb: null, demos: [
        "pages/01-stale-bot",
        "pages/02-bender",
        "pages/03-release-agent",
        "pages/04-interrupt-agent"
      ] }
    ] }
  ]
};
