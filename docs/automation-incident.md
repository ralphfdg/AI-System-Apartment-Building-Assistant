---
title: Automation & incident
level: "6"
description: The two jobs that run by themselves, and the planned fault where a log file fills the disk.
---

## The two automations

| | Backup | Health check |
| --- | --- | --- |
| What it does | Dumps the MongoDB database, compresses it and uploads it to S3 | Loads the live site through CloudFront. Sends 1 (up) or 0 (down) to CloudWatch |
| When | Every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC | Every 15 minutes |
| What starts it | `cron` on the server (`ops/sohei.cron`) | EventBridge Scheduler starts the Lambda `sohei-healthcheck` |
| Where it logs | `/sohei/ops`, one line per run: OK with size, or FAILED with the reason | `/aws/lambda/sohei-healthcheck`, one line per check |
| If it fails | The line says FAILED | The alarm `sohei-health-down` emails the owner |
| First run | 7 Nov 2026, <span class="t">12:06 UTC</span>, by hand: OK, 13.6 KB | 7 Nov 2026, by hand: answered in 385 ms |
{: .wide}

A third, smaller job runs every 5 minutes: the request logger, described under [Monitoring]({{ '/operations.html' | relative_url }}#the-request-log).

{% include todo.html text="Last automatic runs of both jobs, with times – screenshots E-14" %}

<div class="plates">
{% include evidence.html id="E-14" n="1" file="E-14-backup-runs.png" caption="Backups made by the schedule, with timestamps." %}
{% include evidence.html id="E-14" n="2" file="E-14-healthcheck-runs.png" caption="Health-check runs, with timestamps." %}
</div>

## The incident: a full disk

**What will happen:** Docker keeps every container's output in a log file. By default that file has no size limit. A test container that writes a line non-stop will grow its log until the disk is full, and then the app can no longer save anything.

This is a planned fault. It runs in Day 2 Part C, right after a fresh backup, and stops at 90% disk or when the alarm fires, whichever comes first.

### Timeline

| Step | Time (UTC) |
| --- | --- |
| Fault started | {% include todo.html text="Time" %} |
| Alarm `sohei-disk-high` fired | {% include todo.html text="Time" %} |
| Noticed | {% include todo.html text="Time" %} |
| Fault stopped | {% include todo.html text="Time" %} |
| Fix in place | {% include todo.html text="Time" %} |
| Fix proven | {% include todo.html text="Time" %} |

- **Time to detect:** {% include todo.html text="Minutes from fault to alarm" %}
- **Time to fix:** {% include todo.html text="Minutes from alarm to fixed" %}

### Root cause

{% include todo.html text="Root cause, from the investigation in docs/notes/fault-evidence.md" %}

### Fix and prevention

{% include todo.html text="What was changed, and proof the disk stays flat" %}

<div class="plates">
{% include evidence.html id="E-15" n="1" file="E-15-fault-disk.png" caption="Investigating the full disk." %}
{% include evidence.html id="E-15" n="2" file="E-15-fault-fix.png" caption="After the fix: the log stops growing." %}
</div>

The steps to follow next time are in the **[runbook: disk full]({{ '/runbook.html' | relative_url }})**.
