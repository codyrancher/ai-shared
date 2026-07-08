/*
 * demos.js - single source of truth for the AI Presentation site.
 *
 * Every demo folder under /demos mirrors one entry here. app.js renders the
 * nav and the demo panes from this object; each demo's prompt.md carries the
 * same prompt text for people reading the repo directly.
 *
 * Media is intentionally "pending" until captured. app.js renders a labeled
 * placeholder for any media marked { pending: true }, noting which skill to
 * use to capture it. Drop the real file into the demo's media/ folder and flip
 * pending to false (or remove it) to light it up.
 */
window.PRESENTATION = {
  title: 'AI Presentation',
  tagline: 'Practical ways to fold AI into a Rancher / Dashboard workflow',
  repo: 'https://github.com/codyrancher/ai-shared',
  model: 'Claude Opus 4.8',
  intro: {
    heading: 'Short discussion about the 1:1s',
    points: [
      'Everyone is using AI.',
      'Most people have found small niches in their existing workflow to inject AI.',
      'Some have not tried the current SOTA models (Claude Opus 4.8 / Fable, OpenAI GPT 5.5). If you have been disappointed with the results, it is worth trying one of them again.'
    ]
  },

  sections: [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      blurb: 'Interactive, conversational use of the agent. Demonstrated live in my Claude harness project.',
      groups: [
        {
          id: 'basics',
          title: 'Basics',
          blurb: 'Basic in the sense that many people are already using variations of these, not that they are low value. Nice to run these inside a container or VM so you can let the agent work without constant supervision.',
          demos: [
            {
              id: 'screenshot-prompting',
              n: 1,
              title: 'Prompting with screenshots',
              path: 'demos/01-ai-chat/01-basics/01-screenshot-prompting',
              why: 'Paste a picture instead of retyping or reformatting what is on your screen, and point at the UI instead of describing it in words.',
              prompts: [
                {
                  label: 'Quick text sharing',
                  why: 'Saves the tedium of selecting, copying, and reformatting a stack trace or log. The picture carries the text for you.',
                  screenshot: { src: 'media/example-screenshot.png', alt: 'A screenshot pasted straight into the prompt (click to pan / zoom)' },
                  text:
                    'This is the failure from our CI run. Read the error and the stack frames in the screenshot, locate the responsible code in this repo, and explain the root cause. Link the files and lines you reference.'
                },
                {
                  label: 'Spatial awareness',
                  why: 'Faster than writing paragraphs about a layout bug. You point at the region and the agent sees where things sit.',
                  screenshot: { src: 'media/example-ui.png', alt: 'A UI screenshot you annotate and paste (click to pan / zoom)' },
                  text:
                    'The control I circled in red overlaps the search box on narrow viewports. Using the layout you can see in the screenshot, find the Vue component that renders this area and propose a CSS fix that keeps them from colliding below 768px.'
                }
              ],
              lookFor: [
                'The agent transcribes and acts on text straight from the image, no paste needed.',
                'It uses position ("overlaps", "to the right of", "below the fold") to find the right component.',
                'Annotating the screenshot (a red circle) is enough to disambiguate the target.'
              ],
              media: [{ type: 'video', src: 'media/screenshot-prompting.webm', caption: 'Pasting a screenshot and getting a located answer', pending: true, captureWith: 'my-browser-record-video' }],
              links: [],
              skills: []
            },
            {
              id: 'codebase-query-report',
              n: 2,
              title: 'Querying the codebase for a linked report',
              path: 'demos/01-ai-chat/01-basics/02-codebase-query-report',
              why: 'Onboard onto an unfamiliar area in minutes instead of grepping around for an hour, with links you can jump straight into.',
              prompts: [
                {
                  label: 'Orientation report',
                  why: 'Skips the manual code spelunking. You get a verifiable map with file:line links instead of reading the whole subsystem yourself.',
                  text:
                    'Give me a short orientation report on how cluster provisioning is wired in this dashboard. Cover: the route and entry component, the store modules involved, and where the create/update API calls are made. Every claim must link to an exact file and line. Cap it at 15 bullets and end with the 3 files I should read first.'
                }
              ],
              lookFor: [
                'Each bullet ends in a file:line reference you can click.',
                'The "read these 3 first" list is a genuine shortcut into the area.',
                'No hand-wavy claims: if it cannot point at code, it says so.'
              ],
              media: [{ type: 'image', src: 'media/report.png', caption: 'A report with clickable file:line links', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [],
              skills: []
            },
            {
              id: 'why-was-it-implemented',
              n: 3,
              title: 'Asking why something was implemented a certain way',
              path: 'demos/01-ai-chat/01-basics/03-why-was-it-implemented',
              why: 'Recover the lost reasoning behind odd code without digging through git blame, old PRs, and issues yourself.',
              prompts: [
                {
                  label: 'Recover the reasoning',
                  why: 'Saves the archaeology across history and threads, and tells you whether a workaround is now obsolete.',
                  text:
                    'Why is <this function / component / workaround> written the way it is? Check git blame, the PR that introduced it, any linked issue, and nearby comments, then explain the reasoning in a few sentences. If it looks like a workaround, tell me exactly what it works around and whether that constraint still holds today.\n\n(Swap the target for a real one, e.g. "why does the Steve proxy rewrite the Host header before forwarding".)'
                }
              ],
              lookFor: [
                'It cites the introducing PR / issue, not just the current code.',
                'It separates "what it does" from "why it exists".',
                'For workarounds, it names the original constraint and checks if it still applies.'
              ],
              media: [{ type: 'image', src: 'media/why.png', caption: 'Reasoning reconstructed from history', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [],
              skills: []
            },
            {
              id: 'customize-with-claude-md',
              n: 4,
              title: 'Customizing behavior with CLAUDE.md',
              path: 'demos/01-ai-chat/01-basics/04-customize-with-claude-md',
              why: 'Stop re-explaining the same preferences every session; write the rule once and it sticks.',
              prompts: [
                {
                  label: 'Shape behavior',
                  why: 'Never type "run lint first" or "no em dashes" again. Set it once and every reply obeys.',
                  text:
                    'Add two rules to CLAUDE.md: never use em dashes in any output, and always run yarn lint before you tell me a change is done. Then show me the diff.'
                },
                {
                  label: 'Provision in-cluster on a keyword',
                  why: 'Collapses a multi-step kubectl runbook into a single word you can rerun anytime.',
                  text:
                    'Add a CLAUDE.md rule so that when I say "seed demo", you create a namespace called demo-app in the local cluster and populate it with a sample Deployment, Service, and ConfigMap using kubectl against the current kubeconfig. Then run it: seed demo.'
                }
              ],
              lookFor: [
                'The next reply already obeys the new rule (no em dashes, lints first).',
                'A keyword like "seed demo" now maps to real kubectl actions.',
                'A few lines of natural language replace a runbook.'
              ],
              media: [{ type: 'video', src: 'media/claude-md.webm', caption: 'Rule added, behavior changes in the same session', pending: true, captureWith: 'my-browser-record-video' }],
              links: [{ label: 'example-CLAUDE.md', href: 'files/example-CLAUDE.md' }],
              skills: []
            },
            {
              id: 'provision-oidc-outside-cluster',
              n: 5,
              title: 'Provisioning resources outside the cluster (OIDC)',
              path: 'demos/01-ai-chat/01-basics/05-provision-oidc-outside-cluster',
              why: 'Stand up throwaway infra a feature needs without doing the fiddly, error-prone setup by hand.',
              prompts: [
                {
                  label: 'Stand up and connect OIDC',
                  why: 'Saves an afternoon of container, client, and auth-config wiring, and it verifies the login for you at the end.',
                  text:
                    'Stand up a Dex OIDC provider in a local container with an issuer reachable from the Rancher server. Create a static client for Rancher, then configure this Rancher instance to use that provider for auth, end to end. Walk me through each step, run the commands, and finish by logging in through the new provider to prove it works.'
                }
              ],
              lookFor: [
                'It provisions the container, the client, and the Rancher auth config as one flow.',
                'It handles issuer reachability between the two (a common snag).',
                'It closes the loop by actually logging in through the new provider.'
              ],
              media: [{ type: 'video', src: 'media/oidc.webm', caption: 'Dex up, Rancher wired, login through the new provider', pending: true, captureWith: 'my-browser-record-video' }],
              links: [{ label: 'oidc-notes.md', href: 'files/oidc-notes.md' }],
              skills: []
            },
            {
              id: 'reduce-domains-more-tools',
              n: 6,
              title: 'Reduce active domains, hand the agent a toolbelt',
              path: 'demos/01-ai-chat/01-basics/06-reduce-domains-more-tools',
              why: 'Set things up so the agent runs unattended, freeing you to work on something else in parallel.',
              prompts: [
                {
                  label: 'Point at the toolbelt',
                  why: 'The agent does the browser, Rancher, and GitHub steps itself instead of handing each one back to you.',
                  text:
                    'Here is the toolbelt for this project: browser.mjs for screenshots and video, wait-for-sidecars before any browser or Rancher work, the insights curl for reporting missing tools, and the my-* skills for commits, PRs, and recordings. Whenever a task needs the browser, Rancher, or GitHub, reach for these instead of asking me to do it by hand. If a tool you need is missing, tell me and I will add it.'
                }
              ],
              lookFor: [
                'The agent picks the right tool on its own instead of narrating manual steps.',
                'Narrow scope keeps the context focused and the runs unattended.',
                'Missing-tool feedback becomes a loop: it asks, you add, it uses.'
              ],
              media: [{ type: 'image', src: 'media/toolbelt.png', caption: 'A CLAUDE.md toolbelt section', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [{ label: 'toolbelt-CLAUDE.md', href: 'files/toolbelt-CLAUDE.md' }],
              skills: []
            }
          ]
        },
        {
          id: 'intermediate',
          title: 'Intermediate',
          blurb: 'Package repeated work into skills and drive the browser from the CLI.',
          demos: [
            {
              id: 'making-your-own-skills',
              n: 1,
              title: 'Making your own skills',
              path: 'demos/01-ai-chat/02-intermediate/01-making-your-own-skills',
              why: 'Stop re-explaining a repeated task; capture it once so you and the team trigger it with one word.',
              prompts: [
                {
                  label: 'Codify a repeated task',
                  why: 'Turns a paragraph you keep retyping into a one-word command the whole team shares.',
                  text:
                    'I keep repeating this task: turn a GitHub issue thread into a tight reproduction plus a proposed fix. Turn it into a reusable skill. Create .claude/skills/summarize-issue/SKILL.md with YAML frontmatter (name, and a description that says when to use it) and a concise step-by-step playbook. Match the voice and structure of my existing my-* skills.'
                }
              ],
              lookFor: [
                'Frontmatter description is written as a trigger ("use when..."), so discovery works.',
                'The body is a short playbook, not prose.',
                'It reads like the existing my-* skills, so the team recognizes the shape.'
              ],
              media: [{ type: 'image', src: 'media/skill.png', caption: 'A generated SKILL.md', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [{ label: 'example-skill/SKILL.md', href: 'files/example-skill/SKILL.md' }],
              skills: ['my-commit-create', 'my-pr-create']
            },
            {
              id: 'browser-skills-live',
              n: 2,
              title: 'Screenshots, videos, and browser control from the CLI',
              path: 'demos/01-ai-chat/02-intermediate/02-browser-skills-live',
              why: 'Turn "reproduce this and film it" into one instruction, and batch it across the backlog while you work on something else.',
              prompts: [
                {
                  label: 'Record a before video',
                  why: 'Saves the manual click-and-screen-record loop, and hands the next person a ready-made repro instead of a vague description.',
                  text:
                    'Reproduce issue #<N> against the live Rancher and record a before video. Use the my-browser-record-video skill: iterate to find the exact click sequence, save it as a Playwright script, then play it back with browser.mjs record-script so the recording is one clean take.'
                },
                {
                  label: 'Labeled before/after comparison',
                  why: 'No manual before/after cropping or arrow-drawing; the changed element is boxed for you.',
                  text:
                    'Take a labeled before/after comparison screenshot of the affected page with my-browser-screenshot-comparison, master versus this branch, and draw a red box around the element that changed.'
                }
              ],
              lookFor: [
                'One clean recording, no agent-thinking dead air (it scripts first, records second).',
                'The comparison screenshot highlights exactly what changed.',
                'Screenshots keep enough surrounding context to be reproducible.'
              ],
              media: [
                { type: 'video', src: 'media/repro.webm', caption: 'A live-recorded reproduction', pending: true, captureWith: 'my-browser-record-video' },
                { type: 'image', src: 'media/comparison.png', caption: 'Master vs branch, changed element boxed', pending: true, captureWith: 'my-browser-screenshot-comparison' }
              ],
              links: [],
              skills: ['my-browser-record-video', 'my-browser-screenshot-comparison', 'my-video-censor-ip']
            }
          ]
        },
        {
          id: 'advanced',
          title: 'Advanced',
          blurb: 'Let the agent loop on itself, analyze the whole backlog, and run multi-stage pipelines from prompts alone.',
          demos: [
            {
              id: 'agent-loop-resolve-issue',
              n: 1,
              title: 'An agent that loops on itself to resolve an issue',
              path: 'demos/01-ai-chat/03-advanced/01-agent-loop-resolve-issue',
              why: 'Let the agent grind an issue to green on its own while you focus on something else.',
              prompts: [
                {
                  label: 'Close the loop',
                  why: 'Runs the reproduce, fix, and verify loop unattended, so you are not driving every step by hand.',
                  text:
                    'Work issue #<N> end to end and do not stop until it is green. Loop: reproduce it against the live Rancher and record a before video, find and apply the fix, verify the repro no longer happens and record an after video, run yarn lint and the relevant tests, and if anything fails go back and fix it. When it is all passing, commit on a branch named issue-<N> using the my-commit-create skill. Re-read your own diff and the issue before you call it done.'
                }
              ],
              lookFor: [
                'A real done condition ("do not stop until it is green") keeps it iterating.',
                'It verifies itself: before/after video, lint, tests, re-reading the diff.',
                'Same shape as my-code-autofix, just fired by hand.'
              ],
              media: [{ type: 'video', src: 'media/self-loop.webm', caption: 'The agent iterating to green', pending: true, captureWith: 'my-browser-record-video' }],
              links: [],
              skills: ['my-code-autofix', 'my-commit-create']
            },
            {
              id: 'loop-analyze-issues',
              n: 2,
              title: '/loop over the whole issue backlog',
              path: 'demos/01-ai-chat/03-advanced/02-loop-analyze-issues',
              why: 'Triage a huge backlog without reading every issue yourself.',
              prompts: [
                {
                  label: 'The /loop prompt',
                  why: 'Turns hours of manual reading into a ranked report of duplicates and hotspots.',
                  text:
                    '/loop Fetch every open issue in rancher/dashboard via gh. Each iteration, take the next batch on a fresh context and build up two things: clusters of duplicate or near-duplicate issues, and a heatmap of which files or areas the issues point at. Append results to issues-report.md as you go, never overwrite. Stop when all issues are processed, then print the top 10 hotspots and the largest duplicate clusters.'
                }
              ],
              lookFor: [
                'Fresh context each iteration keeps late batches as sharp as the first.',
                'Results accumulate in a file instead of living in one giant context.',
                'Output is directly useful: dedupe candidates and where to focus.'
              ],
              media: [{ type: 'image', src: 'media/issues-report.png', caption: 'The accumulated hotspots + clusters report', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [{ label: 'issues-report.sample.md', href: 'files/issues-report.sample.md' }],
              skills: []
            },
            {
              id: 'prompt-only-pipelines',
              n: 3,
              title: 'Pipelines and workflows from prompts alone (zero code)',
              path: 'demos/01-ai-chat/03-advanced/03-prompt-only-pipelines',
              why: 'Get a multi-agent workflow without writing or maintaining any pipeline code.',
              prompts: [
                {
                  label: 'Describe the pipeline',
                  why: 'Fan-out, verification, and synthesis from a paragraph, so you skip building and maintaining the harness.',
                  text:
                    'Build me a review pipeline with no code, just orchestration. Stage 1: three agents each read the current diff for a different concern (correctness, accessibility, performance) and return findings as JSON. Stage 2: for each finding, spawn a skeptic agent that tries to refute it, and drop anything a majority refutes. Stage 3: synthesize the survivors into a single ranked review. Run it on the current branch and show me the survivors.'
                }
              ],
              lookFor: [
                'Fan-out, adversarial verify, and synthesis all come from the prompt.',
                'Refuted findings get dropped before they reach you.',
                'No pipeline code exists, yet it runs like one.'
              ],
              media: [{ type: 'image', src: 'media/pipeline.png', caption: 'A prompt-defined review pipeline running', pending: true, captureWith: 'browser.mjs screenshot' }],
              links: [{ label: 'pipeline-prompt.md', href: 'files/pipeline-prompt.md' }],
              skills: []
            }
          ]
        }
      ]
    },

    {
      id: 'agentic',
      title: 'Agentic',
      blurb: 'Unattended agents on a schedule, and a local pipeline for solving issues end to end.',
      groups: [
        {
          id: 'agentic-showcases',
          title: null,
          blurb: null,
          demos: [
            {
              id: 'stale-bot',
              n: 1,
              title: 'Stale bot',
              path: 'demos/02-agentic/01-stale-bot',
              why: 'Keep the backlog tidy on autopilot so no one has to babysit stale issues.',
              prompts: [
                {
                  label: 'The definition',
                  why: 'A few lines run daily on their own, saving a recurring manual chore forever.',
                  text:
                    '/schedule daily at 08:00: Find open issues in rancher/dashboard with no activity in 90 days and no milestone or assignee. Post the standard stale warning. If an already-warned issue has been silent another 14 days, close it as stale with a short explanation and the stale label. Skip anything labeled keep or security.'
                }
              ],
              lookFor: [
                'The entire bot is a handful of lines of plain language.',
                'It has an escape hatch (keep / security) so it stays safe unattended.',
                'The closed-issue count shows the compounding value over time.'
              ],
              media: [
                { type: 'image', src: 'media/definition.png', caption: 'The simple scheduled definition', pending: true, captureWith: 'browser.mjs screenshot' },
                { type: 'image', src: 'media/closed-count.png', caption: 'Issues closed to date', pending: true, captureWith: 'browser.mjs screenshot' }
              ],
              links: [{ label: 'stale-bot.md', href: 'files/stale-bot.md' }],
              skills: []
            },
            {
              id: 'bender',
              n: 2,
              title: 'Bender (local pipeline / workflow)',
              path: 'demos/02-agentic/02-bender',
              why: 'Retry on fresh context instead of babysitting one long run, and reuse what each run produces.',
              prompts: [
                {
                  label: 'What to show (walkthrough, not a single prompt)',
                  why: 'Fresh-context retries and single-stage restarts save you from nursing a poisoned run all the way to the end.',
                  text:
                    '1. The motivation: solve issues e2e, and harvest reusable prompts/skills for the team.\n2. Iterate and retry prompts on fresh context instead of fighting a poisoned one.\n3. The interrogation tools on a pre-existing run (inspect inputs, outputs, and state per stage).\n4. Start a run and open a live tool: the browser view or the streaming logs.\n5. Restart a single stage without rerunning the whole pipeline.'
                }
              ],
              lookFor: [
                'Fresh-context retries beat trying to salvage a bad run.',
                'You can interrogate any prior run stage by stage.',
                'Live browser and log views while a run is in flight.',
                'Restarting one stage does not cost you the whole pipeline.'
              ],
              media: [
                { type: 'video', src: 'media/bender-run.webm', caption: 'A live run with the browser / logs tools open', pending: true, captureWith: 'my-browser-record-video' },
                { type: 'image', src: 'media/bender-interrogate.png', caption: 'Interrogating a past run', pending: true, captureWith: 'browser.mjs screenshot' }
              ],
              links: [{ label: 'bender-notes.md', href: 'files/bender-notes.md' }],
              skills: []
            }
          ]
        }
      ]
    }
  ]
};
