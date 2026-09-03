#!/usr/bin/env bash

# This script validates a git branch, passed in as $1 otherwise defaults to the current branch.

set -euo pipefail

WORK_TYPE_PATTERN='[a-z]+(-[a-z]+)*'
TICKET_ID_PATTERN='[A-Z][A-Z0-9]+-[0-9]+'
BRANCH_LABEL_PATTERN='[a-z0-9-]+'
BRANCH_NAME_PATTERN="^${WORK_TYPE_PATTERN}/${TICKET_ID_PATTERN}/${BRANCH_LABEL_PATTERN}$"

branch_name="${1:-$(git rev-parse --abbrev-ref HEAD)}"

if [[ ! "$branch_name" =~ $BRANCH_NAME_PATTERN ]]; then
  echo 'Branch name must match format: <type>/<ticket>/<label>'

  printf '\n'

  echo '<type>   - a work type in all lowercase, e.g. feature, task, sub-task'
  echo '<ticket> - a ticket ID in all uppercase, e.g. MYTEAM-123'
  echo '<label>  - a short description lowercase letters, numbers, and dashes'

  printf '\n'

  echo 'Example: feature/TICKET-123/example-branch-name'

  printf '\n'

  echo "Rename your branch: git branch --move '${branch_name}' <new-branch>"

  exit 1
fi
