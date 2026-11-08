---
title: Monitoring, backup & security
level: "5"
description: The alarms that watch Sohei, the backups and the restore test, and the security controls I checked.
---

## Monitoring

The CloudWatch dashboard `Sohei` puts six graphs on one screen: CloudFront requests, CloudFront 5xx error rate, response time, server CPU, disk used and the health check (1 = up, 0 = down).

{% include evidence.html id="E-06" file="E-06-dashboard.png" captions="Top: CloudFront requests and 5xx errors, response time and server CPU|Bottom: disk used and the health check" caption="The Sohei dashboard over the last 24 hours (7 Nov 06:00 – 8 Nov 05:40 UTC): the health-check dip in the 7 Nov alert test, and the CPU and disk spikes from the 8 Nov disk-full test." %}

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

**Why these thresholds.** Most come from the starter alarm set in Appendix A of the project brief. One was changed for this server:

- **Health check, 2 failures in a row:** one slow page load should not wake anyone, but 30 minutes of failures means residents cannot use Sohei. A missing result also counts as down, because a dead check is as bad as a dead site.
- **CPU above 85% for 10 minutes:** this is the brief's value. Short spikes while Sohei answers are normal; 10 minutes of high CPU means a stuck or run-away process. It fired in the disk-full test, when a noisy container kept the CPU at 100%.
- **Memory above 90% for 5 minutes:** this is the brief's value. The server has 4 GB, and above 90% it starts swapping or Docker may stop a container.
- **Disk above 85% for 5 minutes:** the brief suggests 1 hour, but a container log can fill this 20 GB disk in minutes, so the period was cut to 5 minutes. The fault test showed that even 5 minutes is too slow for a very fast fill (see [Automation &amp; incident]({{ '/automation-incident.html' | relative_url }})).
- **Status check failed for 1 minute:** this is the brief's value. A failed status check always means a real problem with the server or the hardware under it, so there are no false alarms to filter out.
- **Budget at 85%, 100% or forecast over US$10:** the brief asks for an alarm when spend goes over budget. The 85% warning gives time to act before the limit.

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

{% include evidence.html id="E-08" files="E-08-alert-email.png" caption="The alarm in CloudWatch: sohei-health-down went into ALARM at 12:56:53 UTC on 7 Nov (20:56:53 UTC+8), which is when the alert email went out." %}

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
- **Recovery time (RTO): 2 minutes 31 seconds in a test.** On 8 November 2026 a backup taken 2 minutes after a marker chat was restored onto the laptop: download, empty the database, `mongorestore` (82 documents, 0 failed), start the app, log in and find the chat. A real recovery would take longer, because someone first has to notice the problem and build a new server.
- **The handbook:** a changed copy was uploaded, then the older S3 version was copied back over it. The file was identical to the original again 4 seconds later.

{% include evidence.html id="E-10" file="E-10-backups-s3.png" caption="Backup files in S3, with their times." %}

{% include evidence.html id="E-11" file="E-11-restore.png" caption="The restore command and the restored chat." %}

## Security

Every line below was checked live with a read-only command on 8 November 2026.

| Control | At the start | Now |
| --- | --- | --- |
| Root account | – | MFA is on, so a stolen password alone cannot open the account. |
| Everyday login | – | One IAM user, with MFA, is used instead of the root account. |
| Admin rights | – | Admin rights come only from the role `AdminRole`, which refuses anyone who has not used MFA, and its sessions last 1 hour. |
| Server rights | – | The server's role can only reach its own S3 bucket, its own parameters, CloudWatch and Systems Manager. |
| Secrets | A plain `.env` file on the laptop | The 6 secrets are encrypted in Parameter Store under `/sohei/`, read by the server at start-up, and never printed or put in git. |
| Server login | – | There is no SSH key and no port 22 rule, so the only way in is Systems Manager, which CloudTrail records. |
| Network | `localhost` only, plain HTTP | Visitors use HTTPS through CloudFront, and the server accepts port 80 from CloudFront's addresses only. |
| Server metadata | – | IMDSv2 is required, which blocks a common way of stealing the server's AWS keys. |
| Database | Inside Docker on the laptop | MongoDB, Meilisearch and the API are only on Docker's internal network. Only nginx is published, on port 80. |
| S3 bucket | – | All four public-access blocks are on, and files are encrypted and versioned. |
| Audit | – | CloudTrail records every action in every region (trail `sam10-trail`, logging on). |
| Sign-ups | Open | Sign-ups, social login and password reset are switched off, so strangers cannot use the AI quota. |
| Data sent to Gemini | – | Only the invented handbook and test questions are sent. No real people or addresses. |
| Secrets in git | – | A gitleaks scan of all 10 commits found no keys, passwords or tokens. |
{: .wide}

**Still weak:** CloudFront has no web application firewall (AWS WAF). Its minimum TLS version is the old `TLSv1`, because it uses the default CloudFront certificate. The IAM user still has one long-lived access key, which the command line uses to take on `AdminRole`.

{% include evidence.html id="E-12" file="E-12-iam-mfa.png" caption="IAM users with MFA turned on." %}

{% include evidence.html id="E-13" file="E-13-parameter-store.png" caption="Secret names in Parameter Store. Values hidden." %}
