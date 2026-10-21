#!/usr/bin/env bash
# Restore a dump into an EMPTY database:
#   DATABASE_URL="postgresql://..." ./scripts/restore.sh backups/LetsReact_AI-XXXX.sql.gz
# Stop (suspend) the API first so nothing writes during the restore, then resume it afterwards.
# This never drops anything: restoring into a database that already has the tables will fail on purpose.
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -eq 1 ] || { echo "usage: DATABASE_URL=... $0 <dump.sql.gz>"; exit 1; }
: "${DATABASE_URL:?Set DATABASE_URL to the database connection URL}"
url="$DATABASE_URL"
case "$url" in *sslmode=*|*localhost*|*127.0.0.1*) ;; *) url="${url}$([[ "$url" == *\?* ]] && echo '&' || echo '?')sslmode=require" ;; esac
gzip -dc "$1" | psql "$url" -v ON_ERROR_STOP=1
