#!/usr/bin/env bash
# release.sh
# Merge feature and content branches into release, then push.
#
# Usage:
#   bash scripts/release.sh
#
set -euo pipefail

FEATURE_BRANCH="feature"
CONTENT_BRANCH="content"
RELEASE_BRANCH="release"

# ── 0. Save current branch ────────────────────────────────────────────────────
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

cleanup() {
  echo "↩  Returning to branch: $ORIGINAL_BRANCH"
  git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
}
trap cleanup EXIT

# ── 1. Ensure working tree is clean ───────────────────────────────────────────
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Working tree has uncommitted changes. Please commit or stash first."
  exit 1
fi

# ── 2. Switch to release branch ───────────────────────────────────────────────
echo "🚀 Preparing release branch ..."
git checkout "$RELEASE_BRANCH"
git pull origin "$RELEASE_BRANCH" --ff-only 2>/dev/null || true

# ── 3. Merge feature (code changes) ──────────────────────────────────────────
echo "🔗 Merging $FEATURE_BRANCH → $RELEASE_BRANCH ..."
git merge "$FEATURE_BRANCH" --no-ff -m "release: merge feature into release"

# ── 4. Merge content (content/public changes) ─────────────────────────────────
echo "🔗 Merging $CONTENT_BRANCH → $RELEASE_BRANCH ..."
git merge "$CONTENT_BRANCH" --no-ff -m "release: merge content into release"

# ── 5. Push release ───────────────────────────────────────────────────────────
echo "📤 Pushing $RELEASE_BRANCH to origin ..."
git push origin "$RELEASE_BRANCH"

echo ""
echo "🎉 Release ready."
echo "   release → merged from: $FEATURE_BRANCH + $CONTENT_BRANCH"
