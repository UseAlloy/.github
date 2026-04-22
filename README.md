# .github

Default metadata files across all repositories in the @UseAlloy organization.

## Pull Request (PR) Template

All repositories should use the PR template located in the `.github` directory.

### Create PRs via GitHub CLI 

You can use the GitHub CLI to create PRs like so:

```sh
gh pr create --web
```

> [!TIP]
> Make sure to have the `gh` CLI installed and up to date: `brew install gh`

The template will be automatically prefilled.

### Create PRs via AI Agents

Use your AI agent of choice by installing the agent skill:

```sh
gh skill install UseAlloy/.github pull-request-create
```

> [!TIP]
> Make sure to have the `gh` CLI installed and up to date: `brew install gh`

You can then prompt an AI agent to create a PR, or call the skill directly:

```sh
/pr-create
```
