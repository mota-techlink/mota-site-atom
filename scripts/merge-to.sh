#!/usr/bin/env bash
# Usage: ./scripts/merge-to.sh <target-branch>
# Merges the current branch into <target-branch>, then returns to content branch.

set -e

TARGET="$1"
RETURN_TO="content"

if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 <target-branch>"
  exit 1
fi

SOURCE=$(git rev-parse --abbrev-ref HEAD)

if [[ "$SOURCE" == "$TARGET" ]]; then
  echo "Already on '$TARGET'. Nothing to do."
  exit 0
fi

echo "▶ Merging '$SOURCE' → '$TARGET'"
git switch "$TARGET"
git merge "refs/heads/$SOURCE" --no-edit
git push origin "$TARGET"

echo "▶ Returning to '$RETURN_TO'"
git switch "$RETURN_TO"

echo "✓ Done. Merged '$SOURCE' into '$TARGET', now on '$RETURN_TO'."
