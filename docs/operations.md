---
title: Monitoring, backup & security
level: "5"
description: How Sohei is watched, how its data is saved and brought back, and how it is locked down.
---

## Monitoring

The CloudWatch dashboard `Sohei` puts six graphs on one screen: CloudFront requests, CloudFront 5xx error rate, response time, server CPU, disk used and the health check (1 = up, 0 = down).

{% include evidence.html id="E-06" file="E-06-dashboard.png" caption="The Sohei dashboard with real data, including the dip during the alert test." %}

### The alarms

Every alarm emails the topic `sohei-alerts` when it fires and again when things are back to normal.

| Alarm | Fires when | What it means |
| --- | --- | --- |
| `sohei-health-down` | The health check fails 2 times in a row (2 × 15 min), or no result arrives | Residents cannot use Sohei |
| `sohei-cpu-high` | Server CPU is above 85% for 10 minutes | Sohei may be slow or stuck |
| `sohei-memory-high` | Memory is above 90% for 5 minutes | The server may start swapping or stopping containers |
| `sohei-disk-high` | The disk is more than 85% full for 5 minutes | When the disk is full, Sohei and MongoDB stop working |
| `sohei-status-check-failed` | An EC2 status check fails for 1 minute | The server or the hardware under it has a problem |
| AWS Budget | Spend reaches 85% or 100% of US$10 a month, or the forecast passes 100% | The bill is heading over the limit |
{: .wide}

{% include todo.html text="Why each threshold was chosen, one sentence each, in my own words" %}

Cost alerts use an AWS Budget, not a CloudWatch billing alarm. The AWS Organization this account belongs to blocks the `us-east-1` region, where billing alarms have to live.

{% include evidence.html id="E-07" file="E-07-alarms.png" caption="All five CloudWatch alarms in the OK state." %}

### A real alert

To prove the alerts work, the app was stopped on purpose on 7 November 2026 and nobody touched anything until the email arrived. Each bar below is drawn to scale: its length is the real time.

<div class="timeline" role="img" aria-label="Timeline: app down for 16 minutes 37 seconds before the alarm fired, alarm on for 21 minutes 49 seconds until the restart, then 8 minutes 11 seconds until the alarm returned to OK.">
  <div class="timeline-bar">
    <span class="seg-down" style="flex: 997">Down, not yet noticed · 16 min 37 s</span>
    <span class="seg-alarm" style="flex: 1309">Alarm on, email sent · 21 min 49 s</span>
    <span class="seg-recover" style="flex: 491">Restarted · 8 min 11 s</span>
  </div>
  <ol class="timeline-legend">
    <li><span class="t k-down">20:40:16</span>App stopped<small>down, not yet noticed: 16 min 37 s</small></li>
    <li><span class="t k-alarm">20:56:53</span>Alarm fired, email sent<small>alarm on: 21 min 49 s</small></li>
    <li><span class="t k-recover">21:18:42</span>App restarted<small>waiting for OK: 8 min 11 s</small></li>
    <li><span class="t k-end">21:26:53</span>Alarm back to OK, email sent</li>
  </ol>
</div>

Times are UTC+8. **Time to detect: 16 minutes 37 seconds.** The health check runs only every 15 minutes, so a fault can go unseen for up to 15 minutes before the first failed check.

{% include evidence.html id="E-08" file="E-08-alert-email.png" caption="The alert email, with its date and time." %}

### The request log

Every 5 minutes a script on the server reads the new answers from the database and writes one line per answer to the log group `/sohei/requests`: the time, the first 200 characters of the question and of the answer, the seconds it took, whether it worked, the app version and the model. Three filters turn those lines into the metrics for response time, number of requests and failed requests.

The first two lines it logged:

| Question | Seconds | Worked |
| --- | --- | --- |
| When is bin day? | <span class="t">2.74</span> | Yes |
| A question about which unit a resident lives in (refused, as it should be) | <span class="t">1.31</span> | Yes |

{% include evidence.html id="E-09" file="E-09-request-log.png" caption="Request log lines in CloudWatch." %}

## Backup & restore

| What must come back | Where it is kept | How it comes back |
| --- | --- | --- |
| The database: chats and accounts | `s3://sohei-909927/backups/`, every 6 hours (00:00, 06:00, 12:00, 18:00 UTC) | `mongorestore` from the latest backup |
| The building handbook | S3, with versioning on | Copy an older version back |
| The secrets | Parameter Store, `/sohei/` | They never leave AWS. Only their names are written down |
| Config and scripts | This git repository | Upload to S3 and restart the service |
{: .wide}

- Backups older than 7 days are deleted automatically.
- The first backup ran by hand on 7 Nov 2026 at <span class="t">12:06 UTC</span> to test the script: 13.6 KB, uploaded OK.
- **Recovery point (RPO): up to 6 hours.** At worst, the chats from the last 6 hours are lost.
- **Recovery time (RTO):** {% include todo.html text="Restore time in minutes – after Day 2 Part B" %}

<div class="plates">
{% include evidence.html id="E-10" file="E-10-backups-s3.png" caption="Backup files in S3, with their times." %}
{% include evidence.html id="E-11" file="E-11-restore.png" caption="The restore command and the restored chat." %}
</div>

## Security

| Control | At the start | Now |
| --- | --- | --- |
| Root account | – | MFA on |
| Everyday login | – | An IAM user with MFA |
| Admin rights | – | Only through the role `AdminRole`, which needs MFA |
| Secrets | A plain `.env` file on the laptop | Parameter Store, encrypted. Read by the server at start-up, never printed, never in git |
| Server login | – | No SSH, no key pair. Commands only through Systems Manager |
| Network | `localhost` only, plain HTTP | HTTPS through CloudFront. The server accepts port 80 from CloudFront only |
| Database | – | {% include todo.html text="MongoDB not reachable from outside – check live" %} |
| S3 bucket | – | All public access blocked, encrypted, versioned |
| Audit | – | CloudTrail records every action |
| Sign-ups | Open | Closed. A sign-up attempt gets "403 Forbidden" |
| Data sent to Gemini | – | Invented building data only. No real people or addresses |
{: .wide}

{% include todo.html text="Check each line live and write one sentence per control – Day 2 Part D" %}

<div class="plates">
{% include evidence.html id="E-12" file="E-12-iam-mfa.png" caption="IAM users with MFA turned on." %}
{% include evidence.html id="E-13" file="E-13-parameter-store.png" caption="Secret names in Parameter Store. Values hidden." %}
</div>
