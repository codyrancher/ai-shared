/*
 * demos.js - MANIFEST for the AI Presentation site.
 *
 * Declares only the structure (sections > groups > demos) and each demo's media.
 * The demo CONTENT (why, prompts, what-to-look-for, skills, files) lives in each
 * demo's README.md + prompt.md and is fetched + parsed at runtime by app.js.
 *   - Edit the markdown to change copy.
 *   - Edit here to add a demo, reorder, or wire up media.
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
        { id: "screenshot-prompting", n: 1, title: "Prompting with screenshots", path: "demos/01-ai-chat/01-basics/01-screenshot-prompting", media: [{"type":"video","src":"media/screenshot-prompting.webm","caption":"Pasting a screenshot and getting a located answer","pending":true,"captureWith":"my-browser-record-video"}] },
        { id: "codebase-query-report", n: 2, title: "Querying the codebase for a linked report", path: "demos/01-ai-chat/01-basics/02-codebase-query-report", media: [{"type":"image","src":"media/report.png","caption":"A report with clickable file:line links","pending":true,"captureWith":"browser.mjs screenshot"}] },
        { id: "why-was-it-implemented", n: 3, title: "Asking why something was implemented a certain way", path: "demos/01-ai-chat/01-basics/03-why-was-it-implemented", media: [{"type":"image","src":"media/why.png","caption":"Reasoning reconstructed from history","pending":true,"captureWith":"browser.mjs screenshot"}] },
        { id: "customize-with-claude-md", n: 4, title: "Customizing behavior with CLAUDE.md", path: "demos/01-ai-chat/01-basics/04-customize-with-claude-md", media: [{"type":"video","src":"media/claude-md.webm","caption":"Rule added, behavior changes in the same session","pending":true,"captureWith":"my-browser-record-video"}] },
        { id: "provision-oidc-outside-cluster", n: 5, title: "Provisioning resources outside the cluster (OIDC)", path: "demos/01-ai-chat/01-basics/05-provision-oidc-outside-cluster", media: [{"type":"video","src":"media/oidc.webm","caption":"Dex up, Rancher wired, login through the new provider","pending":true,"captureWith":"my-browser-record-video"}] },
        { id: "reduce-domains-more-tools", n: 6, title: "Reduce active domains, hand the agent a toolbelt", path: "demos/01-ai-chat/01-basics/06-reduce-domains-more-tools", media: [{"type":"image","src":"media/toolbelt.png","caption":"A CLAUDE.md toolbelt section","pending":true,"captureWith":"browser.mjs screenshot"}] }
      ] },
      { id: "intermediate", title: "Intermediate", blurb: "Package repeated work into skills and drive the browser from the CLI.", demos: [
        { id: "making-your-own-skills", n: 1, title: "Making your own skills", path: "demos/01-ai-chat/02-intermediate/01-making-your-own-skills", media: [{"type":"image","src":"media/skill.png","caption":"A generated SKILL.md","pending":true,"captureWith":"browser.mjs screenshot"}] },
        { id: "browser-skills-live", n: 2, title: "Screenshots, videos, and browser control from the CLI", path: "demos/01-ai-chat/02-intermediate/02-browser-skills-live", media: [{"type":"video","src":"media/repro.webm","caption":"A live-recorded reproduction","pending":true,"captureWith":"my-browser-record-video"},{"type":"image","src":"media/comparison.png","caption":"Master vs branch, changed element boxed","pending":true,"captureWith":"my-browser-screenshot-comparison"}] }
      ] },
      { id: "advanced", title: "Advanced", blurb: "Let the agent loop on itself, analyze the whole backlog, and run multi-stage pipelines from prompts alone.", demos: [
        { id: "agent-loop-resolve-issue", n: 1, title: "An agent that loops on itself to resolve an issue", path: "demos/01-ai-chat/03-advanced/01-agent-loop-resolve-issue", media: [{"type":"video","src":"media/self-loop.webm","caption":"The agent iterating to green","pending":true,"captureWith":"my-browser-record-video"}] },
        { id: "loop-analyze-issues", n: 2, title: "/loop over the whole issue backlog", path: "demos/01-ai-chat/03-advanced/02-loop-analyze-issues", media: [{"type":"image","src":"media/issues-report.png","caption":"The accumulated hotspots + clusters report","pending":true,"captureWith":"browser.mjs screenshot"}] },
        { id: "prompt-only-pipelines", n: 3, title: "Pipelines and workflows from prompts alone (zero code)", path: "demos/01-ai-chat/03-advanced/03-prompt-only-pipelines", media: [{"type":"image","src":"media/pipeline.png","caption":"A prompt-defined review pipeline running","pending":true,"captureWith":"browser.mjs screenshot"}] }
      ] }
    ] },
    { id: "agentic", title: "Agentic", blurb: "Unattended agents on a schedule, and a local pipeline for solving issues end to end.", groups: [
      { id: "agentic-showcases", title: null, blurb: null, demos: [
        { id: "stale-bot", n: 1, title: "Stale bot", path: "demos/02-agentic/01-stale-bot", media: [{"type":"image","src":"media/definition.png","caption":"The simple scheduled definition","pending":true,"captureWith":"browser.mjs screenshot"},{"type":"image","src":"media/closed-count.png","caption":"Issues closed to date","pending":true,"captureWith":"browser.mjs screenshot"}] },
        { id: "bender", n: 2, title: "Bender (local pipeline / workflow)", path: "demos/02-agentic/02-bender", media: [{"type":"video","src":"media/bender-run.webm","caption":"A live run with the browser / logs tools open","pending":true,"captureWith":"my-browser-record-video"},{"type":"image","src":"media/bender-interrogate.png","caption":"Interrogating a past run","pending":true,"captureWith":"browser.mjs screenshot"}] }
      ] }
    ] }
  ]
};
