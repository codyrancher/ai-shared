# Authoring Skills

> **AI Chat > Intermediate** demo in [AI Shared](../../../../README.md).

**Why:** Stop repeating yourself, improve consistency and provide more tools to your agent

## Creating skills

**Why:** Turn the session you just finished into a one-word command, so nobody has to rediscover the same steps.

**Files:** [/my-browser-screenshot](files/my-browser-screenshot-v1.md)

```
Can you summarize this conversation, I want to generalize it and create a skill named `/my-browser-screenshot`
```

**Result:** [example result](files/create-skill-result.md)

## Updating skills

**Why:** Fold the friction from a session back into the skill, so the same back and forth never happens twice.

**Files:** [/my-browser-screenshot (updated)](files/my-browser-screenshot-v2.md)

```
We had to do a lot of back and forth to get the screenshots to include the highlighting. Can you update the /my-browser-screenshot skill so we can avoid the back and forth in the future?
```

**Result:** [example result](files/update-skill-result.md)

## Notes

- The frontmatter `description` is what the agent matches on to auto-invoke the skill. Write it as a trigger: "Use when...". A vague description means the skill never fires.
- Point the agent at an existing `my-*` skill as a style reference so the new one fits the house style.
- A skill is not done the first time it works. Every session that costs you a round of back and forth is a gotcha the skill should have known, so send it straight back into the file.
