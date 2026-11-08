---
title: Automation & incident
level: "6"
description: Two jobs run on a timer. One planned fault filled the disk with a container log.
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

Both jobs keep running on their own. Before Day 2 started (8 Nov 2026), the log showed:

- **Backup:** automatic runs on 7 Nov at <span class="t">18:00:01</span> and 8 Nov at <span class="t">00:00:01 UTC</span>, about 14 KB each, both `backup OK`.
- **Health check:** 4 results an hour for the whole 24 hours, all "up" except during the planned alert test on 7 Nov (<span class="t">12:40–13:18 UTC</span>).

{% include evidence.html id="E-14" files="E-14-backup-runs.png,E-14-healthcheck-runs.png" captions="Backups made by the schedule|Health-check runs" caption="Both automations running by themselves, with timestamps." %}

## The incident: a full disk

**What happened:** Docker keeps every container's output in a log file, and by default that file has no size limit. A test container that writes a line non-stop grows its log until the disk is full. When the disk is full, MongoDB and the app can no longer save anything.

This was a planned fault on the live server on 8 November 2026, right after a fresh backup. A safety script stopped the test containers at 90% so the disk never reached 100%.

It ran twice:

- **Round 1** filled the disk as fast as possible. The disk jumped from 79% to 91% in about 4 minutes. The disk alarm needs the disk to be above 85% on **average for 5 minutes**, so the safety script stopped the fault before the alarm could fire. The CPU alarm did fire, because the noisy containers kept the processor at 100%.
- **Round 2** filled the disk to 87% and held it there, so the disk alarm could do its job.

### Timeline

| Step | Round 1 (UTC) | Round 2 (UTC) |
| --- | --- | --- |
| Fault started | <span class="t">02:06:01</span> | <span class="t">02:50:12</span> |
| Disk passed 85% | about <span class="t">02:42</span> | about <span class="t">02:54</span> |
| First alarm | `sohei-cpu-high` <span class="t">02:16:18</span> | `sohei-disk-high` <span class="t">02:58:53</span> |
| Noticed (email arrived) | <span class="t">02:16</span> | <span class="t">02:58</span> |
| Fault stopped, space back | <span class="t">02:42:59</span>, by the 90% safety script | <span class="t">03:02:11</span>, by hand |
| Fix in place (log limit) | | <span class="t">03:06:30</span> |
| Fix proven | | <span class="t">03:12:05–03:17:19</span> |
{: .wide}

- **Time to detect** (fault started to alarm): **8 min 41 s** in round 2 (about 5 minutes after the disk passed 85%). In round 1 the disk alarm never fired. Only the CPU alarm fired, after **10 min 17 s**.
- **Time to fix** (alarm to fixed): **3 min 18 s** to get the space back. **7 min 37 s** until the permanent fix was in place.
- The site stayed up during both rounds. Installing the fix took the site offline for **about 1 minute** (03:05:12 to 03:06:05) while Docker restarted.

### Root cause

These commands found the cause (full output in `docs/notes/fault-evidence.md`):

| Command | What it showed |
| --- | --- |
| `df -h /` | The disk was 88% full |
| `du -sh /var/lib/docker/containers/*` | Several container folders of 1.1 GB each |
| `docker system df` | Containers themselves used only 2.4 kB, because Docker does not count log files here |
| `ls -lhS …/*-json.log` | One `-json.log` file of 1.1 GB per noisy container |
{: .wide}

**Root cause:** Docker's default log driver (`json-file`) has no size limit. One chatty container can keep writing until the disk is full.

### Fix and prevention

1. **Fix:** remove only the noisy container (`docker rm -f <name>`), never the four Sohei containers. The disk went from 88% back to 46% at once.
2. **Prevention:** a Docker setting, `deploy/daemon.json`, now limits every container to 3 log files of 10 MB each. `bootstrap.sh` installs it on any new server. After a Docker restart, the Sohei containers were recreated so the limit applies to them too.
3. **Proof:** the same noisy container ran again for 5 minutes (<span class="t">03:12:05–03:17:19</span>). Its log stopped at **23 MB in 3 files**, and the disk stayed at **46%** the whole time.

**Lesson learned:** after a Docker restart, `docker compose … up -d --force-recreate` stopped part-way and left MongoDB stopped, so the site returned a 502 error for about 40 seconds. Running `up -d` again fixed it. The runbook now says to check that all 4 containers are running.

{% include evidence.html id="E-15" files="E-15-fault-disk.png,E-15-fault-fix.png" captions="Investigating the full disk|After the fix: the disk graph (12 hours, UTC) rises during the fault around 02:00–03:00, then stays flat at 46%, including the 5-minute proof test at 03:12" caption="The disk-full fault: the investigation, and the disk staying flat after the fix." %}

{% include evidence.html id="E-08" n="2" files="E-08-alert-email-2.png,E-08-alert-email-3.png,E-08-alert-email-4.png" captions="Round 1: the CPU alarm, 02:16:18 UTC|Round 2: the disk alarm, 10:58 am UTC+8 (02:58 UTC)|Round 2: the disk alarm back to OK, 11:03 am UTC+8 (03:03 UTC)" caption="The alarm emails from the disk-full test." %}

The steps to follow next time are in the **[runbook: disk full]({{ '/runbook.html' | relative_url }})**.
