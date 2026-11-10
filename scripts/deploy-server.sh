#!/usr/bin/env bash
# Build and publish the Makuruma web app on the VPS.
#
# Run it on the server from the frontend folder:
#   cd /var/www/makuruma/<frontend-folder>
#   bash scripts/deploy-server.sh            # deploys origin/main
#   bash scripts/deploy-server.sh my-branch
#
# The app now uses pnpm (pinned in package.json); corepack, which ships with Node, provides it.
# The build goes to dist/ in this folder. If Nginx serves another folder, set WEB_ROOT:
#   WEB_ROOT=/var/www/makuruma/html bash scripts/deploy-server.sh
set -euo pipefail

BRANCH="${1:-main}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

# Files stay owned by the normal server user even when this runs as root (e.g. Hostinger's browser terminal).
OWNER="${OWNER:-$( [ "$(id -u)" = 0 ] && echo collins || whoami )}"
if [ "$(id -u)" = 0 ]; then
  export COMPOSER_ALLOW_SUPERUSER=1
  git config --global --get-all safe.directory | grep -qx "$APP_DIR" || git config --global --add safe.directory "$APP_DIR"
fi

step() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
fail() { printf '\033[1;31m✖ %s\033[0m\n' "$1"; exit 1; }

cd "$APP_DIR"
[ -f package.json ] || fail "Run this from the frontend folder (package.json not found)."

step "1/4 Code: origin/$BRANCH ($(git remote get-url origin))"
git rev-parse HEAD > "$HOME/makuruma-frontend-previous-commit-$STAMP.txt" 2>/dev/null || true
[ -d dist ] && tar -czf "$HOME/makuruma-frontend-dist-$STAMP.tgz" dist
git fetch origin "$BRANCH"
git checkout -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
git log --oneline -1

step "2/4 Production API URL"
[ -f .env.production ] || fail ".env.production is missing."
grep -q '^VITE_API_BASE_URL=https://api.makurmalogstics.com/api' .env.production \
  || fail ".env.production must contain VITE_API_BASE_URL=https://api.makurmalogstics.com/api"
cat .env.production

step "3/4 Install and build (pnpm)"
command -v node >/dev/null || fail "Node.js is not installed."
corepack enable 2>/dev/null || sudo corepack enable
pnpm install --frozen-lockfile
pnpm build

step "4/4 Publish"
if [ -n "${WEB_ROOT:-}" ] && [ "$WEB_ROOT" != "$APP_DIR/dist" ]; then
  sudo mkdir -p "$WEB_ROOT"
  sudo rsync -a --delete dist/ "$WEB_ROOT/"
  sudo chown -R www-data:www-data "$WEB_ROOT"
  echo "  copied dist/ → $WEB_ROOT"
else
  echo "  built into $APP_DIR/dist (Nginx root should point here)"
fi
sudo chown -R "$OWNER":www-data "$APP_DIR"
sudo nginx -t && sudo systemctl reload nginx

printf '\n\033[1;32m✔ Web app deployed (%s).\033[0m\n' "$(git rev-parse --short HEAD)"
echo "  Previous build saved as ~/makuruma-frontend-dist-$STAMP.tgz (if there was one)."
