#!/bin/bash
# Deploy Agent -- Auto-deploys to Vercel when changes are detected

LOG_FILE="/home/litbit/LiTTreeLabstudios/agents/logs/deploy-$(date +%Y%m%d).log"
PROJECT_DIR="/home/litbit/LiTTreeLabstudios"
ENV_FILE="${HOME}/.config/littree/deploy.env"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Deploy Agent Starting ==="

cd "$PROJECT_DIR"

# Load env vars if present (Supabase service role key, Discord webhook, etc.)
if [ -f "$ENV_FILE" ]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

# Ensure PATH includes Node/npm for npx
export PATH="/home/litbit/.nvm/versions/node/v22.22.3/bin:$PATH"

# Gather deploy metadata
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
commit_sha=$(git rev-parse HEAD 2>/dev/null || echo "")

# Check for uncommitted changes
changes=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$changes" -gt 0 ]; then
  log "Found $changes uncommitted changes, committing..."
  git add -A
  git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')" --no-verify 2>/dev/null
fi

# Record deploy start
node "${PROJECT_DIR}/scripts/record-deployment.mjs" "building" "$branch" "$commit_sha" "production" "" "" 2>/dev/null || true

# Push to trigger Vercel auto-deploy
log "Pushing to origin/main..."
if ! git push origin main 2>&1 | tee -a "$LOG_FILE"; then
  log "ERROR: Git push failed"
  node "${PROJECT_DIR}/scripts/record-deployment.mjs" "failed" "$branch" "$commit_sha" "production" "" "git push failed" 2>/dev/null || true
  exit 1
fi

# Also deploy directly via Vercel CLI as backup
log "Running Vercel deploy..."
set +e
vercel_output=$(/home/litbit/.nvm/versions/node/v22.22.3/bin/npx vercel --prod --yes 2>&1)
vercel_exit=$?
set -e

echo "$vercel_output" | tee -a "$LOG_FILE"

# Try to extract deploy URL from Vercel output
deploy_url=$(echo "$vercel_output" | grep -oE 'https://[^ ]+\.vercel\.app' | head -n 1)

if [ "$vercel_exit" -eq 0 ]; then
  log "Deploy triggered successfully"
  node "${PROJECT_DIR}/scripts/record-deployment.mjs" "live" "$branch" "$commit_sha" "production" "$deploy_url" "" 2>/dev/null || true
else
  log "ERROR: Vercel deploy failed"
  node "${PROJECT_DIR}/scripts/record-deployment.mjs" "failed" "$branch" "$commit_sha" "production" "$deploy_url" "vercel deploy failed" 2>/dev/null || true
  exit 1
fi
