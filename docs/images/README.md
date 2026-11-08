# Screenshots for the website

Save each screenshot in this folder with exactly the name below. The website shows it automatically,
in place of its "Screenshot needed" box. No page needs editing.

Format: `E-XX-short-name.png` (lowercase after the ID, hyphens, PNG). Extra screenshots for the same ID: add `-2`, `-3` … (up to `-20`).
Extra screenshots appear by themselves: the plate turns into a carousel (swipe, or the arrow buttons). Exceptions, where the page lists its files on purpose: E-03, E-04, E-08, E-14, E-15 and the Results graph.

Before saving: check that no key, token or password is visible.

| File | What | Shown on |
| --- | --- | --- |
| `E-01-reskin.png` | Sohei with a real question and answer | Sohei & system card |
| `E-02-live-url.png` | The HTTPS link in the browser with the padlock | Sohei & system card |
| `E-03-test-1.png` … `E-03-test-10.png` | One per test question (number = question number). Results shows 1 (good), 8 (tricky) and 9 (weak answer) | Results |
| (uses `E-03-test-1` … `-10`) | E-04: all 10 test answers, as a carousel under the scoring table | Results |
| `E-05-original.png` | Original LibreChat | Sohei & system card, Baseline |
| `E-06-dashboard.png`, `E-06-dashboard-2.png` | CloudWatch dashboard with data (also the before/after graph on Results) | Monitoring, Results |
| `E-07-alarms.png` | Alarm list | Monitoring |
| `E-08-alert-email.png` | The 7 Nov health-check alert: `sohei-health-down` in ALARM in the CloudWatch alarm list | Monitoring |
| `E-08-alert-email-2.png`, `-3`, `-4` | CPU alarm, disk alarm and disk OK emails from the fault test | Automation & incident |
| `E-09-request-log.png` | Request log lines in CloudWatch | Monitoring |
| `E-10-backups-s3.png`, `E-10-backups-s3-2.png` | Backup files in S3 | Monitoring |
| `E-11-restore.png`, `E-11-restore-2.png` | Restore output and the restored chat | Monitoring |
| `E-12-iam-mfa.png`, `E-12-iam-mfa-2.png` | IAM users with MFA | Monitoring |
| `E-13-parameter-store.png` | Parameter names (values hidden) | Monitoring |
| `E-14-backup-runs.png`, `E-14-healthcheck-runs.png` | Automations with timestamps | Automation & incident |
| `E-15-fault-disk.png`, `E-15-fault-fix.png` | Fault investigation and fix | Automation & incident |
| `E-16-cost.png` | Cost before and after | Results |
| `E-17-well-architected.png` | Optional, if the free AWS Well-Architected Tool is used | Well-Architected |
| (uses `E-06-dashboard*.png`) | The before/after graph | Results |

E-18 (the architecture diagram) is drawn in `assets/img/architecture.svg`, so it needs no screenshot.
