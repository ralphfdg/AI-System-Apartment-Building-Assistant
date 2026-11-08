# Day 2 – raw facts (Parts B–D)

Raw times, commands and outputs only. The student writes the explanations in their own words.
All times UTC unless marked otherwise (local time = UTC+8). No secrets in this file.

## Before Day 2 – automations checked (8 Nov 2026)

| What | Result |
| --- | --- |
| Backups in `s3://sohei-909927/backups/` | `sohei-20261107T120658Z` (by hand, test), `sohei-20261107T180001Z` (auto), `sohei-20261108T000001Z` (auto), about 14 KB each |
| `/sohei/ops` | `backup OK` lines at 2026-11-07 18:00 and 2026-11-08 00:00 |
| `Sohei/HealthCheckOK` | 4 results per hour for 24 h, all 1 except during the alert test (7 Nov 12:40–13:18) |
| Alarms | All 5 `OK` |
| Request logger errors | Only 7 Nov 12:00–13:59, while the app was stopped for the alert test. None since |

## Part B – restore test

### What must come back

| What | Where it is kept | How it comes back |
| --- | --- | --- |
| MongoDB data (chats, accounts) | `s3://sohei-909927/backups/`, every 6 hours, kept 7 days | `mongorestore --archive --gzip --drop` |
| Building handbook | `s3://sohei-909927/content/building-handbook.md`, S3 versioning on | Copy an older version ID back over the file |
| Secrets | Parameter Store `/sohei/` (names only in `deploy/aws-resources.md`) | Stay in AWS; the server reads them at start-up |
| Config and scripts | Git repo (`config/`, `deploy/`, `ops/`), copied to `s3://sohei-909927/app/` | Upload to S3, restart the service |

### Marker question

- Asked on the live site: 8 Nov 2026, about 09:45 local (01:45 UTC)
- Text: `restore test 2026-11-08 9:45`
- Sohei answered (said it is not in the handbook and gave the manager contact). The answer does not matter; the chat is the marker.

### Backup used

- Run by hand: SSM Run Command `ddcd4489-300b-4c51-9f48-6572e65e9055`, `AWS-RunShellScript`, `/bin/bash /opt/sohei/app/ops/backup.sh`, status `Success`
- File: `s3://sohei-909927/backups/sohei-20261108T014757Z.archive.gz` (14,958 bytes), 01:47:57 UTC, 2 minutes after the marker question

### Timer

| Step | Time (UTC) |
| --- | --- |
| Timer started | 01:49:21 |
| Backup downloaded (`aws s3 cp` to `sam10/restore-test/`) | 01:49:24 |
| Local database emptied (`docker compose down`, `data-node` renamed to `data-node-before-restore`, Mongo started fresh, 0 collections) | 01:50:06 |
| `mongorestore --archive --gzip --drop` finished: "82 document(s) restored successfully. 0 document(s) failed to restore." | 01:50:36 |
| Full local stack started; check in Mongo: 1 user, 2 conversations, marker message present | 01:50:40 |
| Marker chat found by the student at `http://localhost:3080`, logged in with the live account | 01:51:52 |
| **Total (measured restore time)** | **2 min 31 s** (151 s) |

- What the 2 min 31 s covers: download, emptying the database, `mongorestore`, starting the app, logging in and finding the chat.
- What it does not cover: noticing the problem, deciding to restore, or building a new server (the restore went onto the laptop, which was already set up).

- RPO: up to 6 hours (backup every 6 hours).

### RPO and RTO sentences (drafted by Claude at the student's request – student to check and edit)

- **RPO:** The database is backed up to S3 every 6 hours, so if the server is lost, at most the last 6 hours of chats are lost.
- **RTO:** In a test on 8 November 2026, a backup was restored onto a laptop and the test chat was back in 2 minutes 31 seconds; a real recovery would take longer, because someone first has to notice the problem and set up a new server.

### S3 version test (8 Nov 2026)

File: `s3://sohei-909927/content/building-handbook.md`

| Time (UTC) | Step | Version ID | Size |
| --- | --- | --- | --- |
| 7 Nov 08:13:07 | Original handbook | `ycB4i9ektaL.1_IJ8m7mIy2cjZgvMdwR` | 1103 bytes |
| 8 Nov 01:55:07 | Changed copy uploaded (one test line added) | `_GCvh1Wtm6xIz48QzUuCi8uNFAA8IAJg` | 1161 bytes |
| 8 Nov 01:55:11 | Original copied back over it (`aws s3api copy-object --copy-source "<bucket>/<key>?versionId=ycB4…"`) | `GxP48SlV14HmnXmjySIRHFu8Kd80AMCR` | 1103 bytes |

- Check: downloaded the current file and compared it with the original (`cmp`): identical.
- Time from bad upload to fixed: 4 seconds. All three versions stay in the list.

## Part C – disk-full fault

### Before the fault

- Safety backup by hand: SSM `ab5bc2a7-2ef6-4c1c-8cdf-e228b7ee2d2b`, `Success`, file `sohei-20261108T020538Z.archive.gz` (15,001 bytes) in S3.
- Docker log settings: no `/etc/docker/daemon.json`, log driver `json-file`, no size limit. `/var/lib/docker/containers` = 5.1 MB.
- Alarm `sohei-disk-high`: `CWAgent` `disk_used_percent` > 85, period 300 s, 1 evaluation period.
- `df -h /` at 02:05:39 UTC:

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G  9.1G   11G  46% /
```

### Fault timeline (UTC)

| Time | What |
| --- | --- |
| 02:06:01 | Fault started: `docker run -d --name chatty alpine sh -c 'while true; do echo "fake log line $(date)"; done'` (SSM `475b7d2c-5a25-4ddb-adc2-f45fd85ef612`) |
| 02:06:04 | Safety guard started (`systemd-run --unit=sohei-disk-guard`): removes `chatty` if the disk reaches 90% |
| 02:08:20 | Speed check: `chatty` log 32 MB after 2 min 19 s (about 0.23 MB/s), disk still 46%. At this speed 85% would take about 9–10 hours |
| 02:10:48 | Speed-up (student's choice): fast filler `chatty-fast` (`alpine yes 'fake log line from chatty-fast'`), also only container logs. A second guard (`sohei-fast-guard`) stops it at 80% (stop, not remove, so its log stays) and starts `chatty-2`..`chatty-4` for the last part. The 90% guard now covers every `chatty*` container (SSM `e278bcd4-712e-4c8c-b484-cb030367f50f`) |
| 02:11:09 | Disk 49% (about 25 MB/s with the fast filler) |
| 02:14:01 | Fast-filler guard stopped `chatty-fast` at 87% (`df` value; the fast writes jumped past 80% between two 5-second checks); `chatty-2`..`chatty-4` started 02:14:02 |
| 02:16:08 | Disk back down to 67%. Likely reason: XFS (the server's file system) reserves extra space for a fast-growing file and gives it back once writing stops. `sohei-disk-high` stayed OK (87% lasted well under its 5-minute period) |
| 02:16:18 | **`sohei-cpu-high` went to ALARM** (email received by the student). Cause: the noisy containers are busy loops; `top` at 02:26:22 shows 0% idle (28% user, 72% system) |
| 02:26:22 | Disk 69% (about +0.2% per minute with 4 slow `chatty` containers) |
| 02:27:46 | Second speed-up: `docker start chatty-fast` (same log file), guard to stop it at 74% (SSM `00b9ecd0-5231-4a83-9449-05f091b1dc46`) |
| 02:27:50 | Guard stopped it after 4 seconds: `df` showed 89%. Real use at 02:31:59: 70%. Same XFS effect: reopening a big log file made XFS reserve a large block of space at once |
| 02:33:47 | Swap (student's choice): `docker stop chatty-2 chatty-3 chatty-4` (logs kept); started `chatty-steady`: `sh -c 'while true; do yes "fake log line from chatty-steady" \| head -n 40000; sleep 1; done'` (SSM `01e72592-5b63-4412-bd59-c24e49363af5`) |
| 02:34:19 | `chatty-steady` log 128 MB after 30 s (about 4 MB/s). Disk 70%. CPU still about 94% busy (original `chatty` loop + Docker writing logs) |
| 02:36:18 | `sohei-cpu-high` back to OK (after `chatty-2`..`chatty-4` were stopped) |
| 02:39:26 | Disk 79% (about +1.6% per minute) |
| 02:40:11 | Pause guard added (SSM `ab73fb1a-065e-4175-b54c-dcec1314a119`): `docker pause chatty-steady` at 86%. Reason: the disk alarm uses a 5-minute **average**, so at +1.6%/min the disk would hit the 90% guard before the alarm could fire. Pausing keeps the log file open, so the disk should hold near 86% instead of dropping back |
| 02:42:53 | Pause guard paused `chatty-steady`, but `df` already showed 91% (it jumped from 80% to 90% within one minute) |
| 02:42:59 | **90% safety guard removed all `chatty` containers at 91%.** Disk back to 46% by 02:43 |
| 02:45:48 | Investigation commands run (read-only), saved in `fault-evidence.md` |

### Result

- `sohei-disk-high` **did not fire.** The disk passed 85% only for about 1–2 minutes before the 90% guard stopped the fault; the alarm needs the 5-minute **average** above 85%.
- The only alert during the fault was `sohei-cpu-high` at 02:16:18 (10 min 17 s after the fault started), caused by the noisy containers using all the CPU.
- The app stayed up the whole time (health check 1 in every window).
- Possible prevention for the alarm (for the student to decide): a lower threshold (for example 80%) and/or `Maximum` with a 1-minute period, so a fast-filling disk is caught before it is full.
- Space that came back after removing the containers: disk 91% → 46% (about 9 GB).

### Round 2 – make the disk alarm fire (student's request)

| Time (UTC) | What |
| --- | --- |
| 02:50:12 | Safety backup by hand (OK), 90% guard on again, measured fill started (SSM `56b759ab-a848-4fcf-9d94-336b4feb85d9`) |
| 02:54:39 | Fill done: disk 88% (`df`), CloudWatch 87.0%, held steady with nothing writing |
| **02:58:53** | **`sohei-disk-high` went to ALARM** (10:58:53 UTC+8). Email arrived 10:58 AM UTC+8 (E-08-alert-email-3.png); OK email 11:03 AM (E-08-alert-email-4.png) |
| 03:02:11 | Evidence collected, then `docker rm -f` of all 10 `chatty-fill` containers. Disk 88% → 46% |
| 03:03:53 | `sohei-disk-high` back to OK (11:03:53 UTC+8) |

- Time to detect (round 2): disk passed 85% at about 02:54; alarm at 02:58:53 → about **5 minutes** (the alarm's 5-minute average).
- Time to fix (alarm → space back): 02:58:53 → 03:02:11 = **3 min 18 s**.

### Fix – Docker log size limit (step 6)

- Repo: new `deploy/daemon.json` (`json-file`, `max-size` 10m, `max-file` 3). `deploy/bootstrap.sh` now installs it to `/etc/docker/daemon.json` and restarts Docker, so a new server gets the limit too. `deploy/` uploaded to `s3://sohei-909927/app/deploy`.

| Time (UTC) | What |
| --- | --- |
| 03:05:0x | Backup by hand (OK), files synced from S3, `daemon.json` installed (SSM `24182f96-9b5a-471f-a3d9-d31387a4cb56`) |
| 03:05:12 | `systemctl restart docker` – live site down from here |
| 03:05:20 | `docker compose ... up -d --force-recreate` stopped part-way: "No such container" for the old nginx container (Docker had just restarted it with its own restart policy). `chat-mongodb` was left stopped; site gave 502 |
| 03:06:03 | `docker compose ... up -d` again (SSM `a1634e45-a351-46f4-8b00-831337745191`): all 4 containers running |
| 03:06:30 | Checked: local HTTP 200, CloudFront HTTPS 200, MongoDB 1 user / 2 conversations (data intact) |

- All 4 containers now show `json-file {"max-file":"3","max-size":"10m"}` (`docker inspect`).
- Downtime of the fix: about 1 minute (03:05:12 → about 03:06:05).
- Lesson for the runbook: after restarting Docker, check `docker ps` shows all 4 containers; if one is missing, run `docker compose ... up -d` again.

### Proof of the fix (step 7)

| Time (UTC) | What |
| --- | --- |
| 03:12:05 | `chatty` started again; `docker inspect` shows `json-file {"max-file":"3","max-size":"10m"}`. Disk 46% |
| 03:17:18 | After 5 min: 3 log files (2.9 MB + 9.6 MB + 9.6 MB = 23 MB). Disk still 46% |
| 03:17:19 | `docker rm -f chatty` |

### Timings for the incident report

| Measure | Round 1 (natural fill) | Round 2 (held above 85%) |
| --- | --- | --- |
| Fault started | 02:06:01 | 02:50:12 |
| First alert | `sohei-cpu-high` 02:16:18 (10 min 17 s) | `sohei-disk-high` 02:58:53 (8 min 41 s after start; about 5 min after passing 85%) |
| Disk alarm | Did not fire (above 85% only 1–2 min) | Fired |
| Stopped | 02:42:59 by the 90% guard | 03:02:11 by hand (3 min 18 s after the alarm) |
| Prevention applied | 03:05:12 – 03:06:30 (log limit, about 1 min downtime) | |
| Prevention proven | 03:12:05 – 03:17:19 | |

### Runbook facts (for `docs/runbook.md` – the student writes the sentences)

Headings (Appendix D): title, symptoms, first checks, fix steps, how to confirm fixed, prevention, last tested.

- **Symptoms seen in the test:** `sohei-disk-high` email (02:58:53); dashboard disk graph climbing; `sohei-cpu-high` email when the noisy container was a busy loop (02:16:18). The site itself stayed up until 90%.
- **First checks (read-only):** `df -h /` → 88%; `du -sh /var/lib/docker/containers/* | sort -h | tail` → many 1.1 GB folders; `docker system df` → containers only 2.464 kB (logs are not counted here); `ls -lhS /var/lib/docker/containers/*/*-json.log | head -3` → 1.1 GB `-json.log` files.
- **Fix steps used:** find the container by its folder ID (`docker ps -a --no-trunc | grep <id>`), then `docker rm -f <name>` for the noisy container only (never the 4 Sohei containers). Space came back at once (88% → 46%).
- **Confirm fixed:** `df -h /` back to 46%; `sohei-disk-high` back to OK (see alarm history); health check stays 1; site returns 200.
- **Prevention:** `deploy/daemon.json` (`max-size` 10m, `max-file` 3) installed to `/etc/docker/daemon.json`, `systemctl restart docker`, then `docker compose -f deploy-compose.yml -f /opt/sohei/app/deploy/docker-compose.aws.yml up -d --force-recreate` in `/opt/sohei/LibreChat`. Check `docker ps` shows all 4 containers; if one is missing, run `up -d` again (happened at 03:05:20). Check with `docker inspect -f '{{json .HostConfig.LogConfig}}' <name>`. Proven 03:12–03:17: log stopped at 23 MB in 3 files. `bootstrap.sh` installs it on any new server.
- **Possible extra prevention (student decides):** the disk alarm uses a 5-minute average at 85%; in round 1 the disk went 79% → 91% in about 4 minutes and the alarm never fired. A lower threshold (for example 80%) or `Maximum` over 1 minute would catch fast fills.
- **Last tested:** _(student follows the runbook's read-only checks once and writes the date)_

## Part D – security facts (checked live, read-only, 8 Nov 2026 about 03:40 UTC)

The student writes one sentence per control. Account number masked.

| Control | What was found | Command used |
| --- | --- | --- |
| Root MFA | `AccountMFAEnabled` = **0** in this account's summary. **Student to confirm** (the account is in an AWS Organization; root may be managed by the organization) | `aws iam get-account-summary` |
| IAM user + MFA | 1 IAM user (`Ethan`): MFA device = 1, console login on, 1 access key (used by the CLI to assume `AdminRole`) | `aws iam list-users`, `list-mfa-devices`, `list-access-keys` |
| Admin by role with MFA | `AdminRole` trust policy needs `aws:MultiFactorAuthPresent = true`; session max 1 hour | `aws iam get-role --role-name AdminRole` |
| Server role, least privilege | `sohei-ec2-role`: inline `sohei-ec2-access` + `CloudWatchAgentServerPolicy` + `AmazonSSMManagedInstanceCore` | `aws iam list-role-policies`, `list-attached-role-policies` |
| Secrets in Parameter Store | 8 parameters under `/sohei/`: 6 `SecureString` (GOOGLE_KEY, CREDS_KEY, CREDS_IV, JWT_SECRET, JWT_REFRESH_SECRET, MEILI_MASTER_KEY), 2 `String` (DOMAIN, ALLOW_REGISTRATION). Values not printed | `aws ssm describe-parameters` |
| No SSH | Instance has **no key pair**; security group has **no port 22 rule**. (The OS `sshd` still listens on 22 inside the server, but nothing can reach it.) Admin access only through Systems Manager | `aws ec2 describe-instances`, `describe-security-groups`, `ss -tlnp` |
| Port 80 only from CloudFront | `sg-00c36f88e0771f16f`: one inbound rule, TCP 80 from prefix list `pl-b8a742d1` = `com.amazonaws.global.cloudfront.origin-facing` | `aws ec2 describe-security-groups`, `describe-managed-prefix-lists` |
| IMDSv2 | `HttpTokens = required` | `aws ec2 describe-instances` |
| MongoDB not published | `chat-mongodb ports=27017/tcp` (container network only); only nginx publishes `0.0.0.0:80`. Meilisearch 7700 and API 3080 also internal only | `docker ps` (SSM `662d6220-980d-4369-a3fa-ec9f965bf522`) |
| HTTPS | CloudFront `E2UIHSZ4WECRY4`: viewer protocol `redirect-to-https`; minimum TLS `TLSv1` (default CloudFront certificate) | `aws cloudfront get-distribution-config` |
| WAF | **None** (`WebACLId` empty) – a gap | same |
| S3 bucket | All 4 public access blocks on; versioning `Enabled`; encryption `AES256` (SSE-S3) | `aws s3api get-public-access-block`, `get-bucket-versioning`, `get-bucket-encryption` |
| CloudTrail | `sam10-trail`: logging = True, multi-region = True | `aws cloudtrail describe-trails`, `get-trail-status` |
| Registration closed | Live `/api/config`: `registrationEnabled = False`, `socialLoginEnabled = False`, `passwordResetEnabled = False`; only email login | `curl https://d3jo5rdo8zr7zb.cloudfront.net/api/config` |
| Only invented data to Gemini | Handbook says "made-up building"; test questions use invented facts. Note: test question 10 used the student's own first name as the "resident" (it was refused) | `config/building-handbook.md`, test answers |

## Part D – secret scan (8 Nov 2026, 03:37 UTC)

| Scan | Command | Result |
| --- | --- | --- |
| Whole git history | `docker run --rm -v "<repo>:/repo:ro" ghcr.io/gitleaks/gitleaks:latest detect --source /repo --redact` | 10 commits, ~155 KB: **no leaks found** |
| Working folder (incl. uncommitted) | `gitleaks dir /repo --redact` | 1 finding: `generic-api-key` in `.impeccable/questions/seeds/57a6bd7ac096a88d.json` – a design-tool session ID called `key`, not a secret, and the folder is git-ignored (`.gitignore` line 6). False positive |
| Keywords in `docs/` | `grep -rIn -E '(KEY\|SECRET\|TOKEN)=[^ ]{8,}'` | No values found; words like "secret"/"token" appear only in explanations |
| Screenshot names | `ls docs/images` | No suspicious names |
| Tracked files | `git ls-files` | No `.env`, `.pem`, `.csv`, `.zip`, `.aws/` |
| Screenshots checked by eye (E-08-2/3/4, E-15) | – | No keys or passwords. **AWS account number visible** – mask before the repo goes public |

## Part D – Well-Architected facts (pass #2) – the student writes the verdicts

| Pillar | What Sohei does now (evidence) | Likely gaps |
| --- | --- | --- |
| Operational excellence | Dashboard `Sohei` (6 widgets); 5 alarms + US$10 Budget by email; request log `/sohei/requests`; backup cron every 6 h and Lambda health check every 15 min, both proven (E-14); runbook for disk full; config and scripts in git, server pulls them from S3 at start | No infrastructure as code (resources made by hand with the CLI); deploys are manual |
| Security | See the security table: MFA user, admin role with MFA, Parameter Store, no SSH, port 80 only from CloudFront, IMDSv2, private encrypted S3, CloudTrail, sign-ups closed; gitleaks clean | No WAF on CloudFront; minimum TLS `TLSv1`; root MFA not confirmed (`AccountMFAEnabled` = 0); 1 long-lived access key on the IAM user |
| Reliability | Backups every 6 h to S3, kept 7 days (RPO up to 6 h); restore tested in 2 min 31 s; S3 versioning restore tested; health-check alarm detected an outage in 16 min 37 s; disk alarm and log limit (Part C); `sohei.service` starts the app at boot | One server in one Availability Zone (`ap-southeast-2b`); `sohei-status-check-failed` only emails (`sohei-alerts`), no automatic recover action; no EBS snapshots (0 lifecycle policies); backups in the same region |
| Performance efficiency | `t3.medium`; average answer 1.27 s over 10 test questions (0.98–1.60 s); CloudFront in front | Burstable CPU hit 100% during the fault; no load testing |
| Cost optimisation | US$10/month Budget (85%, 100%, forecast); backups deleted after 7 days; Gemini free tier; Cost Explorer usage 7 Nov **US$0.19 (estimated, data incomplete)**, all of it covered by credits (6–8 Nov usage US$0.1924, credits −US$0.1924); EC2 compute is most of it (US$0.1584) | Server runs 24/7; CPU credits `unlimited` (extra charges if CPU stays high, as in the fault); full-day cost to be read again after Cost Explorer catches up (it lags up to 24 h) |
| Sustainability | One small server, 20 GB `gp3` encrypted disk, old backups deleted | x86 `t3` (an Arm `t4g` would use less energy); runs all night with few users |

- Cost per day for the website: read Cost Explorer again tomorrow for 7 Nov and 8 Nov (both still "Estimated"). Rough AWS price for a `t3.medium` in Sydney is about US$1.30/day (CLAUDE.md estimate, not measured).
- Reminder (Part D step 7): note the end of the "after" period, same length as the "before" period (before started 7 Nov 2026, 12:10 UTC).
