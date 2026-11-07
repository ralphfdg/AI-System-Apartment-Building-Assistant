#!/bin/bash
# Sohei start-up. Runs as root at every server start, through sohei.service.
# It gets the latest files from S3, builds .env from Parameter Store, and starts the containers.
# Never add "set -x" here: it would print the secrets into the logs.
set -euo pipefail

source /etc/sohei.conf
export AWS_DEFAULT_REGION="ap-southeast-2"

APP_DIR="/opt/sohei/app"
LIBRECHAT_DIR="/opt/sohei/LibreChat"

# 1. Latest files from S3
aws s3 sync "s3://$SOHEI_BUCKET/app/" "$APP_DIR/" --delete --only-show-errors
aws s3 sync "s3://$SOHEI_BUCKET/content/" /opt/sohei/content/ --delete --only-show-errors

# 2. Settings and secrets from Parameter Store (stop here if this fails)
PARAMS="$(aws ssm get-parameters-by-path --path /sohei/ --with-decryption \
  --query 'Parameters[].[Name,Value]' --output text)"

for required in GOOGLE_KEY CREDS_KEY CREDS_IV JWT_SECRET JWT_REFRESH_SECRET MEILI_MASTER_KEY DOMAIN ALLOW_REGISTRATION; do
  if ! grep -q "^/sohei/$required"$'\t' <<< "$PARAMS"; then
    echo "Missing parameter /sohei/$required" >&2
    exit 1
  fi
done

# 3. Build .env. mktemp makes the file readable by root only.
cd "$LIBRECHAT_DIR"
NEW_ENV="$(mktemp "$LIBRECHAT_DIR/.env.XXXXXX")"
trap 'rm -f "$NEW_ENV"' EXIT
cat .env.example > "$NEW_ENV"

# Replace one setting: remove its line, then add the new value. Prints nothing.
set_env() {
  sed -i "/^#\?[[:space:]]*$1=/d" "$NEW_ENV"
  printf '%s=%s\n' "$1" "$2" >> "$NEW_ENV"
}

while IFS=$'\t' read -r name value; do
  key="${name##*/}"
  if [ "$key" = "DOMAIN" ]; then
    set_env DOMAIN_CLIENT "$value"
    set_env DOMAIN_SERVER "$value"
  else
    set_env "$key" "$value"
  fi
done <<< "$PARAMS"

set_env APP_TITLE "Sohei"

chmod 600 "$NEW_ENV"
mv "$NEW_ENV" .env

# 4. Folders the app writes to. The app runs as user 1000 inside its container.
mkdir -p logs uploads images skill
chown -R 1000:1000 logs uploads images skill

# 5. Start the containers. Recreate the app and nginx so they pick up new files.
COMPOSE=(docker compose -f deploy-compose.yml -f "$APP_DIR/deploy/docker-compose.aws.yml")
"${COMPOSE[@]}" up -d mongodb meilisearch
"${COMPOSE[@]}" up -d --force-recreate --no-deps api client

echo "Sohei started"
