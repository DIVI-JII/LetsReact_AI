#!/usr/bin/env bash
# Backup of the production (or any) PostgreSQL database using its connection URL.
#   DATABASE_URL="postgresql://..." ./scripts/backup.sh
# Use Render's EXTERNAL database URL when running from your own machine. Needs pg_dump (PostgreSQL client tools).
# Keeps the newest $KEEP dumps in ./backups (git-ignored). Copy them off this machine as well.
# Render also offers managed backups/point-in-time recovery on paid database plans; prefer those for production.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${DATABASE_URL:?Set DATABASE_URL to the database connection URL}"
KEEP="${KEEP:-14}"
mkdir -p backups
umask 077
out="backups/LetsReact_AI-$(date +%Y%m%d-%H%M%S).sql.gz"
# sslmode=require is added for remote hosts if the URL does not already choose one.
url="$DATABASE_URL"
case "$url" in *sslmode=*|*localhost*|*127.0.0.1*) ;; *) url="${url}$([[ "$url" == *\?* ]] && echo '&' || echo '?')sslmode=require" ;; esac
pg_dump "$url" --no-owner --no-privileges | gzip > "$out"
# A truncated dump is worse than none: verify it is a readable gzip with content.
gzip -t "$out" && [ "$(gzip -dc "$out" | wc -c)" -gt 1000 ]
ls -1t backups/LetsReact_AI-*.sql.gz | tail -n +"$((KEEP + 1))" | xargs -r rm --
echo "$(date -Is) backup ok: $out"
