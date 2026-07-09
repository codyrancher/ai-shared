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
        "demos/01-ai-chat/01-basics/01-screenshot-prompting",
        "demos/01-ai-chat/01-basics/02-codebase-query-report",
        "demos/01-ai-chat/01-basics/03-why-was-it-implemented",
        "demos/01-ai-chat/01-basics/04-behavior-environment",
        "demos/01-ai-chat/01-basics/05-reduce-domains-more-tools"
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
    { id: "agentic", title: "Agentic", blurb: "Unattended agents on a schedule, and a local pipeline for solving issues end to end.", groups: [
      { id: "agentic-showcases", title: null, blurb: null, demos: [
        "demos/02-agentic/01-stale-bot",
        "demos/02-agentic/02-bender"
      ] }
    ] }
  ]
};
