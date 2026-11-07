#!/bin/bash
# Sohei backup (automation 1). Runs every 6 hours from cron, as root.
# Dumps MongoDB, uploads it to s3://<bucket>/backups/, and writes one line to /var/log/sohei/backup.log.
# S3 deletes backups after 7 days (lifecycle rule).
set -uo pipefail

source /etc/sohei.conf
export AWS_DEFAULT_REGION="ap-southeast-2"

LOG="/var/log/sohei/backup.log"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="/tmp/sohei-$STAMP.archive.gz"
KEY="backups/sohei-$STAMP.archive.gz"
ERR="/tmp/sohei-backup.err"

log() { echo "$(date -u +%FT%TZ) $*" >> "$LOG"; }
fail() { log "backup FAILED $1"; rm -f "$FILE" "$ERR"; exit 1; }

# 1. Dump the database from the private Mongo container
docker exec chat-mongodb mongodump --archive --gzip --quiet > "$FILE" 2> "$ERR" \
  || fail "mongodump: $(tail -n 1 "$ERR")"
[ -s "$FILE" ] || fail "mongodump: empty file"

# 2. Upload to S3
aws s3 cp "$FILE" "s3://$SOHEI_BUCKET/$KEY" --only-show-errors 2> "$ERR" \
  || fail "upload: $(tail -n 1 "$ERR")"

# 3. Record the result
BYTES="$(stat -c %s "$FILE")"
SIZE="$(awk -v b="$BYTES" 'BEGIN { if (b < 1048576) printf "%.1f KB", b/1024; else printf "%.1f MB", b/1048576 }')"
log "backup OK $SIZE s3://$SOHEI_BUCKET/$KEY"
rm -f "$FILE" "$ERR"
