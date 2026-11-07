#!/bin/bash
# Sohei ops setup: CloudWatch agent, cron, log folders. Runs as root. Safe to run again.
set -euo pipefail

APP_DIR="/opt/sohei/app"

# Tools
dnf install -y amazon-cloudwatch-agent cronie
systemctl enable --now crond

# Log and state folders
mkdir -p /var/log/sohei /var/lib/sohei
touch /var/log/sohei/requests.log /var/log/sohei/backup.log /var/log/sohei/request_log.err

# Scheduled jobs
install -m 644 "$APP_DIR/ops/sohei.cron" /etc/cron.d/sohei

# CloudWatch agent: load our config and (re)start it
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s -c "file:$APP_DIR/ops/cloudwatch-agent.json"

echo "Sohei ops set up"
