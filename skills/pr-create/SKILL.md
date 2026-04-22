---
name: pr-create
description: Create a pull request (PR) with our standard GitHub PR template
---

## Goal

Create a pull request (PR) for the current git branch by filling out our standard template.

When this skill fails without a fix, ask the user to manually create a PR via the GitHub UI after pushing their branch.

## PR Template

The canonical pull request template is available in the public GitHub `UseAlloy/.github` repository:

https://github.com/UseAlloy/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md

It can be fetched in a shell like this:

```sh
export PR_TEMPLATE=$(gh api \
  --header 'Accept: application/vnd.github.v3.raw' \
  'repos/UseAlloy/.github/contents/.github/PULL_REQUEST_TEMPLATE.md'
)
```

## PR Creation

The `gh` CLI should be available on all developer machines. If it's not, it can be installed via Homebrew:

```
brew install gh
```

First the branch must be pushed up:

```sh
git push --set-upstream origin HEAD
```

Then a PR can be created with this command:

```sh
gh pr create --title '{TITLE}' --body '{BODY}' --draft
```

Replace the placeholders:

- `{TITLE}`: PR title should be a concise yet descriptive title for the branch's changes.
- `{BODY}`: PR body should use the [PR Template](#pr-template) and fill in the details as outlined in the template itself.

## Guidelines

- Replace the "REPLACE ME" placeholder in the Overview section with a concise 1-2 sentence description of the overall changes, e.g: Updates the core authentication code to support additional clients. When available, provide context for why the changes are being made.
- Fill in the test instructions in the Test Instructions section, providing commands to run and/or pages to test for QA. If none can be accurately defined, let the user know to do this as a next step after the PR is creted.
- Try to fill out the Risks section by checking a box with `[x]`. If none can be accurately defined, let the user know to do this as a next step after the PR is creted.
- As part of next steps, let the user know they need to review the generated PR description and go through the Authoring Guidelines section.
