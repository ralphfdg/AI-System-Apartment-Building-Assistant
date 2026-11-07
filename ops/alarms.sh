#!/bin/bash
# Sohei alarms. Creates (or updates) the five CloudWatch alarms. Safe to run again.
# Run from a laptop: bash ops/alarms.sh
# Needs the SNS topic sohei-alerts (ap-southeast-2) with a confirmed email subscription.
#
# Cost alert: not a CloudWatch alarm. This account is in an AWS Organization whose rules (SCPs)
# block us-east-1, and billing alerts are controlled by the organization's payer account.
# The AWS Budget "My Monthly Cost Budget" (US$10/month) emails at 85% and 100% of actual
# spend and at 100% of forecast spend instead.
set -euo pipefail

ACCOUNT="411145868626"
INSTANCE="i-0f42c5b9e0e88a6ee"
SYD="--profile ai-sys-sam10-admin --region ap-southeast-2"
TOPIC="arn:aws:sns:ap-southeast-2:$ACCOUNT:sohei-alerts"
TAGS="Key=Project,Value=SAM10 Key=Owner,Value=Ethan"

# Every alarm emails when it fires (ALARM) and when it recovers (OK).
alarm() {
  local region_args="$1"; local topic="$2"; shift 2
  aws cloudwatch put-metric-alarm $region_args --alarm-actions "$topic" --ok-actions "$topic" --tags $TAGS "$@"
}

alarm "$SYD" "$TOPIC" --alarm-name sohei-cpu-high \
  --alarm-description "Server CPU above 85% for 10 minutes (2 x 5 min). Sohei may be slow or stuck." \
  --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=$INSTANCE \
  --statistic Average --period 300 --evaluation-periods 2 --threshold 85 --comparison-operator GreaterThanThreshold \
  --treat-missing-data missing

alarm "$SYD" "$TOPIC" --alarm-name sohei-status-check-failed \
  --alarm-description "EC2 status check failed for 1 minute. The server or its hardware has a problem." \
  --namespace AWS/EC2 --metric-name StatusCheckFailed --dimensions Name=InstanceId,Value=$INSTANCE \
  --statistic Maximum --period 60 --evaluation-periods 1 --threshold 0 --comparison-operator GreaterThanThreshold \
  --treat-missing-data missing

alarm "$SYD" "$TOPIC" --alarm-name sohei-disk-high \
  --alarm-description "Disk / above 85% for 5 minutes. When the disk is full, Sohei and MongoDB stop working." \
  --namespace CWAgent --metric-name disk_used_percent \
  --dimensions Name=path,Value=/ Name=InstanceId,Value=$INSTANCE Name=fstype,Value=xfs \
  --statistic Average --period 300 --evaluation-periods 1 --threshold 85 --comparison-operator GreaterThanThreshold \
  --treat-missing-data missing

alarm "$SYD" "$TOPIC" --alarm-name sohei-memory-high \
  --alarm-description "Memory above 90% for 5 minutes. The server may start swapping or killing containers." \
  --namespace CWAgent --metric-name mem_used_percent --dimensions Name=InstanceId,Value=$INSTANCE \
  --statistic Average --period 300 --evaluation-periods 1 --threshold 90 --comparison-operator GreaterThanThreshold \
  --treat-missing-data missing

alarm "$SYD" "$TOPIC" --alarm-name sohei-health-down \
  --alarm-description "Health check failed 2 times in a row (2 x 15 min), or no check result arrived. Residents cannot use Sohei." \
  --namespace Sohei --metric-name HealthCheckOK \
  --statistic Minimum --period 900 --evaluation-periods 2 --threshold 1 --comparison-operator LessThanThreshold \
  --treat-missing-data breaching

echo "Five alarms created or updated."
