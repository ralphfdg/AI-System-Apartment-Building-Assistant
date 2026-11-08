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
