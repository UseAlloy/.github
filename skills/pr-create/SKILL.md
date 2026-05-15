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

It can be fetched in a shell like this:

```sh
export PR_TEMPLATE=$(gh api \
  --header 'Accept: application/vnd.github.v3.raw' \
  'repos/UseAlloy/.github/contents/.github/PULL_REQUEST_TEMPLATE.md'
)
```

The sections below match this template.

## Instructions

1. **Analyze the actual changes on the branch** (this is the single source of truth, not conversation history):

   ```sh
   git log origin/master..HEAD --oneline
   git diff origin/master...HEAD --stat
   git diff origin/master...HEAD
   ```

   Read the full diff carefully. Every claim in the summary must be backed by something in the diff. Do not describe changes that were discussed but not committed, or changes that were made and then reverted.

2. **Conversation context is secondary.** If this runs within an existing chat session, the conversation may explain _why_ a change was made or what trade-offs were considered. Use that for the "why", but never let it override what the diff actually shows. If the conversation mentions a change that isn't in the diff, do not include it.

3. **Generate a PR title:** concise, descriptive.

4. **Generate summary** by filling in these sections (matching the template):

   - **Overview:** replace the "REPLACE ME" placeholder with what changed and why. Short bullets, not prose. 3-5 bullets max, one line each. Skip obvious context the diff conveys, focus on intent and non-obvious decisions.
   - **Test Instructions:** only steps a reviewer actually needs to run. Skip "clone the repo" style setup. 3-5 steps max. If none can be accurately defined, tell the user to fill this in as a next step after the PR is created.
   - **Test Results** (optional): include only when you have actual results, screenshots, recordings, or query outputs to share. Otherwise omit the section entirely.
   - **Risks:** check `[x]` only for real risks from: Authentication/authorization, Data privacy, Networking, Major configuration, Other core setup. Add context below the checkbox list. If none apply, write one short line eg "No significant risks - [brief reason]". If you cannot accurately assess risks, tell the user to fill this in as a next step.

   **Length target:** full summary readable in under 30 seconds. If you're writing more, cut the least important detail first. Default to the shorter version.

5. **Output each section in its own fenced code block** (triple backticks with `markdown` language tag) so the user can copy-paste each section independently into GitHub. Label each block with a bold heading outside the fence (eg `**Title**`). Do not include the section heading (eg `## ℹ️ Overview`) inside the code block. No other preamble or commentary.

6. **Formatting rules:**

   - Bullets over prose in Overview and Test Instructions.
   - For Risks: include only `[x]` checked lines (omit unchecked categories). Put any additional notes BELOW the checkbox list.

7. **Use this exact template** (each section in its own fenced code block):

**Title**

````
```markdown
<concise title>
```
````

**Overview**

````
```markdown
<description here>
```
````

**Test Instructions**

````
```markdown
1. <specific step>
2. <specific step>
3. <specific step>
```
````

**Test Results** (optional)

````
```markdown
<only include this section if you have actual results to share; omit entirely otherwise>
```
````

**Risks**

````
```markdown
<only include [x] checked lines for applicable risks from: Authentication/authorization, Data privacy, Networking, Major configuration, Other core setup>
<add context about the risk below>
<if no risks apply, just write: "No significant risks - [brief reason]">
```
````

8. **Offer to publish.** After displaying the summary, ask the user if they'd like to:

   - **Create a new PR** (see [PR Creation](#pr-creation) below)
   - **Update an existing PR:** user provides the PR number, then run `gh pr edit <number>` to set the title and body
   - **Do nothing:** they'll handle it themselves

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

- `{TITLE}`: concise yet descriptive title for the branch's changes.
- `{BODY}`: PR body using the [PR Template](#pr-template), filled in per the [Instructions](#instructions) above.
