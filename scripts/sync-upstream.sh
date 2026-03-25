#!/usr/bin/env bash
# sync-upstream.sh
# Sync upstream/main to local main (code only), then merge into feature branch.
# content/ and public/ are always preserved from local.
#
# Usage:
#   bash scripts/sync-upstream.sh
#
set -euo pipefail

UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"
LOCAL_MAIN="main"
FEATURE_BRANCH="feature"
PROTECTED_DIRS=("content" "public")

# ── 0. Save current branch ────────────────────────────────────────────────────
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

cleanup() {
  echo "↩  Returning to branch: $ORIGINAL_BRANCH"
  git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
}
trap cleanup EXIT

# ── 1. Fetch upstream ─────────────────────────────────────────────────────────
echo "🔄 Fetching $UPSTREAM_REMOTE/$UPSTREAM_BRANCH ..."
git fetch "$UPSTREAM_REMOTE"

# ── 2. Switch to main ─────────────────────────────────────────────────────────
git checkout "$LOCAL_MAIN"

# ── 3. Merge upstream without committing ──────────────────────────────────────
echo "🔀 Merging $UPSTREAM_REMOTE/$UPSTREAM_BRANCH (no-commit) ..."
git merge "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" --no-commit --no-ff || true

# ── 4. Restore protected directories (existing files) ─────────────────────────
for dir in "${PROTECTED_DIRS[@]}"; do
  if git ls-files --error-unmatch "$dir/" &>/dev/null 2>&1 || [ -d "$dir" ]; then
    echo "🛡  Restoring $dir/ from HEAD ..."
    git checkout HEAD -- "$dir/" 2>/dev/null || true
  fi
done

# ── 5. Remove new files upstream added inside protected directories ────────────
echo "🧹 Removing upstream-added files in protected directories ..."
for dir in "${PROTECTED_DIRS[@]}"; do
  # Staged new files (A status)
  git status --short | grep "^A  $dir" | awk '{print $2}' | while read -r f; do
    echo "   removed from index: $f"
    git rm --cached "$f"
  done
  # Untracked new files (?? status)
  git status --short | grep "^?? $dir" | awk '{print $2}' | while read -r f; do
    echo "   deleted untracked: $f"
    rm -rf "$f"
  done
done

# ── 6. Commit the sync ────────────────────────────────────────────────────────
if git diff --cached --quiet; then
  echo "✅ Nothing to commit — already up to date with upstream."
else
  git commit -m "sync: upstream code only, content and public preserved"
  echo "✅ Synced upstream code to $LOCAL_MAIN."
fi

# ── 7. Merge main into feature ────────────────────────────────────────────────
echo "🔗 Merging $LOCAL_MAIN into $FEATURE_BRANCH ..."
git checkout "$FEATURE_BRANCH"
git merge "$LOCAL_MAIN" --no-ff -m "merge: sync upstream code into $FEATURE_BRANCH"
echo "✅ $FEATURE_BRANCH is now up to date."

# ── 8. Push both branches ─────────────────────────────────────────────────────
echo "📤 Pushing $LOCAL_MAIN and $FEATURE_BRANCH to origin ..."
git push origin "$LOCAL_MAIN"
git push origin "$FEATURE_BRANCH"

echo ""
echo "🎉 Upstream sync complete."
echo "   main    → synced with upstream (code only)"
echo "   feature → merged from main"
