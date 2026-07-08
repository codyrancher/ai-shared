# AI Presentation
## Short discussion about the 1 on 1s
- Everyone is using AI
- It seems that most have found small niches in their existing workflows to inject AI
- Some haven't tried the SOTA models (Claude opus 4.6+/fable, Openai GPT 5.5), we would strongly encourage trying one of them out if you've been disappointed with the results.

## Demos
### AI Chat
#### Basics - basic not in utility but because many are already using variations
*Will demonstrate all of these in my claude harness project but won't dive into the features much*
- I will note that it might be nice to run these inside containers or VMs so you can more safely let the agents run without supervision.
1. Demonstrate prompting via using screenshots for both quick text sharing and to show spatial awareness in the prompts.
1. Querying the code base that yields a report and links to the relevant lines/files.
1. Asking a question about why something was implemented a particular way.
1. Quick demonstration about customizing behavior with claude.md
    - This transitions well into provisioning resources inside the cluster itself with just a few lines in the claude.md
1. Provisioning resources outside of the cluster and connecting them to the cluster (spinning up an OIDC provider)
1. Share a general approach I take, reduce the amount of domains that need to be active at once and provide the agent with a plethora of tools.

#### Intermediate
1. Making your own skills
1. Using skills to take screenshots, videos, controlling the browser via the cli (show that happening live)
    - I'll show an issue where screenshots were particularly useful
        - Might mention a pet peeve of screenshots not showing enough context in issues
    - I'll show some examples of the videos I've recorded in our existing PRs
        - Explain how this is useful for automating the reproduction of issues (can do batches on our backlog to find out if issues are already fixed or provide details that might make it easier for someone to pickup)

#### Advanced

1. Show how an agent can loop on itself to work on resolving an issue if prompted correctly.
1. Show one of the prompts where I used `/loop` to analyze all of our open github issues for hotspots and duplication/similarity
1. Show how you can create pipelines/workflows purely with prompts(zero code).

### Agentic
#### Stale bot
1. Show the simple definition
1. Show the number of issues it's closed

#### Bender (local pipeline/workflow)
*Original motivation for solving issues e2e and provide prompts/skills that the rest of the team can use*
1. Explain the desire to iterate and retry prompts on fresh context
1. Show some of the interrogation tools on a pre-existing run
1. Start a run show one of the live tools (browser/logs)
1. Show restarting stages
