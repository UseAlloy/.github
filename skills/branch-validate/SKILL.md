---
name: branch-validate
description: Ensure a git branch name is validated against standard naming conventions.
---

## Goal

Ensure git branches are created with our standard organize-wide convention.

In the case where a branch or PR is already created and is incorrect, recreate it until it's valid.

## Validating the branch

The current branch name can be validated with the script inside of this skill:

```bash
./validate-branch.sh
```

If the branch is not yet created, pass it to the script:

```bash
./validate-branch.sh 'feature/TICKET-123/example-branch-name'
```

If a PR was created for the existing, incorrectly-named branch, close that PR. Create a new PR for the new correctly-named branch.

Use this fallback format when the ticket ID is not known at all: `task/<label>`

If using the Cursor Cloud `ManagePullRequest` tool to create the branch and PR, enable the `skip_branch_prefix_check` parameter to bypass Cursor's pre-existing branch naming checks.

## Git branch naming

IMPORTANT: Follow the branch naming convention below when creating or renaming branches, regardless of whether a branch or PR already exists.

Branch name must match format: `<type>/<ticket>/<label>'

- `<type>` - a work type in all lowercase, e.g. feature, task, sub-task
- `<ticket>` - a ticket ID in all uppercase, e.g. MYTEAM-123
- `<label>` - a short description lowercase letters, numbers, and dashes

Example: feature/TICKET-123/example-branch-name

The ticket ID is known when:

- You've been @mentioned from a Jira ticket.
- The user provides a Jira ticket URL or ID in the prompt.
- The prompt, current branch, base branch, PR branch, or issue context contains a Jira-style ticket ID such as `TEAM-123` or `team-123`.

Extract the ticket ID with this precedence:

1. Explicit Jira ticket in the user prompt.
2. Jira ticket in the requested/current/base branch name.
3. Jira ticket in linked issue or PR context.

If a ticket ID is found, do not use `task/<label>`. Use `task/<TICKET>/<label>`.

If Cursor Cloud or Claude Managed Agents provides a run-specific suffix, append it to `<label>` while keeping the ticket:

- Correct: `task/TEAM-123/descriptive-label-suffix456`
- Incorrect: `task/descriptive-label-suffix456`

If a branch was already created or if a PR was already created, then create a new branch, following this section's conventions on git branch names.
