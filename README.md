# .github

Default metadata files across all repositories in the @UseAlloy organization.

## Pull Request (PR) Template

All repositories should use the PR template located in the [`.github` directory](.github/PULL_REQUEST_TEMPLATE.md).

### Create PRs via GitHub CLI 

You can use the [GitHub CLI](https://cli.github.com/manual/gh_pr_create) to create PRs:

```sh
gh pr create --web
```

> [!TIP]
> Make sure to have the `gh` CLI installed and up to date: `brew install gh`

The template will be automatically prefilled when opened in your browser.

### Create PRs via AI Agents

Use your AI agent of choice by installing the [agent skill](https://agentskills.io/) with the [GitHub CLI](https://cli.github.com/manual/gh_skill):

```sh
gh skill install UseAlloy/.github pr-create
```

> [!TIP]
> Make sure to have the `gh` CLI installed and up to date: `brew install gh`

You can then ask an AI agent to create a PR, or call the skill directly in the prompt:

```sh
/pr-create
```
