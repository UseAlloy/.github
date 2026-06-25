---
name: pr-create
description: Draft a PR summary for the current branch and create or update the PR using our standard GitHub PR template
---

## Goal

Draft a pull request summary for the current git branch using our standard template, then create the PR or update an existing one.

When this skill fails without a fix (eg `gh` not installed, push rejected), ask the user to push the branch and create the PR manually via the GitHub UI.

## Audience and tone

PR descriptions are read by humans doing code review, not by LLMs or as exhaustive change logs. Optimize for the reviewer's attention budget.

- Brevity beats completeness. A reviewer should be able to read the whole description in under 30 seconds and know what to look at in the diff.
- Plain language, lowercase is fine, no marketing voice. Match the author's tone.
- No padding: skip context the diff already shows, skip restating what the title says, skip "this PR does X by Y" preamble.
- No LLM trope sentences ("it's not just X, it's Y", "comprehensive", "robust", "seamlessly"). Cut adjectives.
- Bullets over prose. One line per bullet. If a bullet wraps to three lines, it's two bullets or it's too long.
- Explain the non-obvious "why" (a constraint, a trade-off considered, a thing that looks wrong but isn't). Skip the obvious "what" the diff already conveys.
- When in doubt, cut. A shorter description that nails the key risk is better than a longer one that buries it.
- Do not describe or justify changes you considered but did not make. If it's not in the diff, the reviewer doesn't need it. No "left X as-is on purpose" or "considered Y but didn't". That's conversation context, not PR content.
- Each Overview bullet should be "what changed, why in one short clause". Do not enumerate field names, timing measurements, severity levels, or other specifics the diff already shows. The reviewer reads the diff for details; the bullet's job is to point them at it.

**Calibration example** — same change, two versions:

Too long:
- removed `<thing>` from `<file>`. it was a strict subset of `<other thing>` (which already carries `<field>`, `<field>`, `<field>`) and fired ~Nms later.
- demoted `<other thing>` to debug. <one-sentence justification about volume/usefulness>.

Right size:
- removed `<thing>` from `<file>`, as it now duplicates `<other thing>`
- demoted `<other thing>` to debug

The trimmed version drops field lists, quantitative details, and extra justifying clauses — all derivable from the diff or obvious from context. The "why" survives as a single short clause.

## PR Template

The canonical pull request template lives in this public `UseAlloy/.github` repository:

https://github.com/UseAlloy/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md

Fetch it in a shell to get the live section list and headings:

```sh
gh api \
  --header 'Accept: application/vnd.github.v3.raw' \
  'repos/UseAlloy/.github/contents/.github/PULL_REQUEST_TEMPLATE.md'
```

Fill in this template — do not invent or reorder sections. The per-section authoring guidance below applies to whichever sections the template currently contains.

## Drafting the PR

### Analyze the actual changes on the branch

This is the single source of truth, not conversation history.

```sh
git log origin/master..HEAD --oneline
git diff origin/master...HEAD --stat
git diff origin/master...HEAD
```

Read the full diff carefully. Every claim in the summary must be backed by something in the diff. Do not describe changes that were discussed but not committed, or changes that were made and then reverted.

### Conversation context is secondary

If this runs within an existing chat session, the conversation may explain _why_ a change was made or what trade-offs were considered. Use that for the "why", but never let it override what the diff actually shows. If the conversation mentions a change that isn't in the diff, do not include it.

### Generate a PR title

Concise and descriptive. Do not prefix or include the ticket ID — the branch name already carries it. The PR title should describe the change, not duplicate the branch metadata.

### Fill in the template sections

Use the live template fetched above. For each section it contains, apply this guidance where relevant:

- **Coding AI Authorship** — MUST select the option that reflects who did the *coding* work in the diff. If unsure, check `Human-authored`. Writing this PR description does not count. Infer from the diff and conversation context: if the conversation shows an agent made the code changes, check `AI-authored` and replace the template comment with a MAX 100-character sentence describing what the AI did (e.g. "AI wrote plan, added tests, made 95% of code changes, tested locally."). If the code was human-written and only the description is AI-generated, check `Human-authored` and remove the comment.
- **Overview** — replace the "REPLACE ME" placeholder with what changed and why. Short bullets, not prose. 3-5 bullets max, one line each. Skip obvious context the diff conveys, focus on intent and non-obvious decisions.
- **Test Instructions** — only steps a reviewer actually needs to run. Skip "clone the repo" style setup. 3-5 steps max. If none can be accurately defined, tell the user to fill this in as a next step after the PR is created.
- **Test Results** — include only when you have actual results, screenshots, recordings, or query outputs to share. Otherwise leave the section empty or omit per the template's convention.
- **Risks** — check `[x]` only for real risks (omit unchecked categories from your output). Add context below the checkbox list. If none apply, write one short line eg "No significant risks - [brief reason]". If you cannot accurately assess risks, tell the user to fill this in as a next step.

**Length target:** full summary readable in under 30 seconds. If you're writing more, cut the least important detail first. Default to the shorter version.

### Output format

Output the title in its own fenced markdown code block, then each section from the fetched template in its own fenced markdown code block. This lets the user copy-paste each section independently into GitHub.

Rules:

- Triple backticks with `markdown` language tag on every block.
- Label each block with a bold heading **outside** the fence (eg `**Title**`, `**Overview**`) using the section name from the fetched template.
- Do not include the template's section heading (eg `## ℹ️ Overview`) inside the code block — the bold label outside serves that purpose.
- No preamble or commentary between blocks.

Use this format for every section in the fetched template, in template order. Example for the Title and an Overview section:

**Title**

````
```markdown
<concise title>
```
````

**Overview**

````
```markdown
- <bullet>
- <bullet>
```
````

Apply the same pattern to whichever sections the current template contains (Test Instructions, Test Results, Risks, etc).

### Offer to publish

After displaying the summary, ask the user if they'd like to:

- **Create a new PR** (see [PR Creation](#pr-creation) below)
- **Update an existing PR** — user provides the PR number, then run `gh pr edit <number>` to set the title and body
- **Do nothing** — provide the filled-out PR template as Markdown that the user will copy and paste themselves

Let the user know to review the generated PR description and walk through the Authoring Guidelines section in the template before marking ready for review.

## PR Creation

The `gh` CLI should be available on all developer machines. If not, install via Homebrew:

```sh
brew install gh
```

Push the branch first:

```sh
git push --set-upstream origin HEAD
```

Then create the PR as a draft:

```sh
gh pr create --title '{TITLE}' --body '{BODY}' --draft
```

Use a HEREDOC for the body to preserve formatting:

```sh
gh pr create --title "the pr title" --draft --body "$(cat <<'EOF'
<body here>
EOF
)"
```

Replace the placeholders:

- `{TITLE}`: concise, descriptive title for the branch's changes (no ticket ID).
- `{BODY}`: PR body using the fetched [PR Template](#pr-template), filled in per [Drafting the PR](#drafting-the-pr).
