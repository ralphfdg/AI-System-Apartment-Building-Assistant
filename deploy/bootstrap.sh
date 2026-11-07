#!/bin/bash
# Sohei first-boot setup for Amazon Linux 2023. Runs once as root, from EC2 user data.
# Usage: bootstrap.sh <bucket name>
# Output goes to /var/log/sohei-bootstrap.log. This script handles no secrets.
set -euo pipefail

BUCKET="$1"
LIBRECHAT_TAG="v0.8.9-rc1"
COMPOSE_VERSION="v2.29.7"
export AWS_DEFAULT_REGION="ap-southeast-2"

exec >> /var/log/sohei-bootstrap.log 2>&1
echo "$(date -u +%FT%TZ) bootstrap started"

# Docker and git
dnf install -y docker git
systemctl enable --now docker

# Docker Compose v2 plugin
mkdir -p /usr/local/lib/docker/cli-plugins
curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# 2 GB swap file, so a memory spike slows the server instead of crashing it
if [ ! -f /swapfile ]; then
  dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

# LibreChat at the same version as local
mkdir -p /opt/sohei
if [ ! -d /opt/sohei/LibreChat ]; then
  git clone --depth 1 --branch "$LIBRECHAT_TAG" https://github.com/LibreChat-AI/LibreChat /opt/sohei/LibreChat
fi

# Our files from S3
echo "SOHEI_BUCKET=$BUCKET" > /etc/sohei.conf
aws s3 sync "s3://$BUCKET/app/" /opt/sohei/app/ --only-show-errors

# Start Sohei now and at every boot
cp /opt/sohei/app/deploy/sohei.service /etc/systemd/system/sohei.service
systemctl daemon-reload
systemctl enable sohei
systemctl start sohei

echo "$(date -u +%FT%TZ) bootstrap finished"
